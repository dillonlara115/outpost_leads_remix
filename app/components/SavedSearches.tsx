import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import { Table } from '@mantine/core';
import { getFirestore, collection, query, getDocs, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { format } from 'date-fns';

interface SavedSearch {
  id: string;
  createdAt: any; // Firestore Timestamp
  searchQuery: string; // Add this field
}

const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const db = getFirestore();

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'MMMM dd, yyyy hh:mm a');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const savedSearchesCollectionRef = collection(userDocRef, "savedSearches");
        const q = query(savedSearchesCollectionRef);
        getDocs(q).then(querySnapshot => {
          const searches = querySnapshot.docs.map(doc => ({
            id: doc.id,
            createdAt: doc.data().createdAt,
            searchQuery: doc.data().searchQuery, // Add this line
            ...doc.data()
          }));
          setSavedSearches(searches);
        });
      } else {
        setSavedSearches([]);
      }
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div>
      <h2>Saved Searches</h2>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Search Query</Table.Th>
            <Table.Th>Created</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {savedSearches.map(search => (
            <Table.Tr key={search.id}>
              <Table.Td>
                <Link to={`/saved-search/${search.id}`}>
                  {search.searchQuery || 'Unnamed Search'}
                </Link>
              </Table.Td>
              <Table.Td>
                {formatDate(search.createdAt)}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default SavedSearches;