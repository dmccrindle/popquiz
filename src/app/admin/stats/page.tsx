import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatsPanel from "@/components/admin/StatsPanel";

export default function StatsPage() {
  return (
    <div>
      <AdminPageHeader title="Stats" subtitle="Daily answer breakdown per question." />
      <StatsPanel />
    </div>
  );
}
