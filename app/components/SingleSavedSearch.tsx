import React from 'react';
import PropTypes from 'prop-types';
import { BusinessListTable } from './BusinessListTable';
import { Business } from '../types/business';
import { Business as APIBusiness } from '../lib/api';


const SingleSavedSearch: React.FC<{ searchData: { businesses: Business[], id: string } }> = ({ searchData }) => {
  const { businesses, id: searchId } = searchData;

  return (
    <div>
      {businesses && businesses.length > 0 ? (
        <BusinessListTable
        businesses={businesses as unknown as APIBusiness[]}
        userId={null}
        searchId={searchId}
        />
      ) : (
        <div>No businesses found</div>
      )}
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