import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_LABEL } from '../constants/attendanceConstants';

function isFullDayStatus(status) {
  return status === ATTENDANCE_STATUS.FULL_DAY || status === 'Du gio';
}

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
    isFullDayStatus(status)
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
  if (isFullDayStatus(record.status)) return 'Du gio';
  if (record.status === ATTENDANCE_STATUS.CHECKED_OUT) return ATTENDANCE_STATUS.CHECKED_OUT;
  if (record.status === ATTENDANCE_STATUS.ON_TIME) return ATTENDANCE_STATUS.ON_TIME;
  return ATTENDANCE_STATUS.UNKNOWN;
}
