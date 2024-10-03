import React, { useEffect } from 'react';
import { Stack, RadioGroup, Radio, Checkbox, Button } from '@mantine/core';

interface FilterAccordionProps {
  verifiedFilter: string;
  setVerifiedFilter: (value: string) => void;
  selectedOwnerships: string[];
  setSelectedOwnerships: (value: string[]) => void;
  ownershipOptions: { value: string; label: string }[];
  handleSaveSearch: () => void;
  searchId: string;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  verifiedFilter,
  setVerifiedFilter,
  selectedOwnerships,
  setSelectedOwnerships,
  ownershipOptions,
  handleSaveSearch,
}) => {
  
  return (
    <Stack>
     
      <div style={{ marginBottom: '1rem' }}>
        <RadioGroup
          label="Filter by verification status"
          value={verifiedFilter}
          onChange={setVerifiedFilter}
          size="sm"
          style={{ marginBottom: '1rem' }}
        >
          <Radio value="all" label="All businesses" />
          <Radio value="verified" label="Verified businesses" />
          <Radio value="not_verified" label="Not verified businesses" />
        </RadioGroup>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        {ownershipOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={option.value}
            checked={selectedOwnerships.includes(option.value)}
            onChange={(event) =>
              setSelectedOwnerships((prev) =>
                event.currentTarget.checked
                  ? [...prev, option.value]
                  : prev.filter((v) => v !== option.value)
              )
            }
            style={{ marginBottom: '0.5rem' }}
          />
        ))}
      </div>
      <Button 
        onClick={handleSaveSearch} 
      >
        Save Search
      </Button>
    </Stack>
  );
};

export default FilterAccordion;