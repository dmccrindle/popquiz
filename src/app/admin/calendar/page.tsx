import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CalendarPanel from "@/components/admin/CalendarPanel";

export default function CalendarPage() {
  return (
    <div>
      <AdminPageHeader
        title="Calendar"
        subtitle="Click any day to jump to its editor."
      />
      <CalendarPanel />
    </div>
  );
}
