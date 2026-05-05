import { labelFromStatus, statusClasses } from '../../utils/format';

export default function StatusPill({ status }) {
  const tone = labelFromStatus(status);
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(tone)}`}>{status || 'N/A'}</span>;
}
