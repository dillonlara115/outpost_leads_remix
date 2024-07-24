import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/lib/firebase';


const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<{ id: string }[]>([]);
   const db = getFirestore();
 
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         // Adjusted path to target savedSearches within users/{userId}
         const userDocRef = doc(db, "users", user.uid);
         const savedSearchesCollectionRef = collection(userDocRef, "savedSearches");
         const q = query(savedSearchesCollectionRef);
         getDocs(q).then(querySnapshot => {
           const searches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setSavedSearches(searches);
         });
       } else {
         // User is signed out
         setSavedSearches([]);
       }
     });
 
     return () => unsubscribe(); // Cleanup subscription on unmount
   }, []);
 
  return (
   <div>
   <h2>Saved Searches</h2>
   <ul>
     {savedSearches.map(search => (
       <li key={search.id}>
         <p>Search ID: {search.id}</p>
       </li>
     ))}
   </ul>
 </div>
  );
};

export default SavedSearches;