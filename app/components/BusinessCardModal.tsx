import React from 'react';
import {
  Modal,
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
} from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { Business } from '../lib/api';

interface BusinessCardModalProps {
  business: Business | null;
  opened: boolean;
  onClose: () => void;
}

export function BusinessCardModal({ business, opened, onClose }: BusinessCardModalProps) {
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
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      padding={0}
      transitionProps={{ transition: 'fade', duration: 200 }}
    >
      {business && (
        <Card withBorder radius="md" p="md" style={{ width: '100%' }}>
          <Card.Section>
            <Image 
              src={business.photo || 'defaultImagePath.jpg'} 
              alt={business.name} 
              height={180} 
            />
          </Card.Section>

          <Card.Section mt="md" p="md">
            <Group justify="apart">
              <Text size="lg" fw={500}>{business.name}</Text>
              <Badge size="sm" variant="light">
                {business.verified ? 'Verified' : 'Not Verified'}
              </Badge>
            </Group>
            <Group>
              <Text size="sm" mt="xs">
                Rating: {business.rating} | Phone: {business.phone}
              </Text>
            </Group>
            <Text size="sm" mt="xs">
              {business.description}
            </Text>
            <Text mt="md" color="dimmed">
              Address: {business.full_address}
            </Text>
            {business.about && renderIdentifiesAs(business.about)}
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
      )}
    </Modal>
  );
}