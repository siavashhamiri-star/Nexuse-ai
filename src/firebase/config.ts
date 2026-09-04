import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This configuration is synced with your active Google Cloud / Firebase environment.
// It supports environment variables (ideal for Cloudflare Pages / external deploys) with safe fallback defaults.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDx_GweV_riHqyEP8C5Y8FsCaOstw5mKP0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "english-corner-with-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "english-corner-with-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "english-corner-with-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "291561199864",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:291561199864:web:9bc5ed3b9ee675f326030d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-emotionorienteda-8629bb93-23c7-4936-8d7a-a742c65af395";
export const db = getFirestore(app, dbId);

