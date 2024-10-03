import React, { useState, useEffect } from 'react';
import { Select, Button, Loader, Stack } from '@mantine/core';
import { BusinessType } from '../lib/businessTypesApi';
import { auth } from '~/lib/firebase';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import useAuth, { UserRole } from '~/lib/useAuth';

interface BusinessTypeSelectProps {
  businessTypes: BusinessType[];
  selectedBusinessType: string;
  setSelectedBusinessType: (value: string) => void;
  businessTypesLoading: boolean;
  handleFetchBusinesses: () => void;
}

const BusinessTypeSelect: React.FC<BusinessTypeSelectProps> = ({ businessTypes, selectedBusinessType, setSelectedBusinessType, businessTypesLoading, handleFetchBusinesses }) => {
  const [savedSearchCount, setSavedSearchCount] = useState<number>(0);
  const { user, role } = useAuth();

  useEffect(() => {
    const fetchSavedSearchCount = async () => {
      if (user) {
        try {
          const db = getFirestore();
          const savedSearchesRef = collection(db, 'users', user.uid, 'savedSearches');
          const savedSearchesSnapshot = await getDocs(query(savedSearchesRef));
          setSavedSearchCount(savedSearchesSnapshot.size);
        } catch (err) {
          console.error('Error fetching saved search count:', err);
        }
      }
    };

    if (user) {
      fetchSavedSearchCount();
    }
  }, [user]);

  const isBetaUser = role === UserRole.BETA_USER;

  return (
    <>
      {businessTypesLoading ? (
        <Loader />
      ) : (
        <>
        <Stack>
          <Select
            placeholder="Select business type"
            data={businessTypes.map((type) => ({ value: type, label: type })).sort((a, b) => a.label.localeCompare(b.label))}
            value={selectedBusinessType}
            onChange={(value) => setSelectedBusinessType(value!)}
            mt="md"
          />
          <Button 
            onClick={handleFetchBusinesses} 
            mt="mb" 
            disabled={isBetaUser && savedSearchCount >= 5}
          >
            Fetch Businesses
          </Button>
          </Stack>
        </>
      )}
    </>
  );
};

export default BusinessTypeSelect;
