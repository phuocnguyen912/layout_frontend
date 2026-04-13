export default function DashboardCard({ title, value, delta }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {delta}
        </div>
      </div>
      <p className="mt-5 text-sm text-slate-500">Trailing performance for the current week.</p>
    </div>
  );
}
