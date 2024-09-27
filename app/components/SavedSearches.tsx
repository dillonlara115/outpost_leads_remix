import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import { getFirestore, collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Button, Table, Modal, Text, Group, Stack } from '@mantine/core';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { format } from 'date-fns';
import { IconTrash } from '@tabler/icons-react';

interface SavedSearch {
  id: string;
  createdAt: any; // Firestore Timestamp
  businesses: {
    query: string;
    // Add other business fields if needed
  }[];
}

const db = getFirestore();

const fetchSavedSearches = async (userId: string): Promise<SavedSearch[]> => {
  const userDocRef = doc(db, "users", userId);
  const savedSearchesCollectionRef = collection(userDocRef, "savedSearches");
  const q = query(savedSearchesCollectionRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    createdAt: doc.data().createdAt,
    businesses: doc.data().businesses || [],
    ...doc.data()
  }));
};

const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(null);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'MMMM dd, yyyy hh:mm a');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const searches = await fetchSavedSearches(user.uid);
        setSavedSearches(searches);
      } else {
        setSavedSearches([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteClick = (search: SavedSearch) => {
    setSearchToDelete(search);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (searchToDelete && auth.currentUser) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const searchDocRef = doc(userDocRef, "savedSearches", searchToDelete.id);
        await deleteDoc(searchDocRef);
        
        setSavedSearches(prevSearches => 
          prevSearches.filter(search => search.id !== searchToDelete.id)
        );
        
        setDeleteModalOpen(false);
        setSearchToDelete(null);
      } catch (error) {
        console.error('Error deleting search:', error);
      }
    }
  };

  return (
    <div>
      <h2>Saved Searches</h2>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Search Details</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {savedSearches.map(search => (
            <Table.Tr key={search.id}>
              <Table.Td>
                <Stack spacing="xs">
                  <Link to={`/saved-search/${search.id}`}>               
                  <Text>{search.businesses[0]?.query || 'N/A'}</Text>
                  </Link>
                </Stack>
              </Table.Td>
              <Table.Td>
                {formatDate(search.createdAt)}
              </Table.Td>
              <Table.Td>
                <Button
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  variant="subtle"
                  onClick={() => handleDeleteClick(search)}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
        <Text>Are you sure you want to delete this saved search?</Text>
        <Group mt="md">
          <Button onClick={() => setDeleteModalOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="red">Delete</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default SavedSearches;