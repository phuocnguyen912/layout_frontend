import Panel from '../../../components/ui/Panel';
import StatusPill from '../../../components/ui/StatusPill';

export default function AttendanceStatusSummary({ latest }) {
  return (
    <Panel title="Trạng thái gần nhất" subtitle="Tóm tắt bản ghi chấm công mới nhất trong bộ lọc đang chọn.">
      {!latest ? (
        <p className="text-sm text-[var(--hr-muted)]">Chưa có dữ liệu để hiển thị lần chấm công gần nhất.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Ngày</p>
            <p className="mt-1 text-lg font-semibold text-[var(--hr-ink)]">{latest.date}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Trạng thái</p>
            <div className="mt-2">
              <StatusPill status={latest.isIncomplete ? 'INCOMPLETE' : latest.status} />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Check-in</p>
            <p className="mt-1 text-base font-medium text-[var(--hr-ink)]">{latest.checkInTime || 'Chưa có'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Check-out</p>
            <p className="mt-1 text-base font-medium text-[var(--hr-ink)]">{latest.checkOutTime || 'Chưa có'}</p>
          </div>
        </div>
      )}
    </Panel>
  );
}
