import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCR6LElji--58hm_Oo8VDLkhrHpY7ieW5o',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'jyoti---a-spark-of-diwali.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'jyoti---a-spark-of-diwali',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'jyoti---a-spark-of-diwali.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '150882522565',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:150882522565:web:b22aedfc4f9a5f4f36a7ac',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-RN14TWSQS3',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;

