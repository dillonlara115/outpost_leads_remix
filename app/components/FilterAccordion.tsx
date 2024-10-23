import React from 'react';
import { Stack, RadioGroup, Radio, Checkbox, Button } from '@mantine/core';

interface FilterAccordionProps {
  verifiedFilter: string;
  setVerifiedFilter: (value: string) => void;
  selectedOwnerships: string[];
  setSelectedOwnerships: (value: string[]) => void;
  ownershipOptions: { value: string; label: string }[];
  handleSaveSearch: () => void;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  verifiedFilter,
  setVerifiedFilter,
  selectedOwnerships,
  setSelectedOwnerships,
  ownershipOptions,
  handleSaveSearch,
}) => {
  const handleOwnershipChange = (value: string, checked: boolean) => {
    setSelectedOwnerships((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((v) => v !== value)
    );
  };

  return (
    <Stack spacing="md">
      <RadioGroup
        label="Filter by verification status"
        value={verifiedFilter}
        onChange={setVerifiedFilter}
        size="sm"
      >
        <Radio value="all" label="All businesses" />
        <Radio value="verified" label="Verified businesses" />
        <Radio value="not_verified" label="Not verified businesses" />
      </RadioGroup>

      <Stack spacing="xs">
        {ownershipOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selectedOwnerships.includes(option.value)}
            onChange={(event) => handleOwnershipChange(option.value, event.currentTarget.checked)}
          />
        ))}
      </Stack>

      <Button onClick={handleSaveSearch}>
        Save Search
      </Button>
    </Stack>
  );
};

export default FilterAccordion;