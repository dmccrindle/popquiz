import AdminPageHeader from "@/components/admin/AdminPageHeader";
import UpcomingPanel from "@/components/admin/UpcomingPanel";

export default function UpcomingPage() {
  return (
    <div>
      <AdminPageHeader title="Upcoming" subtitle="Next 14 days at a glance." />
      <UpcomingPanel />
    </div>
  );
}
