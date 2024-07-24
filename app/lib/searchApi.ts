import axios from 'axios';
import { doc, setDoc, getFirestore } from 'firebase/firestore'; // Import Firestore functions

// Import Firestore instance
import { db } from '../lib/firebase'; // Assuming you have a firebase.ts file with the db instance

export const saveSearch = async (userId: string, search: string, businesses: BusinessType[]): Promise<string> => {
   try {
    // Create a unique document path for the search
    const searchDocRef = doc(db, 'users', userId, 'savedSearches', search);

    // Save the search data to the document
    await setDoc(searchDocRef, {
      search, // Use searchId instead of searchName
      businesses,
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
