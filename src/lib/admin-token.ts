import { createRemoteJWKSet, jwtVerify } from "jose";
import { isAdmin } from "./admin-allowlist";

const FIREBASE_PROJECT_ID = "pop-quiz-daily-trivia";
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

export type VerifiedAdmin = { email: string; uid: string };

export async function verifyAdminRequest(
  request: Request
): Promise<{ ok: true; admin: VerifiedAdmin } | { ok: false; status: number; error: string }> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "Missing bearer token." };
  }
  const token = auth.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    const email = typeof payload.email === "string" ? payload.email : null;
    const uid = typeof payload.sub === "string" ? payload.sub : null;

    if (!email || !uid) {
      return { ok: false, status: 401, error: "Token missing email/uid." };
    }
    if (!isAdmin(email)) {
      return { ok: false, status: 403, error: "Not an admin." };
    }
    return { ok: true, admin: { email, uid } };
  } catch {
    return { ok: false, status: 401, error: "Invalid token." };
  }
}
