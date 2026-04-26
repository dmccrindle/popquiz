import { cert, getApps, initializeApp, ServiceAccount, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_BASE64 not set. Run `cat service-account.json | base64 | tr -d '\\n'` and paste the output as a single Vercel env var."
    );
  }

  let parsed: ServiceAccount;
  try {
    const json = Buffer.from(b64, "base64").toString("utf-8");
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_BASE64 could not be decoded/parsed: ${e instanceof Error ? e.message : "unknown"}`
    );
  }

  const existing = getApps().find((a) => a.name === "admin");
  adminApp =
    existing ?? initializeApp({ credential: cert(parsed) }, "admin");
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) adminDb = getFirestore(getAdminApp());
  return adminDb;
}
