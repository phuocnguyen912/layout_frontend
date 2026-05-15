import { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import PermissionGuard from '../components/layout/PermissionGuard';
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import AttendanceWorkdayPanel from '../components/ui/attendance/AttendanceWorkdayPanel';
import LeaveManagementPanel from '../components/ui/attendance/LeaveManagementPanel';
import PayrollOverviewPanel from '../components/ui/attendance/PayrollOverviewPanel';
import AttendanceSummaryCards from '../components/ui/attendance/AttendanceSummaryCards';

/* ─── helpers ─── */
function today() { return new Date().toISOString().slice(0, 10); }

function validateMaNV(v) {
  if (!v?.trim()) return 'Mã nhân viên không được để trống.';
  if (v.trim().length > 10) return 'Mã nhân viên tối đa 10 ký tự.';
  return '';
}
function validateTime(v) {
  if (!v?.trim()) return 'Giờ không được để trống.';
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(v.trim())) return 'Định dạng giờ phải là HH:mm hoặc HH:mm:ss.';
  return '';
}
function ensureSeconds(t) {
  return t && t.split(':').length === 2 ? t + ':00' : t;
}

export default function Attendance({
  isNode,
  nodeApi,
  leaves,
  runAction,
  submittingKey,
  payrollChartData,
  localEmployees = [],
}) {
  /* ── Bước 1: Check-in / Check-out ── */
  const [ciForm, setCiForm] = useState({ maNhanVien: '', ngay: today(), gio: '08:00:00' });
  const [coForm, setCoForm] = useState({ maNhanVien: '', ngay: today(), gio: '17:00:00' });
  const [ciError, setCiError] = useState('');
  const [coError, setCoError] = useState('');
  const [ciResult, setCiResult] = useState(null);
  const [coResult, setCoResult] = useState(null);

  function handleCheckIn() {
    const e = validateMaNV(ciForm.maNhanVien) || (!ciForm.ngay ? 'Ngày không được để trống.' : '') || validateTime(ciForm.gio);
    if (e) { setCiError(e); return; }
    setCiError(''); setCiResult(null);
    runAction('checkin',
      () => nodeApi.checkIn({ maNhanVien: ciForm.maNhanVien.trim(), ngay: ciForm.ngay, gioVao: ensureSeconds(ciForm.gio) + ' 1/1/1970' }),
      (res) => setCiResult(res)
    );
  }

  function handleCheckOut() {
    const e = validateMaNV(coForm.maNhanVien) || (!coForm.ngay ? 'Ngày không được để trống.' : '') || validateTime(coForm.gio);
    if (e) { setCoError(e); return; }
    setCoError(''); setCoResult(null);
    runAction('checkout',
      () => nodeApi.checkOut({ maNhanVien: coForm.maNhanVien.trim(), ngay: coForm.ngay, gioRa: ensureSeconds(coForm.gio) + ' 1/1/1970' }),
      (res) => setCoResult(res)
    );
  }

  /* ── Bước 3: Nghỉ phép ── */
  const [leaveForm, setLeaveForm] = useState({ maNhanVien: '', tuNgay: today(), denNgay: today(), lyDo: '' });
  const [leaveError, setLeaveError] = useState('');
  const [leaveCreated, setLeaveCreated] = useState(null);
  const [approvalForm, setApprovalForm] = useState({ maNghiPhep: '', trangThai: 'DA_DUYET' });
  const [approvalError, setApprovalError] = useState('');

  function handleCreateLeave() {
    const e = validateMaNV(leaveForm.maNhanVien);
    if (e) { setLeaveError(e); return; }
    if (!leaveForm.lyDo?.trim()) { setLeaveError('Lý do không được để trống.'); return; }
    if (leaveForm.tuNgay > leaveForm.denNgay) { setLeaveError('Từ ngày phải ≤ đến ngày.'); return; }
    setLeaveError(''); setLeaveCreated(null);
    runAction('leave-request', () => nodeApi.createLeave(leaveForm), (res) => {
      setLeaveCreated(res);
      setApprovalForm((p) => ({ ...p, maNghiPhep: String(res?.maNghiPhep || '') }));
    });
  }

  function handleApproveLeave() {
    const id = approvalForm.maNghiPhep?.trim();
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      setApprovalError('Mã nghỉ phép phải là số nguyên dương.'); return;
    }
    setApprovalError('');
    runAction('leave-approval', () => nodeApi.approveLeave(id, { trangThai: approvalForm.trangThai }));
  }

  /* ── Bước 4: Tính lương ── */
  const [salaryForm, setSalaryForm] = useState({
    maNhanVien: '',
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    phuCap: '',
    thuong: '',
    khauTru: '',
  });
  const [salaryError, setSalaryError] = useState('');
  const [salaryResult, setSalaryResult] = useState(null);
  const pendingLeaveCount = leaves.filter(l => l.TrangThai === 'CHO_DUYET').length;
  const payrollTotal = payrollChartData.reduce((acc, curr) => acc + (curr.total || 0), 0);

  function handleGenerateSalary() {
    const e = validateMaNV(salaryForm.maNhanVien);
    if (e) { setSalaryError(e); return; }
    const thang = Number(salaryForm.thang);
    const nam = Number(salaryForm.nam);
    if (!thang || thang < 1 || thang > 12) { setSalaryError('Tháng phải từ 1 đến 12.'); return; }
    if (!nam || nam < 2000 || nam > 2100) { setSalaryError('Năm không hợp lệ.'); return; }
    setSalaryError(''); setSalaryResult(null);
    runAction('salary', () => nodeApi.generateSalary({
      maNhanVien: salaryForm.maNhanVien.trim(),
      thang,
      nam,
      phuCap: salaryForm.phuCap ? Number(salaryForm.phuCap) : 0,
      thuong: salaryForm.thuong ? Number(salaryForm.thuong) : 0,
      khauTru: salaryForm.khauTru ? Number(salaryForm.khauTru) : 0,
    }), (res) => setSalaryResult(res));
  }

  return (
    <>
      <SectionHeader 
        eyebrow="Attendance" 
        title="Chấm công, nghỉ phép, tính lương" 
        description="Toàn bộ thao tác nghiệp vụ node được gom vào một khu giao diện để nhập nhanh." 
      />

      <PermissionGuard
        hasPermission={isNode}
        title="Không dùng profile node"
        subtitle="Trang này cần đăng nhập profile chi nhánh để thao tác chấm công và tính lương."
        description="Module này chỉ khả dụng cho HR manager hoặc Admin tại chi nhánh."
      >
        <ResponsiveGrid>
          <AttendanceWorkdayPanel
            employees={localEmployees}
            checkIn={{
              error: ciError,
              result: ciResult,
              form: ciForm,
              setForm: setCiForm,
              submitting: submittingKey === 'checkin',
              onSubmit: handleCheckIn,
            }}
            checkOut={{
              error: coError,
              result: coResult,
              form: coForm,
              setForm: setCoForm,
              submitting: submittingKey === 'checkout',
              onSubmit: handleCheckOut,
            }}
          />

          <LeaveManagementPanel
            employees={localEmployees}
            leaves={leaves}
            request={{
              error: leaveError,
              created: leaveCreated,
              form: leaveForm,
              setForm: setLeaveForm,
              submitting: submittingKey === 'leave-request',
              onSubmit: handleCreateLeave,
            }}
            approval={{
              error: approvalError,
              form: approvalForm,
              setForm: setApprovalForm,
              submitting: submittingKey === 'leave-approval',
              onSubmit: handleApproveLeave,
            }}
          />
        </ResponsiveGrid>

        <PayrollOverviewPanel
          employees={localEmployees}
          payrollChartData={payrollChartData}
          salary={{
            error: salaryError,
            result: salaryResult,
            form: salaryForm,
            setForm: setSalaryForm,
            submitting: submittingKey === 'salary',
            onSubmit: handleGenerateSalary,
          }}
        />

        <AttendanceSummaryCards
          employeeCount={localEmployees.length}
          pendingLeaveCount={pendingLeaveCount}
          payrollTotal={payrollTotal}
        />
      </PermissionGuard>
    </>
  );
}
