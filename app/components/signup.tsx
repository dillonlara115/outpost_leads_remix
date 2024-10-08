import React, { useState } from 'react';
import { Paper, Title, TextInput, PasswordInput, Button } from '@mantine/core';
import classes from './signup.module.css';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword } from '~/lib/firebase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Use window.location.href instead of navigate
      window.location.href = '/';
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Use window.location.href instead of navigate
      window.location.href = '/';
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>

      <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
             Sign Up
            </Title>
      {error && <p>{error}</p>}
      <form onSubmit={handleEmailSignUp}>
        <TextInput label="Email address" placeholder="hello@gmail.com" size="md" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
          <PasswordInput
            type="password"
            value={password}
            label="Password"
            mt="md" size="md"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <Button fullWidth mt="xl" size="md"  type="submit">Sign Up with Email</Button>
      </form>
      <Button fullWidth mt="xl" size="md"  onClick={handleGoogleSignIn}>Sign Up with Google</Button>
      </Paper>
    </div>
  );
};

export default Signup;