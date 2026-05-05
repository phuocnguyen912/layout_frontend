import { cardClass } from '../../utils/format';

export default function Panel({ title, subtitle, children, action }) {
  return (
    <section className={cardClass()}>
      <div className="flex flex-col gap-3 border-b border-[#eadbcc] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--hr-ink)]">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-[var(--hr-muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
