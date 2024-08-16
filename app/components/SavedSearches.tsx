import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import { Table } from '@mantine/core';
import { getFirestore, collection, query, getDocs, doc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { format } from 'date-fns';


const SavedSearches = () => {
  interface SavedSearch {
    id: string;
    createdAt: string; // Add the 'createdAt' property
  }
  
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
   const db = getFirestore();


  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
    return format(date, 'MMMM dd, yyyy hh:mm a');
  };


   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         // Adjusted path to target savedSearches within users/{userId}
         const userDocRef = doc(db, "users", user.uid);
         const savedSearchesCollectionRef = collection(userDocRef, "savedSearches");
         const q = query(savedSearchesCollectionRef);
        getDocs(q).then(querySnapshot => {
          const searches = querySnapshot.docs.map(doc => ({ id: doc.id, createdAt: doc.data().createdAt, ...doc.data() }));
          setSavedSearches(searches);
        });
       } else {
         // User is signed out
         setSavedSearches([]);
       }
     });
 
     return () => unsubscribe(); // Cleanup subscription on unmount
   }, [ db ]);
 
  return (
   <div>
   <h2>Saved Searches</h2>
   <Table>
   <Table.Thead>
   <Table.Tr >
    <Table.Th>
         Search ID
         </Table.Th>
         <Table.Th>
         Created
         </Table.Th>
       </Table.Tr>
       </Table.Thead>
     {savedSearches.map(search => (
      <Table.Tr key={search.id}>
       <Table.Td >
       <Link to={`/saved-search/${search.id}`}>
         {search.id}
         </Link>
       </Table.Td>
       <Table.Td >
       {formatDate(search.createdAt)}
       </Table.Td>
       </Table.Tr>
     ))}
   </Table>
 </div>
  );
};

export default SavedSearches;