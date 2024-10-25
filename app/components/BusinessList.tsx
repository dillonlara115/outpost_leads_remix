import React, { useEffect, useState, useCallback } from 'react';
import { Container, Title, Loader, Text } from '@mantine/core';
import { fetchBusinesses, filterBusinesses, Business } from '../lib/api';
import { fetchBusinessTypes, BusinessType } from '../lib/businessTypesApi';
import { saveSearch, MONTHLY_SEARCH_LIMITS } from '../lib/searchApi';
import useAuth, { UserRole } from '~/lib/useAuth';
import LocationInput from './LocationInput';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import BusinessTypeSelect from './BusinessTypeSelect';
import FilterAccordion from './FilterAccordion';
import BusinessesList from './BusinessesList';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '~/lib/firebase';
import { Link } from '@remix-run/react';

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
  const [country, setCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('');
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [businessTypesLoading, setBusinessTypesLoading] = useState(true);
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, role } = useAuth();
  const [savedSearchCount, setSavedSearchCount] = useState<number>(0);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);

  const fetchSavedSearchCount = useCallback(async () => {
    if (user) {
      try {
        const db = getFirestore();
        const savedSearchesRef = collection(db, 'users', user.uid, 'savedSearches');
        const savedSearchesSnapshot = await getDocs(query(savedSearchesRef));
        setSavedSearchCount(savedSearchesSnapshot.size);
      } catch (err) {
        console.error('Error fetching saved search count:', err);
        setError('Failed to fetch saved search count');
      }
    }
  }, [user]);

  const fetchUserData = useCallback(async () => {
    if (user) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        if (userData && userData.monthlySearches) {
          const now = new Date();
          const lastResetDate = userData.monthlySearches.lastResetDate.toDate();
          if (lastResetDate.getMonth() !== now.getMonth()) {
            setRemainingSearches(MONTHLY_SEARCH_LIMITS[role as UserRole]);
          } else {
            setRemainingSearches(MONTHLY_SEARCH_LIMITS[role as UserRole] - userData.monthlySearches.count);
          }
        } else {
          setRemainingSearches(MONTHLY_SEARCH_LIMITS[role as UserRole]);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      }
    }
  }, [user, role]);

  useEffect(() => {
    if (user && !loading) {
      fetchSavedSearchCount();
      fetchUserData();
    }
  }, [user, loading, fetchSavedSearchCount, fetchUserData]);

  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        const types = await fetchBusinessTypes();
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
      const data = await fetchBusinesses(location, selectedBusinessType);
      setBusinesses(data);
      setFilteredBusinesses(data);
      setShowFilters(true);
      setSearchId(newSearchId);
      setSearchPerformed(true);
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

  const handleSaveSearch = async () => {
    if (role === UserRole.BETA_USER && savedSearchCount >= 5) {
      setError("You've reached the maximum number of saved searches for beta users.");
      return;
    }
    if (user && searchId) {
      try {
        await saveSearch(user.uid, searchId, businesses, role as UserRole);
        setSavedSearchCount(prevCount => prevCount + 1);
        console.log('Search saved successfully');
      } catch (error) {
        console.error('Error saving search:', error);
        setError('Failed to save search');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const isBetaUser = role === UserRole.BETA_USER;

  return (
    <Container>
      <Title order={2}>Fetch Business Leads</Title>
      <Text  c="dimmed" mb="md">Remaining Monthly Searches: {remainingSearches !== null ? remainingSearches : 'Loading...'}
      </Text>

      {isBetaUser && savedSearchCount >= 5 && (
        <Text color="red" size="sm" mb="sm">
          You have reached the maximum number of saved searches (5) for beta users. 
          Please <Link to="/saved-search">delete a saved search</Link> to save a new one.
        </Text>
      )}

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
          userRole={role}
          savedSearchCount={savedSearchCount}
        />
      )}
      {loading ? (
        <Loader />
      ) : searchPerformed ? (
        <BusinessesList 
          businesses={filteredBusinesses} 
          userId={auth.currentUser?.uid ?? null} 
          searchId={searchId}
          verifiedFilter={verifiedFilter}
          selectedOwnerships={selectedOwnerships}
        />
      ) : null}

    </Container>
  );
};

export default BusinessList;
