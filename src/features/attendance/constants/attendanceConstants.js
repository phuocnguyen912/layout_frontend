export const ATTENDANCE_FILTER_MODE = {
  DAY: 'day',
  MONTH: 'month',
};

export const ATTENDANCE_STATUS = {
  ON_TIME: 'ON_TIME',
  LATE: 'LATE',
  CHECKED_OUT: 'CHECKED_OUT',
  FULL_DAY: 'Du gio',
  LEAVE: 'LEAVE',
  INCOMPLETE: 'INCOMPLETE',
  UNKNOWN: 'UNKNOWN',
};

export const ATTENDANCE_STATUS_LABEL = {
  ON_TIME: 'Dung gio',
  LATE: 'Di tre',
  CHECKED_OUT: 'Da check-out',
  'Du gio': 'Du gio',
  LEAVE: 'Nghi phep',
  INCOMPLETE: 'Chua check-out',
  UNKNOWN: 'Khong ro',
};

export const ATTENDANCE_RETRY_LIMIT = 2;
export const ATTENDANCE_REQUEST_TIMEOUT_MS = 12000;
