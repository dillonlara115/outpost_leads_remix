import React from 'react';
import { TextInput, Stack } from '@mantine/core';

interface LocationInputProps {
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ city, setCity, state, setState, country, setCountry, postalCode, setPostalCode }) => (
    <Stack spacing="md">
      <TextInput
        placeholder="Enter city"
        value={city}
        onChange={(event) => setCity(event.currentTarget.value)}
      />
      <TextInput
        placeholder="Enter state"
        value={state}
        onChange={(event) => setState(event.currentTarget.value)}
      />
      <TextInput
        placeholder="Enter country"
        value={country}
        onChange={(event) => setCountry(event.currentTarget.value)}
      />
      <TextInput
        placeholder="Enter postal code"
        value={postalCode}
        onChange={(event) => setPostalCode(event.currentTarget.value)}
      />
    </Stack>
  );

export default LocationInput;
