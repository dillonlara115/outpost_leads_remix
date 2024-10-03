import React, { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import { getFirestore, collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Button, Table, Modal, Text, Group, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import useAuth, { UserRole } from '~/lib/useAuth'; // Import useAuth and UserRole

interface SavedSearch {
  id: string;
  createdAt: any; // Firestore Timestamp
  businesses: {
    query: string;
    // Add other business fields if needed
  }[];
}

const db = getFirestore();

const SavedSearches: React.FC = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(null);
  const { user, role } = useAuth(); // Use the useAuth hook

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

  useEffect(() => {
    if (user) {
      fetchSavedSearches(user.uid)
        .then(searches => setSavedSearches(searches))
        .catch(error => console.error("Error fetching saved searches:", error));
    }
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'MMMM dd, yyyy hh:mm a');
  };

  const handleDeleteClick = (search: SavedSearch) => {
    setSearchToDelete(search);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (searchToDelete && user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
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

  if (!user) {
    return <div>Please log in to view saved searches.</div>;
  }

  return (
    <div>
      <h2>Saved Searches</h2>
      {role === UserRole.BETA_USER && savedSearches.length >= 5 && (
        <Text color="red">You have reached the maximum number of saved searches for beta users.</Text>
      )}
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Search Details</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {savedSearches.slice(0, role === UserRole.BETA_USER ? 5 : savedSearches.length).map(search => (
            <Table.Tr key={search.id}>
              <Table.Td>
                <Stack>
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