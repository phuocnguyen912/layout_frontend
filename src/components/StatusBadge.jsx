export default function StatusBadge({ status }) {
  const statusClasses = {
    'Up to date': 'bg-emerald-100 text-emerald-700',
    Syncing: 'bg-amber-100 text-amber-700',
    Delayed: 'bg-rose-100 text-rose-700',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}
