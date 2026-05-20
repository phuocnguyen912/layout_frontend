import { ATTENDANCE_STATUS } from '../constants/attendanceConstants';
import { formatAttendanceStatus } from './attendanceStatus';

function formatLocalDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function normalizeDate(value) {
  if (!value) return '';
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);
  return formatLocalDate(date);
}

function normalizeTime(value) {
  if (!value) return '';
  const raw = String(value).trim();
  const hhmmss = raw.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (hhmmss) return `${hhmmss[1]}:${hhmmss[2]}:${hhmmss[3]}`;

  const hhmm = raw.match(/(\d{2}):(\d{2})/);
  if (hhmm) return `${hhmm[1]}:${hhmm[2]}`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function mapAttendanceRecord(item, index) {
  const date = normalizeDate(item.Ngay);
  const checkInTime = normalizeTime(item.GioVao);
  const checkOutTime = normalizeTime(item.GioRa);
  const status = item.TrangThai || ATTENDANCE_STATUS.UNKNOWN;
  const isIncomplete = Boolean(checkInTime) && !checkOutTime;

  return {
    id: `${item.MaNhanVien || 'NV'}-${date || index}-${index}`,
    employeeId: item.MaNhanVien || '',
    date,
    checkInTime,
    checkOutTime,
    status,
    statusLabel: formatAttendanceStatus(isIncomplete ? ATTENDANCE_STATUS.INCOMPLETE : status),
    isIncomplete,
  };
}

export function mapAttendanceRows(items = []) {
  return items
    .map(mapAttendanceRecord)
    .sort((left, right) => right.date.localeCompare(left.date) || right.checkInTime.localeCompare(left.checkInTime));
}

export function mapApprovedLeaveDates(leaves = [], range) {
  const dates = new Set();

  (leaves || []).forEach((leave) => {
    if (leave.TrangThai !== 'DA_DUYET') return;

    const start = normalizeDate(leave.TuNgay);
    const end = normalizeDate(leave.DenNgay);
    if (!start || !end) return;

    let cursor = new Date(`${start}T00:00:00`);
    const limit = new Date(`${end}T00:00:00`);

    while (cursor <= limit) {
      const current = formatLocalDate(cursor);
      if (!range || (current >= range.tuNgay && current <= range.denNgay)) {
        dates.add(current);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return dates;
}
