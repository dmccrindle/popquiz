import type { Metadata } from "next";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
        <div className="min-h-screen flex bg-background text-white">
          <AdminSidebar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </AdminAuthGate>
    </ToastProvider>
  );
}
