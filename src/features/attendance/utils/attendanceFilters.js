import { ATTENDANCE_FILTER_MODE } from '../constants/attendanceConstants';

function pad(value) {
  return String(value).padStart(2, '0');
}

export function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function monthValueFromDate(dateValue = todayValue()) {
  return String(dateValue).slice(0, 7);
}

export function getMonthRange(monthValue) {
  const [yearText, monthText] = String(monthValue || '').split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  if (!year || !month) return null;

  const first = `${year}-${pad(month)}-01`;
  const lastDate = new Date(year, month, 0).getDate();
  const last = `${year}-${pad(month)}-${pad(lastDate)}`;

  return { tuNgay: first, denNgay: last, month: pad(month), year };
}

export function buildAttendanceRange(filters) {
  if (!filters?.employeeId?.trim()) return null;

  if (filters.filterMode === ATTENDANCE_FILTER_MODE.DAY) {
    if (!filters.selectedDate) return null;
    return {
      maNhanVien: filters.employeeId.trim(),
      tuNgay: filters.selectedDate,
      denNgay: filters.selectedDate,
    };
  }

  const range = getMonthRange(filters.selectedMonth);
  if (!range) return null;

  return {
    maNhanVien: filters.employeeId.trim(),
    tuNgay: range.tuNgay,
    denNgay: range.denNgay,
  };
}

export function isDateInRange(dateValue, range) {
  if (!dateValue || !range?.tuNgay || !range?.denNgay) return false;
  return dateValue >= range.tuNgay && dateValue <= range.denNgay;
}
