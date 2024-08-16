import axios, { isAxiosError } from 'axios';

export interface Business {
  // Define the structure of a business object based on your data
  id: string;
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

export const fetchBusinesses = async (location: string, businessType: string): Promise<Business[]> => {
  console.log('fetchBusinesses called with:', { location, businessType });
  const startTime = Date.now();

  try {
    const response = await axios.post('https://us-central1-outpostleads-8d880.cloudfunctions.net/api/businesses', {
      location,
      businessType,
    });

    console.log('Response received:', response); // Log the successful response
    const { data } = response.data;

    const fetchedBusinesses: Business[] = Array.isArray(data) ? data.slice(0, 10) : [];
    console.log('Fetched businesses:', fetchedBusinesses);

    const endTime = Date.now();
    console.log(`fetchBusinesses execution time: ${endTime - startTime}ms`);

    return fetchedBusinesses;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message); // Log Axios-specific errors
    } else {
      console.error('Unexpected error:', error); // Log non-Axios errors
    }
    throw error; // Re-throw the error for further handling or to indicate failure
  }
};

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
