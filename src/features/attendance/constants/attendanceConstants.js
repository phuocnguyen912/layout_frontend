export const ATTENDANCE_FILTER_MODE = {
  DAY: 'day',
  MONTH: 'month',
};

export const ATTENDANCE_STATUS = {
  ON_TIME: 'ON_TIME',
  LATE: 'LATE',
  CHECKED_OUT: 'CHECKED_OUT',
  FULL_DAY: 'Đủ giờ',
  LEAVE: 'LEAVE',
  INCOMPLETE: 'INCOMPLETE',
  UNKNOWN: 'UNKNOWN',
};

export const ATTENDANCE_STATUS_LABEL = {
  ON_TIME: 'Đúng giờ',
  LATE: 'Đi trễ',
  CHECKED_OUT: 'Đã chấm ra',
  'Du gio': 'Đủ giờ',
  'Đủ giờ': 'Đủ giờ',
  LEAVE: 'Nghỉ phép',
  INCOMPLETE: 'Chưa chấm ra',
  UNKNOWN: 'Không rõ',
};

export const ATTENDANCE_RETRY_LIMIT = 2;
export const ATTENDANCE_REQUEST_TIMEOUT_MS = 12000;
