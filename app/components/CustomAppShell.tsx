import React from 'react';
import {
  AppShell,
  Burger,
  Group,
  Box,
  ScrollArea,
  Title,
  Text,
  NavLink,
  Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from "@remix-run/react";

const CustomAppShell: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);

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
          <NavLink component="a" href="/" label="Fetch Businesses" />
          <NavLink component="a" href="/saved" label="Saved Searches" />
          <NavLink component="a" href="/signup" label="Sign Up" />
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
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
