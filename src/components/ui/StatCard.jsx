import { cardClass } from '../../utils/format';

export default function StatCard({ title, value, hint, icon: Icon, tone = 'blue' }) {
  const palette = {
    blue: 'from-[#b55233] to-[#7a3420]',
    emerald: 'from-[#7f8a63] to-[#586145]',
    amber: 'from-[#d59d54] to-[#a86a2d]',
    slate: 'from-[#5e524a] to-[#2d2622]',
  };

  return (
    <div className={`${cardClass()} relative overflow-hidden`}>
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${palette[tone]}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7a6b]">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-[var(--hr-ink)]">{value}</p>
          <p className="mt-2 text-sm text-[var(--hr-muted)]">{hint}</p>
        </div>
        <div className="rounded-3xl bg-[#efe3d6] p-3 text-[#6a3d2e]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
