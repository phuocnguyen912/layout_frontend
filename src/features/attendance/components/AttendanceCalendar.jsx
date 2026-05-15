import Panel from '../../../components/ui/Panel';
import { getAttendanceTone } from '../utils/attendanceStatus';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function cellClass(cell) {
  const tone = getAttendanceTone(cell.status);
  const base = 'min-h-[88px] rounded-2xl border p-3 transition';
  const muted = cell.isCurrentMonth ? '' : ' opacity-45';
  const selected = cell.isSelected ? ' ring-2 ring-[#b55233]' : '';

  if (tone === 'success') return `${base} border-[#d7d8c7] bg-[#eef4e6] text-[#4f5a3d]${muted}${selected}`;
  if (tone === 'warning') return `${base} border-[#edd7b8] bg-[#fbf2e2] text-[#94652b]${muted}${selected}`;
  if (tone === 'danger') return `${base} border-[#e8cbc4] bg-[#fbefec] text-[#964637]${muted}${selected}`;
  return `${base} border-[#e6d9cb] bg-[#fffaf5] text-[#6d6258]${muted}${selected}`;
}

function labelForCell(status) {
  if (!status) return 'Khong co du lieu';
  if (status === 'LEAVE') return 'Nghi phep';
  if (status === 'LATE') return 'Di tre';
  if (status === 'INCOMPLETE') return 'Chua check-out';
  if (status === 'Du gio') return 'Du gio';
  if (status === 'ON_TIME') return 'Dung gio';
  if (status === 'CHECKED_OUT') return 'Da check-out';
  return status;
}

export default function AttendanceCalendar({ cells }) {
  return (
    <Panel title="Calendar cham cong" subtitle="Highlight theo du lieu attendance va leave da duyet trong bo loc hien tai.">
      <div className="mb-4 flex flex-wrap gap-2 text-xs text-[var(--hr-muted)]">
        <span className="rounded-full bg-[#eef4e6] px-3 py-1 text-[#4f5a3d]">Co mat</span>
        <span className="rounded-full bg-[#fbf2e2] px-3 py-1 text-[#94652b]">Di tre</span>
        <span className="rounded-full bg-[#fbefec] px-3 py-1 text-[#964637]">Nghi phep</span>
        <span className="rounded-full bg-[#fffaf5] px-3 py-1 text-[#6d6258]">Khac</span>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {WEEKDAYS.map((label) => (
          <div key={label} className="px-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7768]">
            {label}
          </div>
        ))}
        {cells.map((cell) => (
          <div key={cell.key} className={cellClass(cell)}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold">{cell.day}</span>
              {cell.isSelected ? <span className="rounded-full bg-[#b55233] px-2 py-0.5 text-[10px] text-white">Loc</span> : null}
            </div>
            <p className="mt-3 text-xs">{labelForCell(cell.status)}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
