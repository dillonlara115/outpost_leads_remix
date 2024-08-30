import React from 'react';
import PropTypes from 'prop-types';
import { BusinessListTable } from './BusinessListTable';

const SingleSavedSearch = ({ searchData }) => {
  const { businesses, id: searchId } = searchData;

  return (
    <div>
      {businesses && businesses.length > 0 ? (
        <BusinessListTable
          businesses={businesses}
          userId={null} // Assuming you have logic to get the userId
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