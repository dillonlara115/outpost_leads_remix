import React, { useState } from 'react';
import { Container, Title, TextInput, Button, Text, Group } from '@mantine/core';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '~/lib/firebase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Title order={2}>Sign Up</Title>
      <TextInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <TextInput
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <Group mt="md">
        <Button onClick={handleSignup}>Sign Up with Email</Button>
        <Button onClick={handleGoogleSignup}>Sign Up with Google</Button>
      </Group>
      {error && <Text color="red">{error}</Text>}
    </Container>
  );
};

export default Signup;
