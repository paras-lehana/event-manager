import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, Auth, User } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://demo.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000:web:000",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let rtdb: Database;

function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export function getFirebaseRTDB(): Database {
  if (!rtdb) {
    rtdb = getDatabase(getFirebaseApp());
  }
  return rtdb;
}

export async function signInAnon(): Promise<User> {
  const authInstance = getFirebaseAuth();
  const cred = await signInAnonymously(authInstance);
  return cred.user;
}

export function onAuthChange(callback: (user: User | null) => void) {
  const authInstance = getFirebaseAuth();
  return onAuthStateChanged(authInstance, callback);
}
