import Panel from '../../../components/ui/Panel';
import StatusPill from '../../../components/ui/StatusPill';

export default function AttendanceStatusSummary({ latest }) {
  return (
    <Panel title="Trang thai gan nhat" subtitle="Tom tat ban ghi attendance moi nhat trong bo loc dang chon.">
      {!latest ? (
        <p className="text-sm text-[var(--hr-muted)]">Chua co du lieu de hien thi check-in/check-out gan nhat.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Ngay</p>
            <p className="mt-1 text-lg font-semibold text-[var(--hr-ink)]">{latest.date}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Trang thai</p>
            <div className="mt-2">
              <StatusPill status={latest.isIncomplete ? 'INCOMPLETE' : latest.status} />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Check-in</p>
            <p className="mt-1 text-base font-medium text-[var(--hr-ink)]">{latest.checkInTime || 'Chua co'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a7768]">Check-out</p>
            <p className="mt-1 text-base font-medium text-[var(--hr-ink)]">{latest.checkOutTime || 'Chua co'}</p>
          </div>
        </div>
      )}
    </Panel>
  );
}
