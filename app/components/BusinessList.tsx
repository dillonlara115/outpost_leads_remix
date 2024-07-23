import React, { useEffect, useState } from 'react';
import { Container, Title, Loader } from '@mantine/core';
import { fetchBusinesses, filterBusinesses, Business } from '../lib/api';
import { fetchBusinessTypes, BusinessType } from '../lib/businessTypesApi';
import { saveSearch } from '../lib/searchApi'; // Adjust the import path to your searches API   
import { auth } from '../lib/firebase'; // Adjust the import path to your Firebase config
import LocationInput from './LocationInput'
import BusinessTypeSelect from './BusinessTypeSelect';
import FilterAccordion from './FilterAccordion';
import BusinessesList from './BusinessesList';
import uuid from 'uuid';

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
  const [search, setSearch] = useState({ id: null, query: '' });
  const { v4: uuidv4 } = uuid;

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
   const searchId = uuidv4(); // Generate a unique identifier for the search
   try {
     // Construct location string, handling missing parts gracefully
     const location = `${city ? `${city}, ` : ''}${state ? `${state  }, ` : ''}${country ? `${country}, ` : ''}${postalCode}`.trim().replace(/, $/, '');
     const data = await fetchBusinesses(location, selectedBusinessType);
// Assuming you want to store the searchId along with the fetched data
const searchData = { businesses: [...data], searchId }; 
console.log('search data',  searchData);
setBusinesses(searchData.businesses); // Extract the businesses array
setFilteredBusinesses(searchData.businesses); // Initially, the filtered businesses are the same as the fetched businesses
setShowFilters(true);

   } catch (error) {
     console.error('Error fetching businesses:', error);
   } finally {
     setLoading(false);
   }
 };
  
  useEffect(() => {
    const filtered = filterBusinesses(businesses, verifiedFilter, selectedOwnerships);
    setFilteredBusinesses(filtered);
    console.log('filtered ', filtered);
  }, [verifiedFilter, selectedOwnerships, businesses]);

  const handleSaveSearch = async () => {

   // Get the current user
   const user = auth.currentUser?.uid;
   const userId = user;
    // Now use userId in your function logic
    console.log("Saving search for userId:", userId);
    try {
      await saveSearch(userId, search.id, businesses); // Pass search.id
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
      {showFilters && (
        <FilterAccordion
          verifiedFilter={verifiedFilter}
          setVerifiedFilter={setVerifiedFilter}
          selectedOwnerships={selectedOwnerships}
          setSelectedOwnerships={setSelectedOwnerships}
          ownershipOptions={ownershipOptions}
          handleSaveSearch={handleSaveSearch}
        />
      )}
      {loading ? (
  <Loader />
) : (
  <BusinessesList businesses={filteredBusinesses} userId={auth.currentUser?.uid} searchId={search.id} /> 
)}

    </Container>
  );
};

export default BusinessList;
