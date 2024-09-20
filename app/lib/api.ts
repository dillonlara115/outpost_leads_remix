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
