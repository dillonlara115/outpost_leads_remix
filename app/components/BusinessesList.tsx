import React from 'react';
import { Business } from '../lib/api';
import { BusinessListTable } from './BusinessListTable';

interface BusinessesListProps {
  businesses: Business[];
  userId: string | null;
  searchId: string | null;
}

const BusinessesList: React.FC<BusinessesListProps> = ({ businesses, userId, searchId }) => {
  return (
    <BusinessListTable businesses={businesses} userId={userId} searchId={searchId} />
  );
};

export default BusinessesList;