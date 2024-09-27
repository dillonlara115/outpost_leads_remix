import axios, { isAxiosError } from 'axios';
export interface Business {
  // Define the structure of a business object based on your data
  place_id: string;
  name: string;
  description: string;
  full_address: string;
  about: {
    'From the business'?: { [key: string]: boolean };
    Other?: { [key: string]: boolean };
  };
  verified: boolean;
  photo: string;
  reviews_link: string;
  reviews: number;
  rating: number;
  phone: string;
  site: string;
  email: string;
  logo: string;
  location_link: string;
}

// Fetch a single business by ID  
export const fetchBusiness = async (place_id: string): Promise<Business> => {
  try {
    console.log("Fetching business with place_id:", place_id);
    const response = await axios.get('https://api.app.outscraper.com/maps/search-v3', {
      headers: {
        'X-API-KEY': process.env.OUTSCRAPER_API_KEY,
      },
      params: {
        query: place_id,
        limit: 1,
      },
    });

    console.log("Full API Response:", JSON.stringify(response.data, null, 2));

    let businessData;

    if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      businessData = response.data.data[0];
    } else if (response.data && response.data.results_location) {
      // The API might return a URL to fetch results later
      console.log("Results not ready yet. Location:", response.data.results_location);
      throw new Error('Results not ready yet. Please try again later.');
    } else if (response.data && typeof response.data === 'object') {
      // If the data is directly in the response
      businessData = response.data;
    } else {
      throw new Error('Unexpected API response structure');
    }

    console.log("Extracted business data:", businessData);

    if (!businessData) {
      throw new Error('No business data found');
    }

    return businessData as Business;
  } catch (error) {
    console.error('Error in fetchBusiness:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    throw error;
  }
};


// New function to fetch a business from the database
export const fetchBusinessFromDB = async (userId: string, searchId: string, businessId: string): Promise<Business | null> => {
  try {
    const businessDocRef = doc(db, 'users', userId, 'savedSearches', searchId, 'businesses', businessId);
    const businessDoc = await getDoc(businessDocRef);

    if (businessDoc.exists()) {
      return businessDoc.data() as Business;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching business from DB:', error);
    throw error;
  }
};

// Fetch businesses based on location and business type
export const fetchBusinesses = async (location: string, businessType: string): Promise<Business[]> => {
  console.log('fetchBusinesses called with:', { location, businessType });
  try {
    const response = await axios.post('https://us-central1-outpostleads-8d880.cloudfunctions.net/api/outscraper', {
      location,
      businessType,
    });
    console.log("Full Outscraper API Response:", response);
    console.log("Outscraper API Response Data:", JSON.stringify(response.data, null, 2));

    const { data } = response.data;
    console.log("Extracted data:", data);

    const fetchedBusinesses: Business[] = Array.isArray(data) ? data : [];
    console.log('Processed fetchedBusinesses:', fetchedBusinesses);

    return fetchedBusinesses;
  } catch (error) {
    console.error('Error in fetchBusinesses:', error);
    if (isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      console.error('Error config:', error.config);
    }
    throw error;
  }
};

// Filter businesses based on verified and ownership status
export const filterBusinesses = (
  businesses: Business[],
  verifiedFilter: string,
  ownerships: string[]
): Business[] => {
  let filtered = businesses;

  if (verifiedFilter !== 'all') {
    filtered = filtered.filter(business =>
      verifiedFilter === 'verified' ? business.verified : !business.verified
    );
  }

  if (ownerships.length > 0) {
    filtered = filtered.filter(business =>
      ownerships.every(ownership =>
        (business.about?.['From the business']?.[ownership] === true || business.about?.Other?.[ownership] === true)
      )
    );
  }

  return filtered;
};
