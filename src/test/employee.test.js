/**
 * A11 — CRUD test flow cho employee
 * Test các function tiện ích và logic CRUD cơ bản.
 */
import { describe, expect, it } from 'vitest';
import { buildEditForm, resolveEmployeeKey, resolveEmployeeStatus } from '../pages/employees/employeeUtils';
import { SEED_EMPLOYEES, SEED_POSITIONS, SEED_DEPARTMENTS } from '../data/employees';

describe('Employee Utils', () => {
  describe('resolveEmployeeStatus', () => {
    it('should return TrangThai when present', () => {
      expect(resolveEmployeeStatus({ TrangThai: 'Hoat dong' })).toBe('Hoat dong');
    });

    it('should fallback to TinhTrang', () => {
      expect(resolveEmployeeStatus({ TinhTrang: 'Nghi viec' })).toBe('Nghi viec');
    });

    it('should fallback to Status', () => {
      expect(resolveEmployeeStatus({ Status: 'Active' })).toBe('Active');
    });

    it('should return "Chưa rõ" when nothing found', () => {
      expect(resolveEmployeeStatus({})).toBe('Chưa rõ');
    });
  });

  describe('resolveEmployeeKey', () => {
    it('should return MaNhanVien when present', () => {
      expect(resolveEmployeeKey({ MaNhanVien: 'NV001' })).toBe('NV001');
    });

    it('should fallback to id', () => {
      expect(resolveEmployeeKey({ id: 42 })).toBe(42);
    });

    it('should fallback to index-based key', () => {
      expect(resolveEmployeeKey({}, 5)).toBe('employee-5');
    });
  });

  describe('buildEditForm', () => {
    it('should return empty form when no employee given', () => {
      const form = buildEditForm();
      expect(form.MaNhanVien).toBe('');
      expect(form.HoTen).toBe('');
      expect(form.Email).toBe('');
      expect(form.SDT).toBe('');
      expect(form.NgaySinh).toBe('');
      expect(form.NgayVaoLam).toBe('');
      expect(form.MaPhongBan).toBe('');
      expect(form.MaChucVu).toBe('');
      expect(form.avatarMock).toBe('');
    });

    it('should populate form from employee data', () => {
      const emp = SEED_EMPLOYEES[0];
      const form = buildEditForm(emp);
      expect(form.MaNhanVien).toBe('NV001');
      expect(form.HoTen).toBe('Nguyễn Văn An');
      expect(form.Email).toBe('an.nguyen@company.vn');
      expect(form.SDT).toBe('0901234567');
      expect(form.NgaySinh).toBe('1990-05-15');
      expect(form.NgayVaoLam).toBe('2020-03-01');
      expect(form.MaPhongBan).toBe('PB002');
      expect(form.MaChucVu).toBe('CV003');
    });
  });
});

describe('Seed Data Integrity', () => {
  it('should have at least 10 employees', () => {
    expect(SEED_EMPLOYEES.length).toBeGreaterThanOrEqual(10);
  });

  it('every employee should have required fields', () => {
    for (const emp of SEED_EMPLOYEES) {
      expect(emp.MaNhanVien).toBeTruthy();
      expect(emp.HoTen).toBeTruthy();
      expect(emp.Email).toBeTruthy();
      expect(emp.SDT).toBeTruthy();
      expect(emp.MaPhongBan).toBeTruthy();
      expect(emp.MaChucVu).toBeTruthy();
      expect(emp.TrangThai).toBeTruthy();
    }
  });

  it('employee MaNhanVien should be unique', () => {
    const ids = SEED_EMPLOYEES.map((e) => e.MaNhanVien);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have positions data', () => {
    expect(SEED_POSITIONS.length).toBeGreaterThan(0);
    for (const pos of SEED_POSITIONS) {
      expect(pos.MaChucVu).toBeTruthy();
      expect(pos.TenChucVu).toBeTruthy();
    }
  });

  it('should have departments data', () => {
    expect(SEED_DEPARTMENTS.length).toBeGreaterThan(0);
    for (const dept of SEED_DEPARTMENTS) {
      expect(dept.MaPhongBan).toBeTruthy();
      expect(dept.TenPhongBan).toBeTruthy();
    }
  });
});

describe('CRUD Flow Simulation', () => {
  let employees = [...SEED_EMPLOYEES];

  it('CREATE — should add a new employee', () => {
    const newEmp = {
      MaNhanVien: 'NV_NEW',
      HoTen: 'Test User',
      Email: 'test@company.vn',
      SDT: '0999999999',
      NgaySinh: '2000-01-01',
      NgayVaoLam: '2025-01-01',
      MaPhongBan: 'PB001',
      MaChucVu: 'CV005',
      TrangThai: 'Hoat dong',
      avatarMock: '',
    };
    employees = [...employees, newEmp];
    expect(employees.find((e) => e.MaNhanVien === 'NV_NEW')).toBeTruthy();
    expect(employees.length).toBe(SEED_EMPLOYEES.length + 1);
  });

  it('READ — should find employee by MaNhanVien', () => {
    const found = employees.find((e) => e.MaNhanVien === 'NV001');
    expect(found).toBeTruthy();
    expect(found.HoTen).toBe('Nguyễn Văn An');
  });

  it('UPDATE — should update employee name', () => {
    employees = employees.map((e) =>
      e.MaNhanVien === 'NV_NEW' ? { ...e, HoTen: 'Updated Name' } : e,
    );
    const updated = employees.find((e) => e.MaNhanVien === 'NV_NEW');
    expect(updated.HoTen).toBe('Updated Name');
  });

  it('DELETE (soft) — should change status to Mat viec', () => {
    employees = employees.map((e) =>
      e.MaNhanVien === 'NV_NEW' ? { ...e, TrangThai: 'Mat viec' } : e,
    );
    const deleted = employees.find((e) => e.MaNhanVien === 'NV_NEW');
    expect(deleted.TrangThai).toBe('Mat viec');
  });

  it('FILTER — should filter by status', () => {
    const active = employees.filter((e) => resolveEmployeeStatus(e) === 'Hoat dong');
    const inactive = employees.filter((e) => resolveEmployeeStatus(e) === 'Mat viec');
    expect(active.length).toBeGreaterThan(0);
    expect(inactive.length).toBeGreaterThan(0);
    expect(active.length + inactive.length).toBeLessThanOrEqual(employees.length);
  });

  it('SEARCH — should search by keyword', () => {
    const keyword = 'nguyễn';
    const results = employees.filter((e) =>
      JSON.stringify(e).toLowerCase().includes(keyword.toLowerCase()),
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].HoTen).toContain('Nguyễn');
  });

  it('PAGINATION — should paginate correctly', () => {
    const pageSize = 5;
    const totalPages = Math.ceil(employees.length / pageSize);
    expect(totalPages).toBeGreaterThan(1);

    const page1 = employees.slice(0, pageSize);
    const page2 = employees.slice(pageSize, pageSize * 2);
    expect(page1.length).toBe(pageSize);
    expect(page2.length).toBeGreaterThan(0);
    expect(page1[0].MaNhanVien).not.toBe(page2[0].MaNhanVien);
  });
});
