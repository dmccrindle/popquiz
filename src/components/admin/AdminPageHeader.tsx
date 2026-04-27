export default function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-white/5 flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
