// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_LaaQkFDwThfaaWc0bpmcm0HcfZCuQ40",
  authDomain: "motherland-b0f07.firebaseapp.com",
  databaseURL: "https://motherland-b0f07-default-rtdb.firebaseio.com",
  projectId: "motherland-b0f07",
  storageBucket: "motherland-b0f07.firebasestorage.app",
  messagingSenderId: "664608614063",
  appId: "1:664608614063:web:78860eebf49ae53e4b165a",
  measurementId: "G-HQ2XYJDPT3"
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

// Initialize Analytics (only for web and only if supported)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics, auth, database, db };
export default app;
