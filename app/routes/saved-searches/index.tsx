import { json } from '@remix-run/react';
import { db } from '~/lib/firebase'; // Adjust based on your actual Firebase setup

export const loader = async ({ request }) => {
  // try {
  //   // Verify the user's session and get their UID using Firebase Admin SDK


  //   // Fetch saved searches for the authenticated user
  //   const savedSearches = await db.collection('users').doc(userId).collection('savedSearches').get();
  //   const searches = savedSearches.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   return json(searches);
  // } catch (error) {
  //   console.error('Error fetching saved searches or verifying user:', error);
  //   // Respond with a 401 Unauthorized status if there's an error verifying the user
  //   return new Response('Unauthorized', { status: 401 });
  // }
};