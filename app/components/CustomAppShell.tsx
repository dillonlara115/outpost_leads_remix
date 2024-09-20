import React, { useEffect, useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Box,
  ScrollArea,
  Title,
  Text,
  NavLink,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, Link } from "@remix-run/react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signOut } from '../lib/firebase'; // Adjust the import path to your firebase config

interface User {
  // Add relevant properties, e.g.:
  id: string;
  name: string;
  // ... other properties
}

const CustomAppShell: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // Hook for navigation
  const [setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || '',
          // Add other relevant properties from currentUser
        });
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Optional: Loading state while checking auth state
  if (user === undefined) {
    return <div>Loading...</div>; // Or any loading spinner component
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>Outpost Leads</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea style={{ height: '100%' }}>
          <Title order={4}>Menu</Title>
          <NavLink component={Link} to="/businesses" label="Fetch Businesses" />
          <NavLink component={Link} to="/saved-search" label="Saved Searches" />
          {/* Hide Sign Up link if user is signed in */}
          {user && <NavLink component="button" label="Sign Out"  onClick={handleLogout} />}
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box style={{ flex: 1, padding: 'md' }}>
          {/* Render the nested routes here */}
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default CustomAppShell;