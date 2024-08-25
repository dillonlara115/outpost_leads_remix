import { LoaderFunction } from '@remix-run/node';
import { auth } from '~/lib/firebase';

export const authLoader: LoaderFunction = async () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      resolve(user);
    });
  });
};