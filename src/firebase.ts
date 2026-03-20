import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDjwKN5ggEBUwXex1G2sv15DWRAuJ08KsM",
  authDomain: "kwality-dry-cleaners.firebaseapp.com",
  projectId: "kwality-dry-cleaners",
  storageBucket: "kwality-dry-cleaners.firebasestorage.app",
  messagingSenderId: "384933682426",
  appId: "1:384933682426:web:ecdda8343709bddeb0bd43",
  measurementId: "G-EWLRRV6N0Z"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
