function normalizeDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function employeeNameMap(employees) {
  return new Map((employees || []).map((employee) => [employee.MaNhanVien, employee.HoTen || employee.MaNhanVien]));
}

export function formatAttendanceStatus(status) {
  const statusMap = {
    ON_TIME: 'Đúng giờ',
    LATE: 'Đi trễ',
    EARLY_LEAVE: 'Đi sớm',
    INCOMPLETE: 'Chưa chấm ra',
    'Du gio': 'Đủ giờ',
    'Đủ giờ': 'Đủ giờ',
    PRESENT: 'Có mặt',
    LEAVE: 'Nghỉ phép',
  };

  return statusMap[status] || status || 'Không rõ';
}

export function buildAttendanceRows({ employees = [], attendance = [], leaves = [], latestEvents = [], filters = {} }) {
  const names = employeeNameMap(employees);
  const leaveByEmployee = new Map();

  for (const leave of leaves || []) {
    const key = leave.MaNhanVien;
    if (!leaveByEmployee.has(key)) {
      leaveByEmployee.set(key, []);
    }
    leaveByEmployee.get(key).push(leave);
  }

  const monthlyRows = (attendance || []).map((item) => {
    const employeeLeaves = leaveByEmployee.get(item.MaNhanVien) || [];
    const approvedLeaveCount = employeeLeaves.filter((leave) => leave.TrangThai === 'DA_DUYET').length;
    const latestEvent = [...latestEvents].reverse().find((event) => event.maNhanVien === item.MaNhanVien);
    const latestStatus = latestEvent?.trangThai || (approvedLeaveCount > 0 ? 'LEAVE' : 'PRESENT');
    return {
      id: `${item.MaNhanVien}-${filters.nam || 'all'}-${filters.thang || 'all'}`,
      MaNhanVien: item.MaNhanVien,
      HoTen: names.get(item.MaNhanVien) || item.MaNhanVien,
      SoNgayChamCong: Number(item.SoNgayChamCong || 0),
      SoDonNghi: approvedLeaveCount,
      TrangThaiGanNhat: latestStatus,
      TrangThaiLabel: formatAttendanceStatus(latestStatus),
      Ky: `${filters.thang || ''}/${filters.nam || ''}`.replace(/^\/|\/$/g, ''),
    };
  });

  const employeeFilter = filters.employeeId ? String(filters.employeeId).trim().toUpperCase() : '';
  const keywordFilter = filters.keyword ? String(filters.keyword).trim().toLowerCase() : '';

  return monthlyRows
    .filter((row) => {
      if (employeeFilter && String(row.MaNhanVien).toUpperCase() !== employeeFilter) return false;
      if (keywordFilter) {
        const haystack = JSON.stringify(row).toLowerCase();
        if (!haystack.includes(keywordFilter)) return false;
      }
      return true;
    })
    .sort((a, b) => a.MaNhanVien.localeCompare(b.MaNhanVien));
}

export function filterAttendanceRows(rows, filters = {}) {
  const normalizedDate = normalizeDateInput(filters.date);
  if (!normalizedDate) return rows;

  return rows.filter((row) => row.Ngay === normalizedDate || row.NgayCheckIn === normalizedDate || row.NgayCheckOut === normalizedDate);
}

export function deriveAttendanceStats({ rows = [], leaves = [], latestEvents = [] }) {
  const present = rows.reduce((sum, row) => sum + Number(row.SoNgayChamCong || 0), 0);
  const leave = (leaves || []).filter((item) => item.TrangThai === 'DA_DUYET').length;
  const late = (latestEvents || []).filter((item) => item.trangThai === 'LATE').length;

  return {
    present,
    leave,
    late,
  };
}

export function buildAttendanceCalendar({ rows = [], leaves = [], latestEvents = [], filters = {} }) {
  const month = Number(filters.thang || new Date().getMonth() + 1);
  const year = Number(filters.nam || new Date().getFullYear());
  const calendarMap = {};

  rows.forEach((row, index) => {
    const day = String((index % 28) + 1).padStart(2, '0');
    const key = `${year}-${String(month).padStart(2, '0')}-${day}`;
    calendarMap[key] = row.TrangThaiGanNhat || 'PRESENT';
  });

  (leaves || []).forEach((leave) => {
    if (leave.TrangThai !== 'DA_DUYET') return;
    const key = normalizeDateInput(leave.TuNgay);
    if (key) {
      calendarMap[key] = 'LEAVE';
    }
  });

  (latestEvents || []).forEach((event) => {
    const key = normalizeDateInput(event.ngay);
    if (key) {
      calendarMap[key] = event.trangThai || calendarMap[key] || 'PRESENT';
    }
  });

  return calendarMap;
}

export function createAttendanceEvent(type, payload) {
  return {
    type,
    maNhanVien: payload?.maNhanVien || '',
    ngay: payload?.ngay || '',
    gio: payload?.gioVao || payload?.gioRa || '',
    trangThai: payload?.trangThai || (type === 'checkout' ? 'CHECKED_OUT' : 'ON_TIME'),
    timestamp: Date.now(),
  };
}

export function getRetryableMessage(message) {
  const lowered = String(message || '').toLowerCase();
  return lowered.includes('timeout') || lowered.includes('network') || lowered.includes('failed');
}
