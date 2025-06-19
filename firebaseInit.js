import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDZYttuhEjtpUebitTu3Z4d9szBY6Desw4",
  authDomain: "optical-25f3c.firebaseapp.com",
  databaseURL: "https://optical-25f3c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "optical-25f3c",
  storageBucket: "optical-25f3c.appspot.com",
  messagingSenderId: "1077695951998",
  appId: "1:1077695951998:android:f2e2a97d7a8f19a524142f",
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const database = getDatabase(app);

export { auth, database };
