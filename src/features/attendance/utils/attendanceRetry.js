export function isRetryableAttendanceError(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('timeout') || message.includes('network') || message.includes('failed');
}

export function toAttendanceError(error, fallback = 'Khong the xu ly yeu cau cham cong.') {
  if (!error) return new Error(fallback);
  if (error instanceof Error) return error;
  return new Error(String(error) || fallback);
}
