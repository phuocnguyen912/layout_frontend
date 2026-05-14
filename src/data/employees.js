/**
 * A12 — Demo seed data
 * Sync with backend database in QuanLyNhanSu.sql and seed-master.sql
 */

export const SEED_POSITIONS = [
  { MaChucVu: 'CV01', TenChucVu: 'Nhân viên' },
  { MaChucVu: 'CV02', TenChucVu: 'Trưởng nhóm' },
  { MaChucVu: 'CV03', TenChucVu: 'Trưởng phòng' },
];

export const SEED_DEPARTMENTS = [
  { MaPhongBan: 'PBHCM01', TenPhongBan: 'Hành chính', MaChiNhanh: 'CNHCM' },
  { MaPhongBan: 'PBHCM02', TenPhongBan: 'Kế toán', MaChiNhanh: 'CNHCM' },
  { MaPhongBan: 'PBHN01', TenPhongBan: 'Hành chính', MaChiNhanh: 'CNHN' },
  { MaPhongBan: 'PBHN02', TenPhongBan: 'Kế toán', MaChiNhanh: 'CNHN' },
];

export const SEED_EMPLOYEES = [
  {
    MaNhanVien: 'NV001',
    HoTen: 'Nguyễn Văn An',
    Email: 'an.nguyen@company.vn',
    SDT: '0901234567',
    NgaySinh: '1990-05-15',
    NgayVaoLam: '2020-03-01',
    MaPhongBan: 'PBHCM01',
    TenPhongBan: 'Hành chính',
    MaChucVu: 'CV03',
    TenChucVu: 'Trưởng phòng',
    MaChiNhanh: 'CNHCM',
    TenChiNhanh: 'Chi nhánh HCM',
    TrangThai: 'Hoat dong',
    avatarMock: '',
  },
  {
    MaNhanVien: 'NV002',
    HoTen: 'Trần Thị Bích',
    Email: 'bich.tran@company.vn',
    SDT: '0912345678',
    NgaySinh: '1992-08-22',
    NgayVaoLam: '2021-06-15',
    MaPhongBan: 'PBHCM02',
    TenPhongBan: 'Kế toán',
    MaChucVu: 'CV01',
    TenChucVu: 'Nhân viên',
    MaChiNhanh: 'CNHCM',
    TenChiNhanh: 'Chi nhánh HCM',
    TrangThai: 'Hoat dong',
    avatarMock: '',
  },
];
