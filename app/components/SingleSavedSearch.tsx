import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { BusinessCard } from '~/components/BusinessCard';

const SingleSavedSearch = ({ searchData }) => {
  const { businesses } = searchData;

  return (
    <div>
      {businesses && businesses.length > 0 ? (
        businesses.map((business, index) => (
          <BusinessCard
            key={index}
            business={business}
            userId={null} // Assuming you have logic to get the userId
            searchId={searchData.id} // Pass the searchId
          />
        ))
      ) : (
        <div>No businesses found</div>
      )}
    </div>
  );
};

SingleSavedSearch.propTypes = {
  searchData: PropTypes.shape({
    businesses: PropTypes.array.isRequired, // Add prop validation for 'businesses'
    id: PropTypes.string.isRequired, // Assuming 'id' is required
  }).isRequired,
};

export default SingleSavedSearch;
