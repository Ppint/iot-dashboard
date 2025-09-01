import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAuth, type Auth, signInAnonymously } from "firebase/auth";
import { env } from "@/utils/env";

export interface FirebaseClient {
  app: FirebaseApp;
  db: Database;
  auth: Auth;
}

export function getFirebaseClient(): FirebaseClient {
  const existing = getApps();
  const app =
    existing.length > 0
      ? existing[0]
      : initializeApp({
          apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
          projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
        });

  const db = getDatabase(app);
  const auth = getAuth(app);
  return { app, db, auth };
}

export async function ensureAnonymousAuth(): Promise<void> {
  const { auth } = getFirebaseClient();
  if (auth.currentUser) return;
  try {
    await signInAnonymously(auth);
  } catch (error) {
    // Swallow error to avoid crashing callers; callers can handle permission errors downstream
    console.error("[firebase] anonymous sign-in failed", error);
  }
}


