import type { Metadata } from "next";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import AdminShell from "@/components/admin/AdminShell";
import ToastProvider from "@/components/admin/Toast";

export const metadata: Metadata = {
  title: "Pop Quiz Admin",
  description: "Pop Quiz Party admin dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminAuthGate>
        <AdminShell>{children}</AdminShell>
      </AdminAuthGate>
    </ToastProvider>
  );
}
