import { 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query,
  limit,
  updateDoc,
  Timestamp,
  increment
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/firebase';
import { Business } from '../lib/api';
import { UserRole } from '../lib/useAuth';
import axios from 'axios';

export const MONTHLY_SEARCH_LIMITS = {
  [UserRole.BETA_USER]:10,
  [UserRole.PAID_USER]: 100,
  [UserRole.SUPER_ADMIN]: Infinity
};


export async function updateSearchCount(userId: string, userRole: UserRole): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  const now = new Date();
  let monthlySearches = userDoc.exists() ? userDoc.data().monthlySearches : null;

  if (!monthlySearches || new Date(monthlySearches.lastResetDate.toDate()).getMonth() !== now.getMonth()) {
    // Initialize or reset monthly searches
    monthlySearches = { count: 0, lastResetDate: Timestamp.fromDate(now) };
  }

  if (monthlySearches.count >= MONTHLY_SEARCH_LIMITS[userRole]) {
    throw new Error(`Monthly search limit of ${MONTHLY_SEARCH_LIMITS[userRole]} reached.`);
  }

  // Increment the count
  monthlySearches.count += 1;

  // Update the user document
  await setDoc(userRef, { monthlySearches }, { merge: true });

  return MONTHLY_SEARCH_LIMITS[userRole] - monthlySearches.count;
}

export async function performSearch(userId: string, searchParams: any) {
  // Perform the search operation
  const results = await actualSearchFunction(searchParams);

  if (results.length > 0) {
    // Only update the search count if there are results
    const remainingSearches = await updateSearchCount(userId);
    return { results, remainingSearches };
  }

  return { results, remainingSearches: null };
}

export const saveSearch = async (userId: string, searchQuery: string, businesses: Business[], userRole: UserRole): Promise<string> => {
  console.log('Starting saveSearch function');
  console.log('userId:', userId);
  console.log('searchQuery:', searchQuery);
  console.log('Number of businesses:', businesses.length);
  console.log('userRole:', userRole);

  try {
    const userDocRef = doc(db, 'users', userId);
    console.log('Fetching user document');
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User document does not exist');
    }

    const userData = userDoc.data();
    console.log('User data:', userData);

    const now = new Date();
    let monthlySearches = userData.monthlySearches || { count: 0, lastResetDate: Timestamp.fromDate(now) };

    if (!monthlySearches.lastResetDate || new Date(monthlySearches.lastResetDate.toDate()).getMonth() !== now.getMonth()) {
      // Reset count if it's a new month or if lastResetDate doesn't exist
      monthlySearches = { count: 0, lastResetDate: Timestamp.fromDate(now) };
    }

    if (monthlySearches.count >= MONTHLY_SEARCH_LIMITS[userRole]) {
      throw new Error(`You have reached the monthly search limit of ${MONTHLY_SEARCH_LIMITS[userRole]} for your user role.`);
    }

    // Increment the monthly search count
    monthlySearches.count += 1;

    // Update user document with new monthly search count
    await updateDoc(userDocRef, { monthlySearches });


    if (userRole === UserRole.BETA_USER) {
      console.log('Checking beta user saved search count');
      const savedSearchesRef = collection(db, 'users', userId, 'savedSearches');
      const savedSearchesQuery = query(savedSearchesRef, limit(6));
      const savedSearchesSnapshot = await getDocs(savedSearchesQuery);
      const actualSavedSearchCount = savedSearchesSnapshot.size;

      console.log('Actual saved search count:', actualSavedSearchCount);

      if (actualSavedSearchCount >= 5) {
        throw new Error('Beta users are limited to 5 saved searches.');
      }
    }

    const searchId = uuidv4();
    console.log('Generated searchId:', searchId);

    const searchDocRef = doc(db, 'users', userId, 'savedSearches', searchId);
    console.log('Saving search document with businesses');

    // Prepare businesses data
    const currentTime = Timestamp.now();
    const businessesData = businesses.map(business => ({
      ...business,
      savedAt: currentTime,
    }));

    await setDoc(searchDocRef, {
      id: searchId,
      searchQuery,
      createdAt: serverTimestamp(),
      businesses: businessesData,
    });

    console.log('Search document and businesses saved successfully');
    return 'Search and businesses saved successfully!';
  } catch (error) {
    console.error('Error saving search:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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
