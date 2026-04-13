export default function Chart({ title, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}
