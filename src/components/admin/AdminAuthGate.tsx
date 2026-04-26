"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import { isAdmin } from "@/lib/admin-allowlist";

type AdminAuthState = {
  user: User | null;
  loading: boolean;
  signOutAdmin: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthState>({
  user: null,
  loading: true,
  signOutAdmin: async () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleSignIn() {
    setSignInError(null);
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, getGoogleProvider());
      if (!isAdmin(result.user.email)) {
        await signOut(auth);
        setSignInError("This account isn't authorized.");
      }
    } catch (e) {
      setSignInError(e instanceof Error ? e.message : "Sign-in failed");
    }
  }

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Pop Quiz Admin</h1>
          <p className="text-sm text-white/50 mt-2">Sign in to continue.</p>
        </div>
        <button
          onClick={handleSignIn}
          className="flex items-center gap-3 px-7 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>
        {user && !isAdmin(user.email) && (
          <p className="text-sm text-red-400">
            {user.email} isn&apos;t on the allowlist.{" "}
            <button onClick={handleSignOut} className="underline hover:text-red-300">
              Sign out
            </button>
          </p>
        )}
        {signInError && <p className="text-sm text-red-400">{signInError}</p>}
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, signOutAdmin: handleSignOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
