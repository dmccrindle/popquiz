import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-im3CGPMw8OR39BCuYFjYfhAD4LpZRUo",
  authDomain: "pop-quiz-daily-trivia.firebaseapp.com",
  projectId: "pop-quiz-daily-trivia",
  storageBucket: "pop-quiz-daily-trivia.firebasestorage.app",
  messagingSenderId: "253695290153",
  appId: "1:253695290153:web:91d588a32cab10ee0de538",
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function getClientApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client SDK can only be used in the browser.");
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getClientApp());
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) db = getFirestore(getClientApp());
  return db;
}

export function getGoogleProvider(): GoogleAuthProvider {
  return new GoogleAuthProvider();
}
