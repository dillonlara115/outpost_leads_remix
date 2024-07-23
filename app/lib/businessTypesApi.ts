import axios from 'axios';

export type BusinessType = string; // Define the type as a string for simplicity

export const fetchBusinessTypes = async (): Promise<BusinessType[]> => {
  const response = await axios.get('https://us-central1-outpostleads-8d880.cloudfunctions.net/api/business-types');
  console.log('Fetched business types:', response.data); // Add log to confirm data
  return response.data; // Assuming the response is an array of strings
};
