import { ATTENDANCE_FILTER_MODE, ATTENDANCE_STATUS } from '../constants/attendanceConstants';
import { getMonthRange } from './attendanceFilters';
import { resolveCalendarStatus } from './attendanceStatus';

function createCalendarCell(date, isCurrentMonth) {
  return {
    key: date.toISOString().slice(0, 10),
    date: date.toISOString().slice(0, 10),
    day: date.getDate(),
    weekday: date.getDay(),
    isCurrentMonth,
    status: null,
    isSelected: false,
  };
}

export function buildAttendanceCalendarCells({ filters, rows, leaveDates }) {
  const monthRef =
    filters.filterMode === ATTENDANCE_FILTER_MODE.DAY
      ? String(filters.selectedDate || '').slice(0, 7)
      : filters.selectedMonth;

  const range = getMonthRange(monthRef);
  if (!range) return [];

  const firstOfMonth = new Date(`${range.tuNgay}T00:00:00`);
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  const lastOfMonth = new Date(`${range.denNgay}T00:00:00`);
  const end = new Date(lastOfMonth);
  end.setDate(lastOfMonth.getDate() + (6 - lastOfMonth.getDay()));

  const rowMap = new Map(rows.map((row) => [row.date, row]));
  const cells = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const dateKey = cursor.toISOString().slice(0, 10);
    const isCurrentMonth = dateKey.slice(0, 7) === monthRef;
    const record = rowMap.get(dateKey);
    const cell = createCalendarCell(cursor, isCurrentMonth);

    if (leaveDates?.has(dateKey)) {
      cell.status = ATTENDANCE_STATUS.LEAVE;
    } else if (record) {
      cell.status = resolveCalendarStatus(record);
    }

    if (filters.filterMode === ATTENDANCE_FILTER_MODE.DAY && filters.selectedDate === dateKey) {
      cell.isSelected = true;
    }

    cells.push(cell);
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}
