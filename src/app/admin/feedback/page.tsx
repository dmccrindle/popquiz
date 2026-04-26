import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function FeedbackPage() {
  return (
    <div>
      <AdminPageHeader
        title="Feedback"
        subtitle="Submissions from the /feedback form."
      />
      <div className="px-8 py-6 max-w-3xl">
        <div className="rounded-2xl border border-dashed border-white/10 p-8 space-y-3">
          <h2 className="text-base font-bold text-white">Storage not yet enabled</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Right now feedback submissions are emailed straight to{" "}
            <span className="text-white">davidmccrindle@mac.com</span> via Resend.
            They&apos;re not stored anywhere, so there&apos;s no historical list to render
            here yet.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            To enable a list view, we&apos;d need to write each submission to Firestore.
            That requires either:
          </p>
          <ul className="list-disc pl-5 text-sm text-white/60 space-y-1">
            <li>
              Adding the Firebase Admin SDK with a service-account credential (one new
              env var on Vercel), or
            </li>
            <li>
              Loosening Firestore rules to allow public writes to a{" "}
              <code className="text-accent-pink">feedback</code> collection (with rate
              limiting).
            </li>
          </ul>
          <p className="text-sm text-white/60 leading-relaxed pt-2">
            Say the word and we&apos;ll wire one up.
          </p>
        </div>
      </div>
    </div>
  );
}
