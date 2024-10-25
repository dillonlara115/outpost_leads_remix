import React from 'react';
import { AppShell, Group, Burger, Text, ScrollArea, NavLink, Box, Title, Pill } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import useAuth, { UserRole } from '~/lib/useAuth'; // Import the useAuth hook

const CustomAppShell: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const { user, role, logout } = useAuth(); // Use the useAuth hook

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Function to get a user-friendly role name
  const getRoleName = (role: UserRole | null) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.BETA_USER:
        return 'Beta User';
      case UserRole.MEMBER_TIER_1:
        return 'Tier 1 Member';
      case UserRole.MEMBER_TIER_2:
        return 'Tier 2 Member';
      default:
        return 'User';
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" grow>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <img src="/outpostleads-logo.png" alt="Outpost Logo" height={50} />
          </Group>
          {user && (
            <Group  justify="flex-end">
              <Text>{user.displayName || user.email}</Text>
              <Pill>{getRoleName(role)}</Pill>
            </Group>
          )}
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea style={{ height: '100%' }}>
          <Title order={4}>Menu</Title>
          <NavLink component={Link} to="/businesses" label="Fetch Businesses" />
          <NavLink component={Link} to="/saved-search" label="Saved Searches" />
          {user && <NavLink component="button" label="Sign Out" onClick={handleLogout} />}
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box style={{ flex: 1, padding: 'md' }}>
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default CustomAppShell;