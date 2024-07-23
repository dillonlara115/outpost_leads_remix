import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyC3C-SGWKjR4W5EWAAyRuUN7xxxuQ3SxMQ",
   authDomain: "outpostleads-8d880.firebaseapp.com",
   projectId: "outpostleads-8d880",
   storageBucket: "outpostleads-8d880.appspot.com",
   messagingSenderId: "283284414407",
   appId: "1:283284414407:web:c80dc463a7832a7eb083e2",
   measurementId: "G-NQW58WF34R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, signOut };
