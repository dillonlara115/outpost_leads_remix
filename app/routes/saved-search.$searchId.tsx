import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SingleSavedSearch from '~/components/SingleSavedSearch';
import { db } from '~/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SingleSavedSearchPage = () => {
  const { searchId } = useParams<{ searchId: string }>();
  const [searchData, setSearchData] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        const userUid = currentUser.uid;
        const userDocRef = doc(db, "users", userUid);
        const searchesCol = collection(userDocRef, "savedSearches");
        const docRef = doc(searchesCol, searchId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Search not found");
        }

        setSearchData({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSearchData();
      } else {
        setLoading(false);
        setError("User not authenticated");
      }
    });

    return () => unsubscribe();
  }, [searchId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!searchData) return <div>Search not found</div>;

  return <SingleSavedSearch searchData={searchData} />;
};

export default SingleSavedSearchPage;
