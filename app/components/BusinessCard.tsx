// src/components/BusinessCard.tsx

import React from 'react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';

interface Business {
  name: string;
  photo: string;
  description: string;
  full_address: string;
  about?: any;
  verified: boolean;
}

interface BusinessCardProps {
  business: Business;
  userId: string | null; // Add this line
  searchId: string | null;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const renderIdentifiesAs = (about: any) => {
    const fromBusiness = about?.['From the business'] || {};
    const other = about?.Other || {};
    const merged = { ...fromBusiness, ...other };
    const uniqueKeys = Array.from(new Set([...Object.keys(fromBusiness), ...Object.keys(other)]));

    return (
      <Group mt="md" gap={7}>
        {uniqueKeys.map((key) => (
          <Badge key={key} variant="light">
            {key}: {merged[key] ? 'Yes' : 'No'}
          </Badge>
        ))}
      </Group>
    );
  };

  return (
    <Card withBorder radius="md" p="md" style={{ width: '100%', marginBottom: '1rem' }}>
      <Card.Section>
      <Image src={business?.photo || 'defaultImagePath.jpg'} alt={business?.name || 'Default Name'} height={180} />
            </Card.Section>

      <Card.Section mt="md" p="md">
        <Group justify="apart">
          <Text size="lg">
          {business?.name}
          </Text>
          <Badge size="sm" variant="light">
            {business?.verified ? 'Verified' : 'Not Verified'}
          </Badge>
        </Group>
        <Text size="sm" mt="xs">
          {business?.description}
        </Text>
        <Text mt="md" color="dimmed">
          Address: {business?.full_address}
        </Text>
        {business?.about && renderIdentifiesAs(business?.about)}
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
};
