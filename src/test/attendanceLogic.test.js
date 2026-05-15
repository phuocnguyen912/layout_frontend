import { describe, expect, it } from 'vitest';
import {
  buildAttendanceRows,
  buildAttendanceCalendar,
  deriveAttendanceStats,
  filterAttendanceRows,
  formatAttendanceStatus,
} from '../utils/attendanceLogic';

describe('attendanceLogic', () => {
  const employees = [
    { MaNhanVien: 'NV01', HoTen: 'Nguyen Van A' },
    { MaNhanVien: 'NV02', HoTen: 'Tran Thi B' },
  ];

  const attendance = [
    { MaNhanVien: 'NV01', SoNgayChamCong: 20 },
    { MaNhanVien: 'NV02', SoNgayChamCong: 18 },
  ];

  const leaves = [
    { MaNghiPhep: 1, MaNhanVien: 'NV02', TuNgay: '2026-05-03', TrangThai: 'DA_DUYET' },
  ];

  const latestEvents = [
    { maNhanVien: 'NV01', ngay: '2026-05-06', trangThai: 'LATE' },
  ];

  it('formats backend attendance statuses', () => {
    expect(formatAttendanceStatus('ON_TIME')).toBe('Dung gio');
    expect(formatAttendanceStatus('LATE')).toBe('Di tre');
  });

  it('builds monthly attendance rows from aggregate report', () => {
    const rows = buildAttendanceRows({
      employees,
      attendance,
      leaves,
      latestEvents,
      filters: { thang: 5, nam: 2026 },
    });

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ MaNhanVien: 'NV01', HoTen: 'Nguyen Van A' });
    expect(rows[1].SoDonNghi).toBe(1);
  });

  it('filters attendance rows by date only when daily keys exist', () => {
    const rows = [
      { id: '1', Ngay: '2026-05-10', MaNhanVien: 'NV01' },
      { id: '2', Ngay: '2026-05-12', MaNhanVien: 'NV02' },
    ];

    expect(filterAttendanceRows(rows, { date: '2026-05-10' })).toHaveLength(1);
  });

  it('derives attendance statistics from rows, leaves and latest events', () => {
    const stats = deriveAttendanceStats({
      rows: buildAttendanceRows({ employees, attendance, leaves, latestEvents, filters: {} }),
      leaves,
      latestEvents,
    });

    expect(stats.present).toBe(38);
    expect(stats.leave).toBe(1);
    expect(stats.late).toBe(1);
  });

  it('builds calendar map for latest status and approved leaves', () => {
    const rows = buildAttendanceRows({ employees, attendance, leaves, latestEvents, filters: { thang: 5, nam: 2026 } });
    const calendar = buildAttendanceCalendar({
      rows,
      leaves,
      latestEvents,
      filters: { thang: 5, nam: 2026 },
    });

    expect(calendar['2026-05-03']).toBe('LEAVE');
    expect(calendar['2026-05-06']).toBe('LATE');
  });
});
