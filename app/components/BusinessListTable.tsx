import { useState, useEffect } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Badge,
  Anchor,
  Flex,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconExternalLink, IconStar, IconStarHalfFilled, IconStarFilled, IconPhone } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Business } from '../lib/api';
import classes from './TableSort.module.css';


interface BusinessListTableProps {
  businesses: Business[];
  userId: string | null;
  searchId: string | null;
  verifiedFilter: string;
  selectedOwnerships: string[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Flex align="center" gap="xs">
      {[...Array(fullStars)].map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={16} color="#FFD700" />
      ))}
      {hasHalfStar && <IconStarHalfFilled size={16} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, i) => (
        <IconStar key={`empty-${i}`} size={16} color="#FFD700" />
      ))}
      <Text size="sm" ml={5}>{rating.toFixed(1)}</Text>
    </Flex>
  );
};

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

export function BusinessListTable({ businesses, verifiedFilter, selectedOwnerships }: BusinessListTableProps) {
   const [search, setSearch] = useState('');
   const [sortedData, setSortedData] = useState(businesses);
   const [sortBy, setSortBy] = useState<keyof Business | null>(null);
   const [reverseSortDirection, setReverseSortDirection] = useState(false);
   const [opened, { open, close }] = useDisclosure(false);

   useEffect(() => {
    const filteredData = businesses.filter(business => {
      // Apply verified filter
      if (verifiedFilter === 'verified' && !business.verified) return false;
      if (verifiedFilter === 'not_verified' && business.verified) return false;

      // Apply ownership filter
      if (selectedOwnerships.length > 0) {
        const businessOwnerships = getOwnershipStatus(business);
        if (!selectedOwnerships.some(ownership => businessOwnerships.includes(ownership))) {
          return false;
        }
      }

      return true;
    });

    setSortedData(sortData(filteredData, { sortBy, reversed: reverseSortDirection, search }));
  }, [businesses, verifiedFilter, selectedOwnerships, sortBy, reverseSortDirection, search]);

 
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

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format the number
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    // If the number doesn't have 10 digits, return it as is
    return phone;
  };

  const getOwnershipStatus = (business: Business): string[] => {
    const statuses: string[] = [];
    const fromBusiness = business.about?.['From the business'] || {};
    
    const ownershipTypes = [
      'Identifies as Asian-owned',
      'Identifies as Black-owned',
      'Identifies as disabled-owned',
      'Identifies as Indigenous-owned',
      'Identifies as Latino-owned',
      'Identifies as LGBTQ+ owned',
      'Identifies as veteran-owned',
      'Identifies as women-owned',
    ];

    for (const type of ownershipTypes) {
      if (fromBusiness[type] === true) {
        statuses.push(type);
      }
    }

    return statuses;
  };

  const rows = sortedData.map((business) => (
    <Table.Tr key={business.place_id}>
      <Table.Td>{business.site ? (
          <Anchor href={business.site} target="_blank" rel="noopener noreferrer">
            {business.name} <IconExternalLink size={14} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
          </Anchor>
        ) : (
          business.name
        )}</Table.Td>
      <Table.Td>{business.full_address}</Table.Td>
      <Table.Td><StarRating rating={business.rating} /></Table.Td>
      <Table.Td>{business.reviews}</Table.Td>
      <Table.Td>
      {business.phone ? (
          <Anchor href={`tel:${business.phone}`}>
            <Flex align="center" gap="xs">
              <IconPhone size={14} />
              <Text>{formatPhoneNumber(business.phone)}</Text>
            </Flex>
          </Anchor>
        ) : (
          'N/A'
        )}
      </Table.Td>
      <Table.Td>{business.email}</Table.Td>
      <Table.Td>
        <Badge color={business.verified ? 'green' : 'red'}>
          {business.verified ? 'Verified' : 'Not Verified'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group>
          {getOwnershipStatus(business).map((status) => (
            <Badge key={status} color="blue">
              {status}
            </Badge>
          ))}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search businesses"
        mb="md"
        leftSection={<IconSearch style={{ width: '1rem', height: '1rem' }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="lg" verticalSpacing="lg" miw={1500} layout="fixed" stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Rating</Table.Th>
            <Table.Th>Reviews</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Verified</Table.Th>
            <Table.Th>Minority Owned</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={10}>
                <Text fw={500} ta="center">
                  No businesses found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}