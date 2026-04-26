import { cert, getApps, initializeApp, ServiceAccount, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Firebase admin env vars not configured. Need FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY (paste the private_key value from the service account JSON, with \\n sequences preserved)."
    );
  }

  // Vercel stores the env var as a literal string, so escaped \n must be unescaped to real newlines.
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const serviceAccount: ServiceAccount = { projectId, clientEmail, privateKey };

  const existing = getApps().find((a) => a.name === "admin");
  adminApp =
    existing ?? initializeApp({ credential: cert(serviceAccount) }, "admin");
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) adminDb = getFirestore(getAdminApp());
  return adminDb;
}
