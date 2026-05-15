import { useEffect, useMemo, useState } from 'react';
import {
  createAttendanceEvent,
  deriveAttendanceStats,
  buildAttendanceCalendar,
  buildAttendanceRows,
  filterAttendanceRows,
  getRetryableMessage,
} from '../utils/attendanceLogic';
import { normalizeAttendanceMutationError } from '../services/attendanceService';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function defaultMonth() {
  return new Date().getMonth() + 1;
}

function defaultYear() {
  return new Date().getFullYear();
}

export function useAttendanceState({
  nodeData,
  leaves,
  localEmployees,
  reportFilters,
  setReportFilters,
  nodeApi,
  runAction,
}) {
  const [filters, setFilters] = useState({
    date: '',
    employeeId: '',
    keyword: reportFilters?.keyword || '',
  });
  const [toast, setToast] = useState({ type: 'success', message: '' });
  const [banner, setBanner] = useState({ message: '', retryable: false });
  const [latestEvents, setLatestEvents] = useState([]);
  const [checkInForm, setCheckInForm] = useState({ maNhanVien: '', ngay: today(), gioVao: '08:00:00' });
  const [checkOutForm, setCheckOutForm] = useState({ maNhanVien: '', ngay: today(), gioRa: '17:00:00' });
  const [leaveForm, setLeaveForm] = useState({ maNhanVien: '', tuNgay: today(), denNgay: today(), lyDo: '' });
  const [approvalForm, setApprovalForm] = useState({ maNghiPhep: '', trangThai: 'DA_DUYET' });
  const [salaryForm, setSalaryForm] = useState({
    maNhanVien: '',
    thang: defaultMonth(),
    nam: defaultYear(),
    phuCap: '',
    thuong: '',
    khauTru: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [results, setResults] = useState({ checkIn: null, checkOut: null, leave: null, salary: null });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setReportFilters((previous) => ({ ...previous }));
    }, 60000);

    return () => window.clearInterval(interval);
  }, [setReportFilters]);

  useEffect(() => {
    setFilters((previous) => ({ ...previous, keyword: reportFilters?.keyword || '' }));
  }, [reportFilters?.keyword]);

  const rows = useMemo(() => {
    const baseRows = buildAttendanceRows({
      employees: localEmployees,
      attendance: nodeData?.report?.attendance || [],
      leaves,
      latestEvents,
      filters: {
        ...reportFilters,
        employeeId: filters.employeeId,
        keyword: filters.keyword,
      },
    });
    return filterAttendanceRows(baseRows, filters);
  }, [filters, latestEvents, leaves, localEmployees, nodeData?.report?.attendance, reportFilters]);

  const stats = useMemo(
    () => deriveAttendanceStats({ rows, leaves, latestEvents }),
    [latestEvents, leaves, rows],
  );

  const calendarMap = useMemo(
    () => buildAttendanceCalendar({ rows, leaves, latestEvents, filters: reportFilters }),
    [latestEvents, leaves, reportFilters, rows],
  );

  const refreshReport = () => {
    setReportFilters((previous) => ({ ...previous, keyword: filters.keyword }));
  };

  function showError(error, fallback) {
    const normalized = normalizeAttendanceMutationError(error);
    setBanner({
      message: normalized.message || fallback,
      retryable: normalized.retryable || getRetryableMessage(normalized.message),
    });
    setToast({ type: 'error', message: normalized.message || fallback });
  }

  function showSuccess(message) {
    setBanner({ message: '', retryable: false });
    setToast({ type: 'success', message });
  }

  function validateEmployeeAndTime(employeeId, date, time, label) {
    if (!employeeId?.trim()) return 'Ma nhan vien khong duoc de trong.';
    if (!date) return 'Ngay khong duoc de trong.';
    if (!time?.trim()) return `${label} khong duoc de trong.`;
    return '';
  }

  function handleCheckIn() {
    const error = validateEmployeeAndTime(checkInForm.maNhanVien, checkInForm.ngay, checkInForm.gioVao, 'Gio vao');
    if (error) {
      setFormErrors((previous) => ({ ...previous, checkIn: error }));
      return;
    }

    setFormErrors((previous) => ({ ...previous, checkIn: '' }));
    runAction(
      'checkin',
      () => nodeApi.checkIn({ ...checkInForm }),
      (result) => {
        setResults((previous) => ({ ...previous, checkIn: result }));
        setLatestEvents((previous) => [...previous, createAttendanceEvent('checkin', { ...result, gioVao: checkInForm.gioVao })]);
        showSuccess('Check-in thanh cong');
      },
    ).catch((errorResult) => showError(errorResult, 'Check-in that bai'));
  }

  function handleCheckOut() {
    const error = validateEmployeeAndTime(checkOutForm.maNhanVien, checkOutForm.ngay, checkOutForm.gioRa, 'Gio ra');
    if (error) {
      setFormErrors((previous) => ({ ...previous, checkOut: error }));
      return;
    }

    setFormErrors((previous) => ({ ...previous, checkOut: '' }));
    runAction(
      'checkout',
      () => nodeApi.checkOut({ ...checkOutForm }),
      (result) => {
        setResults((previous) => ({ ...previous, checkOut: result }));
        setLatestEvents((previous) => [...previous, createAttendanceEvent('checkout', { ...result, gioRa: checkOutForm.gioRa })]);
        showSuccess('Check-out thanh cong');
      },
    ).catch((errorResult) => showError(errorResult, 'Check-out that bai'));
  }

  function handleLeaveRequest() {
    if (!leaveForm.maNhanVien?.trim() || !leaveForm.lyDo?.trim()) {
      setFormErrors((previous) => ({ ...previous, leave: 'Vui long nhap nhan vien va ly do nghi phep.' }));
      return;
    }
    if (leaveForm.tuNgay > leaveForm.denNgay) {
      setFormErrors((previous) => ({ ...previous, leave: 'Tu ngay phai nho hon hoac bang den ngay.' }));
      return;
    }

    setFormErrors((previous) => ({ ...previous, leave: '' }));
    runAction(
      'leave-request',
      () => nodeApi.createLeave(leaveForm),
      (result) => {
        setResults((previous) => ({ ...previous, leave: result }));
        setApprovalForm((previous) => ({ ...previous, maNghiPhep: String(result?.maNghiPhep || '') }));
        showSuccess('Gui don nghi phep thanh cong');
      },
    ).catch((errorResult) => showError(errorResult, 'Gui don nghi phep that bai'));
  }

  function handleLeaveApproval() {
    if (!approvalForm.maNghiPhep?.trim()) {
      setFormErrors((previous) => ({ ...previous, approval: 'Vui long nhap ma nghi phep.' }));
      return;
    }

    setFormErrors((previous) => ({ ...previous, approval: '' }));
    runAction(
      'leave-approval',
      () => nodeApi.approveLeave(approvalForm.maNghiPhep.trim(), { trangThai: approvalForm.trangThai }),
      () => showSuccess('Cap nhat don nghi phep thanh cong'),
    ).catch((errorResult) => showError(errorResult, 'Duyet nghi phep that bai'));
  }

  function handleSalaryGenerate() {
    if (!salaryForm.maNhanVien?.trim()) {
      setFormErrors((previous) => ({ ...previous, salary: 'Vui long nhap ma nhan vien.' }));
      return;
    }

    setFormErrors((previous) => ({ ...previous, salary: '' }));
    runAction(
      'salary',
      () => nodeApi.generateSalary({
        ...salaryForm,
        thang: Number(salaryForm.thang),
        nam: Number(salaryForm.nam),
        phuCap: Number(salaryForm.phuCap || 0),
        thuong: Number(salaryForm.thuong || 0),
        khauTru: Number(salaryForm.khauTru || 0),
      }),
      (result) => {
        setResults((previous) => ({ ...previous, salary: result }));
        showSuccess('Tinh luong thanh cong');
      },
    ).catch((errorResult) => showError(errorResult, 'Tinh luong that bai'));
  }

  return {
    filters,
    setFilters,
    toast,
    setToast,
    banner,
    rows,
    stats,
    calendarMap,
    results,
    formErrors,
    checkInForm,
    setCheckInForm,
    checkOutForm,
    setCheckOutForm,
    leaveForm,
    setLeaveForm,
    approvalForm,
    setApprovalForm,
    salaryForm,
    setSalaryForm,
    reportFilters,
    setReportFilters,
    refreshReport,
    handleCheckIn,
    handleCheckOut,
    handleLeaveRequest,
    handleLeaveApproval,
    handleSalaryGenerate,
    latestEvents,
  };
}
