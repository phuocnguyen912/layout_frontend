import { useMemo } from 'react';
import { buildAttendanceCalendarCells } from '../utils/attendanceCalendar';

export default function useAttendanceCalendar({ filters, rows, leaveDates }) {
  return useMemo(
    () => buildAttendanceCalendarCells({ filters, rows, leaveDates }),
    [filters, rows, leaveDates],
  );
}
