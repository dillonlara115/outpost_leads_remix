import React from 'react';
import { Text, Stack } from '@mantine/core';
import { Business } from '../lib/api';
import { BusinessCard } from './BusinessCard';

interface BusinessesListProps {
  businesses: Business[];
  userId: string | null;
  searchId: string | null;
}

const BusinessesList: React.FC<BusinessesListProps> = ({ businesses, userId, searchId }) => {
  return (
    <Stack mt="md">
      {businesses.length ? (
        businesses.map((business, index) => (
          <BusinessCard key={index} business={business} userId={userId} searchId={searchId} />
        ))
      ) : (
        <Text>No businesses found</Text>
      )}
    </Stack>
  );
};

export default BusinessesList;
