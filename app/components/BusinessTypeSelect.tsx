import React from 'react';
import { Select, Button, Loader, Stack } from '@mantine/core';
import { BusinessType } from '../lib/businessTypesApi';

interface BusinessTypeSelectProps {
  businessTypes: BusinessType[];
  selectedBusinessType: string;
  setSelectedBusinessType: (value: string) => void;
  businessTypesLoading: boolean;
  handleFetchBusinesses: () => void;
}

const BusinessTypeSelect: React.FC<BusinessTypeSelectProps> = ({ businessTypes, selectedBusinessType, setSelectedBusinessType, businessTypesLoading, handleFetchBusinesses }) => (
    <>
      {businessTypesLoading ? (
        <Loader />
      ) : (
        <>
        <Stack>
          <Select
            placeholder="Select business type"
            data={businessTypes.map((type) => ({ value: type, label: type })).sort((a, b) => a.label.localeCompare(b.label))}
            value={selectedBusinessType}
            onChange={(value) => setSelectedBusinessType(value!)}
            mt="md"
          />
          <Button onClick={handleFetchBusinesses} mt="mb">Fetch Businesses</Button>
          </Stack>
        </>
      )}
    </>
  );

export default BusinessTypeSelect;
