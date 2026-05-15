export function resolveEmployeeStatus(employee) {
  const status = employee.TrangThai || employee.TinhTrang || employee.Status || 'Chưa rõ';
  const normalizedStatus = String(status).toLowerCase().trim();

  // Chuẩn hóa trạng thái nghỉ việc
  if (normalizedStatus === 'da_nghi_viec' || normalizedStatus.includes('nghi viec') || normalizedStatus.includes('nghỉ việc')) {
    return 'Nghỉ việc';
  }

  // Chuẩn hóa trạng thái đang làm (ghép "dang lam" và "đang làm")
  if (normalizedStatus === 'hoat dong' || normalizedStatus === 'dang lam' || normalizedStatus === 'đang làm' || normalizedStatus.includes('dang lam') || normalizedStatus.includes('đang làm')) {
    return 'Đang làm việc';
  }

  // Các trạng thái khác giữ nguyên format gốc
  return status;
}

export function resolveEmployeeKey(employee, index = 0) {
  return employee.MaNhanVien || employee.id || `employee-${index}`;
}

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export function buildEditForm(employee = {}) {
  return {
    MaNhanVien: employee.MaNhanVien || '',
    HoTen: employee.HoTen || '',
    Email: employee.Email || '',
    SDT: employee.SDT || '',
    NgaySinh: formatDateForInput(employee.NgaySinh),
    NgayVaoLam: formatDateForInput(employee.NgayVaoLam),
    MaPhongBan: employee.MaPhongBan || '',
    MaChucVu: employee.MaChucVu || '',
    GioiTinh: employee.GioiTinh || 'Nam',
    MaChiNhanh: employee.MaChiNhanh || '',
    TrangThai: employee.TrangThai || 'Đang làm việc',
    avatarMock: employee.avatarMock || '',
  };
}
