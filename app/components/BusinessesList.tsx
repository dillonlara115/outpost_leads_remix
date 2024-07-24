import React from 'react';
import { Text } from '@mantine/core';
import { Business } from '../lib/api';
import { BusinessCard } from './BusinessCard';

interface BusinessesListProps {
  businesses: Business[];
  userId: string | null;
  searchId: string | null;
}

const BusinessesList: React.FC<BusinessesListProps> = ({ businesses, userId, searchId }) => {
  return (
    <>
      {businesses.length ? (
        businesses.map((business, index) => (
          <BusinessCard key={index} business={business} userId={userId} searchId={searchId} />
        ))
      ) : (
        <Text>No businesses found</Text>
      )}
    </>
  );
};

export default BusinessesList;
