// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getDatabase, ref, push } from 'firebase/database'; // Add these imports
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBa85wxDLS_QHRDLC-PgOPSAP_tHc9kFLE",
  authDomain: "rcjoptical-e7b78.firebaseapp.com",
  projectId: "rcjoptical-e7b78",
  storageBucket: "rcjoptical-e7b78.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:android:abcdef123456",
  databaseURL: "https://rcjoptical-e7b78-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const database = getDatabase(app);

export { 
  auth, 
  database, 
  ref, 
  push, // Add this export
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
};