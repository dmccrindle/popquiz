import { Suspense } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EditorPanel from "@/components/admin/EditorPanel";

export default function EditorPage() {
  return (
    <div>
      <AdminPageHeader title="Trivia Editor" subtitle="Edit the 3 daily trivia questions." />
      <Suspense fallback={<div className="px-8 py-6 text-white/40 text-sm">Loading…</div>}>
        <EditorPanel />
      </Suspense>
    </div>
  );
}
