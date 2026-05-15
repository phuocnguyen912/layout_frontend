import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_LABEL } from '../constants/attendanceConstants';

export function formatAttendanceStatus(status) {
  if (!status) return ATTENDANCE_STATUS_LABEL.UNKNOWN;
  return ATTENDANCE_STATUS_LABEL[status] || status;
}

export function getAttendanceTone(status) {
  if (status === ATTENDANCE_STATUS.LATE) return 'warning';
  if (status === ATTENDANCE_STATUS.LEAVE) return 'danger';
  if (
    status === ATTENDANCE_STATUS.ON_TIME ||
    status === ATTENDANCE_STATUS.CHECKED_OUT ||
    status === ATTENDANCE_STATUS.FULL_DAY
  ) {
    return 'success';
  }
  return 'neutral';
}

export function resolveCalendarStatus(record) {
  if (!record) return ATTENDANCE_STATUS.UNKNOWN;
  if (record.isLeave) return ATTENDANCE_STATUS.LEAVE;
  if (record.status === ATTENDANCE_STATUS.LATE) return ATTENDANCE_STATUS.LATE;
  if (record.isIncomplete) return ATTENDANCE_STATUS.INCOMPLETE;
  if (record.status === ATTENDANCE_STATUS.FULL_DAY) return ATTENDANCE_STATUS.FULL_DAY;
  if (record.status === ATTENDANCE_STATUS.CHECKED_OUT) return ATTENDANCE_STATUS.CHECKED_OUT;
  if (record.status === ATTENDANCE_STATUS.ON_TIME) return ATTENDANCE_STATUS.ON_TIME;
  return ATTENDANCE_STATUS.UNKNOWN;
}
