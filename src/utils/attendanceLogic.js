/**
 * Utility functions cho chấm công, nghỉ phép, tính lương
 */

// ============= CHẤM CÔNG (ATTENDANCE) =============

/**
 * Format trạng thái chấm công
 */
export function formatAttendanceStatus(status) {
  const statusMap = {
    'ON_TIME': 'Đúng giờ',
    'LATE': 'Đi muộn',
    'EARLY_LEAVE': 'Đi sớm',
    'INCOMPLETE': 'Chưa chấm công ra',
    'Du gio': 'Đủ giờ',
  };
  return statusMap[status] || status;
}

/**
 * Tính số giờ làm việc
 */
export function calculateWorkingHours(gioVao, gioRa) {
  if (!gioVao || !gioRa) return 0;
  
  const [hoVao, phutVao] = gioVao.split(':').map(Number);
  const [hoRa, phutRa] = gioRa.split(':').map(Number);
  
  const thoiGianVao = hoVao * 60 + phutVao;
  const thoiGianRa = hoRa * 60 + phutRa;
  
  const soPhut = thoiGianRa - thoiGianVao;
  return Math.round(soPhut / 60 * 10) / 10; // Làm tròn đến 0.1 giờ
}

/**
 * Tính số ngày làm việc trong tháng từ danh sách chấm công
 */
export function calculateWorkingDaysInMonth(attendanceList) {
  if (!attendanceList || attendanceList.length === 0) return 0;
  
  const uniqueDates = new Set(attendanceList.map(a => a.Ngay));
  return uniqueDates.size;
}

/**
 * Lọc chấm công theo trạng thái
 */
export function filterAttendanceByStatus(attendanceList, status) {
  if (!status) return attendanceList;
  return attendanceList.filter(a => a.TrangThai === status);
}

// ============= NGHỈ PHÉP (LEAVE) =============

/**
 * Format trạng thái đơn nghỉ
 */
export function formatLeaveStatus(status) {
  const statusMap = {
    'CHO_DUYET': 'Chờ duyệt',
    'DA_DUYET': 'Đã duyệt',
    'TU_CHOI': 'Từ chối',
    'DA_HUY': 'Đã hủy',
  };
  return statusMap[status] || status;
}

/**
 * Tính số ngày nghỉ thực tế (loại trừ thứ 7, CN)
 */
export function calculateLeaveDays(tuNgay, denNgay) {
  const startDate = new Date(tuNgay);
  const endDate = new Date(denNgay);
  let count = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      count++;
    }
  }

  return count;
}

/**
 * Validate đơn nghỉ phép
 */
export function validateLeaveForm(formData) {
  const errors = {};

  if (!formData.maNhanVien) {
    errors.maNhanVien = 'Vui lòng nhập mã nhân viên';
  }

  if (!formData.tuNgay) {
    errors.tuNgay = 'Vui lòng chọn từ ngày';
  }

  if (!formData.denNgay) {
    errors.denNgay = 'Vui lòng chọn đến ngày';
  }

  if (formData.tuNgay && formData.denNgay) {
    const startDate = new Date(formData.tuNgay);
    const endDate = new Date(formData.denNgay);
    
    if (startDate > endDate) {
      errors.denNgay = 'Đến ngày phải >= từ ngày';
    }
  }

  return errors;
}

/**
 * Lọc đơn nghỉ theo trạng thái
 */
export function filterLeaveByStatus(leaveList, status) {
  if (!status) return leaveList;
  return leaveList.filter(l => l.TrangThai === status);
}

/**
 * Lọc đơn nghỉ theo nhân viên
 */
export function filterLeaveByEmployee(leaveList, maNhanVien) {
  if (!maNhanVien) return leaveList;
  return leaveList.filter(l => l.MaNhanVien === maNhanVien);
}

// ============= TÍNH LƯƠNG (SALARY) =============

/**
 * Format tiền tệ VND
 */
export function formatSalaryAmount(amount) {
  if (typeof amount !== 'number') return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Tính lương thực lĩnh
 * Công thức: (LuongCoBan * SoNgayLam / 22) + PhuCap + Thuong - KhauTru
 */
export function calculateNetSalary(luongCoBan, soNgayLam, phuCap = 0, thuong = 0, khauTru = 0) {
  const luongTheoNgay = (luongCoBan * soNgayLam) / 22;
  return luongTheoNgay + phuCap + thuong - khauTru;
}

/**
 * Validate form tính lương
 */
export function validateSalaryForm(formData) {
  const errors = {};

  if (!formData.maNhanVien) {
    errors.maNhanVien = 'Vui lòng nhập mã nhân viên';
  }

  if (!formData.thang || formData.thang < 1 || formData.thang > 12) {
    errors.thang = 'Tháng phải từ 1 đến 12';
  }

  if (!formData.nam || formData.nam < 2020) {
    errors.nam = 'Năm không hợp lệ';
  }

  return errors;
}

/**
 * Nhóm danh sách lương theo nhân viên
 */
export function groupSalaryByEmployee(salaryList) {
  return salaryList.reduce((acc, salary) => {
    if (!acc[salary.MaNhanVien]) {
      acc[salary.MaNhanVien] = {
        maNhanVien: salary.MaNhanVien,
        hoTen: salary.HoTen,
        salaries: [],
      };
    }
    acc[salary.MaNhanVien].salaries.push(salary);
    return acc;
  }, {});
}

/**
 * Tính tổng lương theo kỳ
 */
export function calculateTotalSalaryByPeriod(salaryList) {
  return salaryList.reduce((total, salary) => {
    return total + (salary.TongLuong || 0);
  }, 0);
}

/**
 * Tính lương trung bình
 */
export function calculateAverageSalary(salaryList) {
  if (salaryList.length === 0) return 0;
  const total = calculateTotalSalaryByPeriod(salaryList);
  return total / salaryList.length;
}

/**
 * Lọc lương theo nhân viên
 */
export function filterSalaryByEmployee(salaryList, maNhanVien) {
  if (!maNhanVien) return salaryList;
  return salaryList.filter(s => s.MaNhanVien === maNhanVien);
}

/**
 * Chuẩn bị dữ liệu cho biểu đồ lương
 */
export function prepareSalaryChartData(salaryList) {
  return salaryList.map(s => ({
    name: s.HoTen || s.MaNhanVien,
    salary: s.TongLuong || 0,
  }));
}
