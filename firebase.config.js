// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe8T2atS2Ke5RINSWRqQpWR6Ke8nEQK3s",
  authDomain: "motherlandjams-e82ea.firebaseapp.com",
  databaseURL: "https://motherlandjams-e82ea-default-rtdb.firebaseio.com",
  projectId: "motherlandjams-e82ea",
  storageBucket: "motherlandjams-e82ea.firebasestorage.app",
  messagingSenderId: "935504820183",
  appId: "1:935504820183:web:c6a91a47568eb93981fd92",
  measurementId: "G-4VLLWZGNVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase services
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Initialize Analytics (only for web and only if supported)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics, auth, database, db, storage };
export default app;
