import Panel from './Panel';
import SectionHeader from './SectionHeader';

export default function PagePlaceholder({
  eyebrow,
  title,
  description,
  panelTitle,
  panelSubtitle,
  children,
}) {
  return (
    <>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <Panel title={panelTitle} subtitle={panelSubtitle}>
        <p className="text-sm text-[var(--hr-muted)]">{children}</p>
      </Panel>
    </>
  );
}
