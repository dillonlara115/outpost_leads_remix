import { useState } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Business } from '../lib/api';
import { BusinessCardModal } from './BusinessCardModal';
import classes from './TableSort.module.css';

interface BusinessListTableProps {
  businesses: Business[];
  userId: string | null;
  searchId: string | null;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: Business[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.entries(item).some(([key, value]) => 
      value && typeof value === 'string' && value.toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: Business[],
  payload: { sortBy: keyof Business | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}

export function BusinessListTable({ businesses, userId, searchId }: BusinessListTableProps) {
   const [search, setSearch] = useState('');
   const [sortedData, setSortedData] = useState(businesses);
   const [sortBy, setSortBy] = useState<keyof Business | null>(null);
   const [reverseSortDirection, setReverseSortDirection] = useState(false);
   const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
   const [opened, { open, close }] = useDisclosure(false);
 
  const setSorting = (field: keyof Business) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(businesses, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(businesses, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleBusinessClick = (business: Business) => {
   setSelectedBusiness(business);
   open();
 };

  const rows = sortedData.map((business) => (
   <Table.Tr key={business.id}>
     <Table.Td>
       <UnstyledButton onClick={() => handleBusinessClick(business)}>
         {business.name}
       </UnstyledButton>
     </Table.Td>
     <Table.Td>{business.full_address}</Table.Td>
     <Table.Td>{business.rating}</Table.Td>

   
     {/* Add more fields as needed */}
   </Table.Tr>
 ));

  return (
   <>
   <BusinessCardModal
        business={selectedBusiness}
        opened={opened}
        onClose={close}
      />
    <ScrollArea>
      <TextInput
        placeholder="Search businesses"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'full_address'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('full_address')}
            >
              Address
            </Th>
            <Th
              sorted={sortBy === 'rating'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rating')}
            >
              Rating
            </Th>
            {/* Add more column headers as needed */}
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text fw={500} ta="center">
                  No businesses found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
    </>
  );
}