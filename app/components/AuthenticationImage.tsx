import React, { useState, useEffect } from 'react';
import { Paper, Title, TextInput, PasswordInput, Checkbox, Button, Text, Anchor } from '@mantine/core';
import classes from './signup.module.css';
import { auth, googleProvider, signInWithPopup, signOut } from '~/lib/firebase';

export function AuthenticationImage() {
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        {user ? (
          <>
            <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
              Welcome, {user.displayName}!
            </Title>
            <Button fullWidth mt="xl" size="md" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
              Welcome back to Outpost Leads.
            </Title>

            <TextInput label="Email address" placeholder="hello@gmail.com" size="md" />
            <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
            <Checkbox label="Keep me logged in" mt="xl" size="md" />
            <Button fullWidth mt="xl" size="md">
              Login
            </Button>

            <Button fullWidth mt="xl" size="md" onClick={handleGoogleSignup}>
              Sign in with Google
            </Button>

            {error && <Text color="red" ta="center" mt="md">{error}</Text>}

            <Text ta="center" mt="md">
              Don&apos;t have an account?{' '}
              <Anchor<'a'> href="#" fw={700} onClick={(event) => event.preventDefault()}>
                Register
              </Anchor>
            </Text>
          </>
        )}
      </Paper>
    </div>
  );
}