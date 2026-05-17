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
  if (!status) return 'Không có dữ liệu';
  if (status === 'LEAVE') return 'Nghỉ phép';
  if (status === 'LATE') return 'Đi trễ';
  if (status === 'INCOMPLETE') return 'Chưa chấm ra';
  if (status === 'Du gio') return 'Đủ giờ';
  if (status === 'ON_TIME') return 'Đúng giờ';
  if (status === 'CHECKED_OUT') return 'Đã chấm ra';
  return status;
}

export default function AttendanceCalendar({ cells }) {
  return (
    <Panel title="Lịch chấm công" subtitle="Tô màu theo dữ liệu chấm công và nghỉ phép đã duyệt trong bộ lọc hiện tại.">
      <div className="mb-4 flex flex-wrap gap-2 text-xs text-[var(--hr-muted)]">
        <span className="rounded-full bg-[#eef4e6] px-3 py-1 text-[#4f5a3d]">Có mặt</span>
        <span className="rounded-full bg-[#fbf2e2] px-3 py-1 text-[#94652b]">Đi trễ</span>
        <span className="rounded-full bg-[#fbefec] px-3 py-1 text-[#964637]">Nghỉ phép</span>
        <span className="rounded-full bg-[#fffaf5] px-3 py-1 text-[#6d6258]">Khác</span>
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
              {cell.isSelected ? <span className="rounded-full bg-[#b55233] px-2 py-0.5 text-[10px] text-white">Lọc</span> : null}
            </div>
            <p className="mt-3 text-xs">{labelForCell(cell.status)}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
