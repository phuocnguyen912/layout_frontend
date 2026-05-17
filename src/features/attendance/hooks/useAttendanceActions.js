import { useState } from 'react';
import { submitCheckIn, submitCheckOut } from '../api/attendanceService';
import { todayValue } from '../utils/attendanceFilters';
import { isRetryableAttendanceError } from '../utils/attendanceRetry';

function validateEmployeeId(value) {
  if (!value?.trim()) return 'Mã nhân viên không được để trống.';
  if (value.trim().length > 10) return 'Mã nhân viên tối đa 10 ký tự.';
  return '';
}

function validateTime(value) {
  if (!value?.trim()) return 'Giờ không được để trống.';
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value.trim())) return 'Định dạng giờ phải là HH:mm hoặc HH:mm:ss.';
  return '';
}

const initialCheckIn = { maNhanVien: '', ngay: todayValue(), gioVao: '08:00:00' };
const initialCheckOut = { maNhanVien: '', ngay: todayValue(), gioRa: '17:00:00' };

export default function useAttendanceActions({ nodeApi, onSuccess }) {
  const [checkInForm, setCheckInForm] = useState(initialCheckIn);
  const [checkOutForm, setCheckOutForm] = useState(initialCheckOut);
  const [checkInError, setCheckInError] = useState('');
  const [checkOutError, setCheckOutError] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [checkOutResult, setCheckOutResult] = useState(null);
  const [submittingKey, setSubmittingKey] = useState('');
  const [retryableAction, setRetryableAction] = useState(null);

  async function runAction(key, action, setError, setResult) {
    setSubmittingKey(key);
    setError('');
    setRetryableAction(null);

    try {
      const result = await action();
      setResult(result);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      setError(error.message);
      if (isRetryableAttendanceError(error)) {
        setRetryableAction(() => () => runAction(key, action, setError, setResult));
      }
    } finally {
      setSubmittingKey('');
    }
  }

  function submitIn() {
    const nextError =
      validateEmployeeId(checkInForm.maNhanVien) ||
      (!checkInForm.ngay ? 'Ngày không được để trống.' : '') ||
      validateTime(checkInForm.gioVao);

    if (nextError) {
      setCheckInError(nextError);
      return;
    }

    setCheckInResult(null);

    runAction(
      'checkin',
      () => submitCheckIn(nodeApi, checkInForm),
      setCheckInError,
      setCheckInResult,
    );
  }

  function submitOut() {
    const nextError =
      validateEmployeeId(checkOutForm.maNhanVien) ||
      (!checkOutForm.ngay ? 'Ngày không được để trống.' : '') ||
      validateTime(checkOutForm.gioRa);

    if (nextError) {
      setCheckOutError(nextError);
      return;
    }

    setCheckOutResult(null);

    runAction(
      'checkout',
      () => submitCheckOut(nodeApi, checkOutForm),
      setCheckOutError,
      setCheckOutResult,
    );
  }

  return {
    checkInForm,
    setCheckInForm,
    checkOutForm,
    setCheckOutForm,
    checkInError,
    checkOutError,
    checkInResult,
    checkOutResult,
    submittingKey,
    retryableAction,
    submitIn,
    submitOut,
  };
}
