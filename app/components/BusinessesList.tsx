import React from 'react';
import { Text } from '@mantine/core';
import { Business } from '../lib/api';
import { BusinessCard } from './BusinessCard';

interface BusinessesListProps {
  businesses: Business[];
}

const BusinessesList: React.FC<BusinessesListProps> = ({ businesses }) => {
  return (
    <>
      {businesses.length > 0 ? (
        businesses.map((business, index) => (
          <BusinessCard key={index} business={business} />
        ))
      ) : (
        <Text>No businesses found</Text>
      )}
    </>
  );
};

export default BusinessesList;
