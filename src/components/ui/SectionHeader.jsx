export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a4f35]">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hr-ink)]">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--hr-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}
