import axios from 'axios';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { v4 as uuidv4 } from 'uuid';
// Import Firestore instance
import { db } from '../lib/firebase'; // Assuming you have a firebase.ts file with the db instance
import { BusinessType } from '../types/businesstypes';
export const saveSearch = async (userId: string, searchQuery: string, businesses: BusinessType[]): Promise<string> => {
  try {
    const searchId = uuidv4(); // Generate a unique ID for the search
    const searchDocRef = doc(db, 'users', userId, 'savedSearches', searchId);

    // Save the search data to the document
    await setDoc(searchDocRef, {
      id: searchId,
      searchQuery, // Store the search query
      businesses,
      createdAt: serverTimestamp(),
    });

    return 'Search saved successfully!';
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};


export const fetchSavedSearches = async (userId: string) => {
  try {
    const response = await axios.get(`https://us-central1-outpostleads-8d880.cloudfunctions.net/saved-searches/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    throw error;
  }
};
