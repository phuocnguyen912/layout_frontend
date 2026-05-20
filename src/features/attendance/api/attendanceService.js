import { ATTENDANCE_REQUEST_TIMEOUT_MS } from '../constants/attendanceConstants';
import { buildAttendanceRange } from '../utils/attendanceFilters';
import { mapAttendanceRows } from '../utils/attendanceMappers';
import { toAttendanceError } from '../utils/attendanceRetry';

function ensureSeconds(timeValue) {
  return timeValue && String(timeValue).split(':').length === 2 ? `${timeValue}:00` : timeValue;
}

function toSqlTimePayload(timeValue) {
  const normalized = ensureSeconds(timeValue);
  return normalized ? `1970-01-01T${normalized}Z` : normalized;
}

async function withTimeout(factory, timeoutMs = ATTENDANCE_REQUEST_TIMEOUT_MS) {
  let timeoutId;

  try {
    return await Promise.race([
      factory(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout khi ket noi attendance API.')), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchAttendanceHistory(nodeApi, filters) {
  try {
    const range = buildAttendanceRange(filters);
    if (!range) return { rows: [], range: null };

    const result = await withTimeout(() =>
      nodeApi.getAttendance(range.maNhanVien, { tuNgay: range.tuNgay, denNgay: range.denNgay }),
    );

    return {
      rows: mapAttendanceRows(result || []),
      range,
    };
  } catch (error) {
    throw toAttendanceError(error, 'Khong tai duoc lich su cham cong.');
  }
}

export async function submitCheckIn(nodeApi, payload) {
  try {
    return await withTimeout(() =>
      nodeApi.checkIn({
        maNhanVien: payload.maNhanVien.trim(),
        ngay: payload.ngay,
        gioVao: toSqlTimePayload(payload.gioVao),
      }),
    );
  } catch (error) {
    throw toAttendanceError(error, 'Check-in that bai.');
  }
}

export async function submitCheckOut(nodeApi, payload) {
  try {
    return await withTimeout(() =>
      nodeApi.checkOut({
        maNhanVien: payload.maNhanVien.trim(),
        ngay: payload.ngay,
        gioRa: toSqlTimePayload(payload.gioRa),
      }),
    );
  } catch (error) {
    throw toAttendanceError(error, 'Check-out that bai.');
  }
}
