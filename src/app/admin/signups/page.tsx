import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SignupsPanel from "@/components/admin/SignupsPanel";

export default function SignupsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Email Signups"
        subtitle="Subscribers from the homepage form (via Resend)."
      />
      <SignupsPanel />
    </div>
  );
}
