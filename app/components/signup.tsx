import React, { useState, useEffect } from 'react';
import { Container, Title, Button, Text, Group } from '@mantine/core';
import { auth, googleProvider, signInWithPopup, signOut } from '~/lib/firebase';

const Signup: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Container>
      {user ? (
        <>
          <Title order={2}>Welcome, {user.displayName}</Title>
          <pre>{user.uid}</pre>
          <Group mt="md">
            <Button onClick={handleLogout}>Log Out</Button>
          </Group>
        </>
      ) : (
        <>
          <Title order={2}>Sign Up</Title>
          <Group mt="md">
            <Button onClick={handleGoogleSignup}>Sign Up with Google</Button>
          </Group>
          {error && <Text color="red">{error}</Text>}
        </>
      )}
    </Container>
  );
};

export default Signup;
