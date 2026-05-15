import StatusPill from '../StatusPill';
import { formatDateTime } from '../../../utils/format';

export default function SystemSyncOverview({ isPublisher, syncItems, health, mode }) {
  if (isPublisher && syncItems.length > 0) {
    return (
      <div className="space-y-4">
        {syncItems.map((item) => (
          <div key={`${item.Node}-${item.LastSyncTime}`} className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--hr-ink)]">{item.Node}</p>
                <p className="mt-1 text-sm text-[var(--hr-muted)]">Lần cuối: {formatDateTime(item.LastSyncTime)}</p>
              </div>
              <StatusPill status={item.TrangThai} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
      <p className="font-semibold text-[var(--hr-ink)]">Thông tin health</p>
      <p className="mt-2 text-sm text-[var(--hr-muted)]">Chế độ: {health?.mode || mode}</p>
      <p className="mt-1 text-sm text-[var(--hr-muted)]">Thời gian: {formatDateTime(health?.timestamp)}</p>
    </div>
  );
}
