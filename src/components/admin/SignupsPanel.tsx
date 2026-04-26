"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "./AdminAuthGate";
import { useToast } from "./Toast";

type Contact = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  unsubscribed: boolean;
  createdAt: string | null;
};

export default function SignupsPanel() {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/signups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `${res.status}`);
      }
      const data = (await res.json()) as { contacts: Contact[] };
      setContacts(data.contacts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
      toast("Load failed", true);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const subscribed = contacts?.filter((c) => !c.unsubscribed) ?? [];
  const unsubscribed = contacts?.filter((c) => c.unsubscribed) ?? [];

  return (
    <div className="px-8 py-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <Stat label="Subscribed" value={subscribed.length} highlight />
          <Stat label="Unsubscribed" value={unsubscribed.length} />
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && !contacts && <p className="text-sm text-white/40">Loading…</p>}

      {contacts && contacts.length === 0 && !loading && (
        <p className="text-sm text-white/40 text-center py-12">No signups yet.</p>
      )}

      {contacts && contacts.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-white/60 text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-white/60 text-xs uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-left px-4 py-3 font-semibold text-white/60 text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white">{c.email}</td>
                  <td className="px-4 py-3 text-white/60">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {c.unsubscribed ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/10 text-white/50 rounded-full">
                        Unsubscribed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500/90 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
      <div
        className={`text-2xl font-extrabold ${highlight ? "text-accent-pink" : "text-white"}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
