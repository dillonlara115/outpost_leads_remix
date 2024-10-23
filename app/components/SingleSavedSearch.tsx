import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BusinessListTable } from './BusinessListTable';
import { Business } from '../types/business';

const SingleSavedSearch: React.FC<{ searchData: { businesses: Business[], id: string } }> = ({ searchData }) => {
  const { businesses, id: searchId } = searchData;
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);

  return (
    <div>
      <h2>Saved Search Results</h2>
      <BusinessListTable 
        businesses={businesses} 
        userId={null} 
        searchId={searchId}
        verifiedFilter={verifiedFilter}
        selectedOwnerships={selectedOwnerships}
      />
    </div>
  );
};

SingleSavedSearch.propTypes = {
  searchData: PropTypes.shape({
    businesses: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default SingleSavedSearch;