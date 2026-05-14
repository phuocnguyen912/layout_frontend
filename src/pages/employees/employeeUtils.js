export function resolveEmployeeStatus(employee) {
  return employee.TrangThai || employee.TinhTrang || employee.Status || 'Chưa rõ';
}

export function resolveEmployeeKey(employee, index = 0) {
  return employee.MaNhanVien || employee.id || `employee-${index}`;
}

export function buildEditForm(employee = {}) {
  return {
    MaNhanVien: employee.MaNhanVien || '',
    HoTen: employee.HoTen || '',
    Email: employee.Email || '',
    SDT: employee.SDT || '',
    NgaySinh: employee.NgaySinh || '',
    NgayVaoLam: employee.NgayVaoLam || '',
    MaPhongBan: employee.MaPhongBan || '',
    MaChucVu: employee.MaChucVu || '',
    avatarMock: employee.avatarMock || '',
  };
}
