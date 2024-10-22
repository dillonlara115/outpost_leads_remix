import React from 'react';
import { Business } from '../lib/api';
import { BusinessListTable } from './BusinessListTable';

interface BusinessesListProps {
  businesses: Business[];
  userId: string | null;
  searchId: string | null;
  verifiedFilter: string;
  selectedOwnerships: string[];
}

const BusinessesList: React.FC<BusinessesListProps> = ({ 
  businesses, 
  userId, 
  searchId, 
  verifiedFilter, 
  selectedOwnerships 
}) => {
  return (
    <BusinessListTable 
      businesses={businesses} 
      userId={userId} 
      searchId={searchId} 
      verifiedFilter={verifiedFilter} 
      selectedOwnerships={selectedOwnerships} 
    />
  );
};

export default BusinessesList;