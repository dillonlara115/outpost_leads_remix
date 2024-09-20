import React, { useEffect, useState } from 'react';
import { Container, Title, Loader } from '@mantine/core';
import { fetchBusinesses, filterBusinesses, Business } from '../lib/api';
import { fetchBusinessTypes, BusinessType } from '../lib/businessTypesApi';
import { saveSearch } from '../lib/searchApi';
import { auth } from '../lib/firebase';
import LocationInput from './LocationInput';
import BusinessTypeSelect from './BusinessTypeSelect';
import FilterAccordion from './FilterAccordion';
import BusinessesList from './BusinessesList';
import { v4 as uuidv4 } from 'uuid';


const ownershipOptions = [
  { value: 'Identifies as Asian-owned', label: 'Identifies as Asian-owned' },
  { value: 'Identifies as Black-owned', label: 'Identifies as Black-owned' },
  { value: 'Identifies as disabled-owned', label: 'Identifies as disabled-owned' },
  { value: 'Identifies as Indigenous-owned', label: 'Identifies as Indigenous-owned' },
  { value: 'Identifies as Latino-owned', label: 'Identifies as Latino-owned' },
  { value: 'Identifies as LGBTQ+ owned', label: 'Identifies as LGBTQ+ owned' },
  { value: 'Identifies as veteran-owned', label: 'Identifies as veteran-owned' },
  { value: 'Identifies as women-owned', label: 'Identifies as women-owned' },
];

const BusinessList: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States'); // Default to United States
  const [postalCode, setPostalCode] = useState('');
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [businessTypesLoading, setBusinessTypesLoading] = useState(true);
  const [verifiedFilter, setVerifiedFilter] = useState('all'); // all, verified, not_verified
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);





  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        const types = await fetchBusinessTypes();
        console.log('Fetched business types:', types);
        setBusinessTypes(types);
      } catch (error) {
        console.error('Error fetching business types:', error);
      } finally {
        setBusinessTypesLoading(false);
      }
    };

    loadBusinessTypes();
  }, []);

  const handleFetchBusinesses = async () => {
    setLoading(true);
    setShowFilters(false);
    setSearchPerformed(false);
    const newSearchId = uuidv4();
    try {
      const location = `${city ? `${city}, ` : ''}${state ? `${state}, ` : ''}${country ? `${country}, ` : ''}${postalCode}`.trim().replace(/, $/, '');
      console.log('Fetching businesses with:', { location, selectedBusinessType });
      const data = await fetchBusinesses(location, selectedBusinessType);
      console.log('Raw data from fetchBusinesses:', data);
      setBusinesses(data);
      setFilteredBusinesses(data);
      setShowFilters(true);
      setSearchId(newSearchId);
      setSearchPerformed(true);
      console.log('After state updates - businesses:', data);
      console.log('After state updates - filteredBusinesses:', data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setSearchPerformed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = filterBusinesses(businesses, verifiedFilter, selectedOwnerships);
    setFilteredBusinesses(filtered);
  }, [verifiedFilter, selectedOwnerships, businesses]);

  useEffect(() => {
    console.log('businesses state updated:', businesses);
  }, [businesses]);
  
  useEffect(() => {
    console.log('filteredBusinesses state updated:', filteredBusinesses);
  }, [filteredBusinesses]);

const handleSaveSearch = async () => {
  const user = auth.currentUser?.uid;

    if (!user || !searchId || !businesses) {
      console.error("Missing required data: user, searchId, or businesses are null or undefined.");
      return;
    }

    console.log("Saving search for userId:", user);
    try {
      await saveSearch(user, searchId, businesses);
      console.log('Search saved successfully');
    } catch (error) {
      console.error('Error saving search:', error);
    }
};

  return (
    <Container>
      <Title order={2} mb="md">Fetch Business Leads</Title>
      <LocationInput
        city={city}
        setCity={setCity}
        state={state}
        setState={setState}
        country={country}
        setCountry={setCountry}
        postalCode={postalCode}
        setPostalCode={setPostalCode}
      />
      <BusinessTypeSelect
        businessTypes={businessTypes}
        selectedBusinessType={selectedBusinessType}
        setSelectedBusinessType={setSelectedBusinessType}
        businessTypesLoading={businessTypesLoading}
        handleFetchBusinesses={handleFetchBusinesses}
      />
      {searchPerformed && showFilters && businesses.length > 0 && (
        <FilterAccordion
          verifiedFilter={verifiedFilter}
          setVerifiedFilter={setVerifiedFilter}
          selectedOwnerships={selectedOwnerships}
          setSelectedOwnerships={setSelectedOwnerships}
          ownershipOptions={ownershipOptions}
          handleSaveSearch={handleSaveSearch}
          searchId={searchId}
        />
      )}
      {loading ? (
        <Loader />
      ) : searchPerformed ? (
        <>
          {console.log('Rendering BusinessesList with:', { businesses: filteredBusinesses, userId: auth.currentUser?.uid, searchId })}
          <BusinessesList businesses={filteredBusinesses} userId={auth.currentUser?.uid  ?? null} searchId={searchId} />
        </>
      ) : null}
    </Container>
  );
};

export default BusinessList;
