import axios from 'axios';

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
  logo: string;
}

export const fetchBusinesses = async (location: string, businessType: string): Promise<Business[]> => {
   try {
     const response = await axios.post('https://us-central1-outpostleads-8d880.cloudfunctions.net/api/businesses', {
       location,
       businessType,
     });
     console.log('Response:', response); // Log the successful response
     const { data } = response.data;
 
     const fetchedBusinesses: Business[] = Array.isArray(data) ? data.slice(0, 10) : [];
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