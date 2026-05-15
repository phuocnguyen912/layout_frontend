import { useMemo } from 'react';
import { mapApprovedLeaveDates } from '../utils/attendanceMappers';

export default function useAttendanceSummary({ rows, leaves, range, employeeId }) {
  const leaveDates = useMemo(() => {
    const filteredLeaves = (leaves || []).filter((leave) => leave.MaNhanVien === employeeId);
    return mapApprovedLeaveDates(filteredLeaves, range);
  }, [leaves, range, employeeId]);

  const summary = useMemo(() => {
    const latest = rows[0] || null;
    const late = rows.filter((row) => row.status === 'LATE').length;
    const present = rows.length;
    const leave = leaveDates.size;

    return {
      present,
      late,
      leave,
      latest,
      leaveDates,
    };
  }, [rows, leaveDates]);

  return summary;
}
