// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (only for web)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics, auth, db };
export default app;
