import { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  BETA_USER = 'beta_user',
  MEMBER_TIER_1 = 'member_tier_1',
  MEMBER_TIER_2 = 'member_tier_2',
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData?.role as UserRole || null;
            setAuthState({ user, role, loading: false });
          } else {
            console.log('No user document found!');
            setAuthState({ user, role: null, loading: false });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setAuthState({ user, role: null, loading: false });
        }
      } else {
        setAuthState({ user: null, role: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user: authState.user,
    role: authState.role,
    loading: authState.loading,
    signInWithGoogle,
    logout,
  };
};

export default useAuth;