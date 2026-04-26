"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "./AdminAuthGate";

const navSections: { label: string; items: { label: string; href: string; icon: string }[] }[] = [
  {
    label: "Trivia",
    items: [
      { label: "Editor", href: "/admin/editor", icon: "✏︎" },
      { label: "Calendar", href: "/admin/calendar", icon: "▦" },
      { label: "Upcoming", href: "/admin/upcoming", icon: "▤" },
      { label: "Stats", href: "/admin/stats", icon: "▣" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Daily Brief", href: "/admin/brief", icon: "✦" },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Feedback", href: "/admin/feedback", icon: "✉︎" },
      { label: "Email Signups", href: "/admin/signups", icon: "◉" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOutAdmin } = useAdminAuth();

  return (
    <aside className="w-64 shrink-0 bg-white/[0.02] border-r border-white/5 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-lg font-extrabold bg-gradient-to-r from-accent-pink to-accent-purple bg-clip-text text-transparent">
            Pop Quiz
          </span>
          <span className="text-xs text-white/40 font-semibold tracking-wider uppercase mt-0.5">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="px-6 text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">
              {section.label}
            </p>
            <ul>
              {section.items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "text-white bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 border-l-2 border-accent-pink"
                          : "text-white/60 hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent"
                      }`}
                    >
                      <span className="w-4 text-center text-white/50">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-xs font-bold text-white">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/80 truncate">{user?.email}</p>
            <button
              onClick={signOutAdmin}
              className="text-[11px] text-white/40 hover:text-white/70 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
