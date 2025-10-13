// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXypAgoERQQs7nifgtxLotHBo7pEpZJvk",
  authDomain: "motherland-b862a.firebaseapp.com",
  projectId: "motherland-b862a",
  storageBucket: "motherland-b862a.firebasestorage.app",
  messagingSenderId: "345446689495",
  appId: "1:345446689495:web:744a13902126c82bfc1e92",
  measurementId: "G-93JKPSKENS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
