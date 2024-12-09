// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNrUYlCxnlq1cU3gSUSpMp_HN6bpbr4zQ",
  authDomain: "learn-with-ai-auth.firebaseapp.com",
  projectId: "learn-with-ai-auth",
  storageBucket: "learn-with-ai-auth.appspot.com",
  messagingSenderId: "569932235495",
  appId: "1:569932235495:web:62ea55498ab6867db99842"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db, provider };