export default function AttendanceEmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d9c6b6] bg-[#fffaf5] px-5 py-8 text-center">
      <p className="text-base font-semibold text-[var(--hr-ink)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--hr-muted)]">{description}</p>
    </div>
  );
}
