import { getApps, initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getDatabase, Database } from "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp
let db: Database

export const initFirebase = () => {
  firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getDatabase(firebaseApp);
};

export {
  firebaseApp,
  db
}