import axios from 'axios';
import { doc, setDoc, serverTimestamp, collection, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import { v4 as uuidv4 } from 'uuid';
// Import Firestore instance
import { db } from '../lib/firebase'; // Assuming you have a firebase.ts file with the db instance
import { Business } from '../lib/api';

export const saveSearch = async (userId: string, searchQuery: string, businesses: Business[]): Promise<string> => {
  try {
    const searchId = uuidv4();
    const searchDocRef = doc(db, 'users', userId, 'savedSearches', searchId);
    const businessesCollectionRef = collection(db, 'users', userId, 'savedSearches', searchId, 'businesses');

    // Save the search data
    await setDoc(searchDocRef, {
      id: searchId,
      searchQuery,
      createdAt: serverTimestamp(),
    });

    // Save each business
    for (const business of businesses) {
      const businessId = business.place_id || uuidv4();
      await setDoc(doc(businessesCollectionRef, businessId), {
        ...business,
        savedAt: serverTimestamp(),
      });
    }

    return 'Search and businesses saved successfully!';
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};

// Delete a search
export const deleteSearch = async (userId: string, searchId: string): Promise<void> => {
  try {
    const searchDocRef = doc(db, 'users', userId, 'savedSearches', searchId);
    await deleteDoc(searchDocRef);
    console.log('Search deleted successfully');
  } catch (error) {
    console.error('Error deleting search:', error);
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
