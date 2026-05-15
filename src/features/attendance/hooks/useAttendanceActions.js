import { useState } from 'react';
import { submitCheckIn, submitCheckOut } from '../api/attendanceService';
import { todayValue } from '../utils/attendanceFilters';
import { isRetryableAttendanceError } from '../utils/attendanceRetry';

function validateEmployeeId(value) {
  if (!value?.trim()) return 'Ma nhan vien khong duoc de trong.';
  if (value.trim().length > 10) return 'Ma nhan vien toi da 10 ky tu.';
  return '';
}

function validateTime(value) {
  if (!value?.trim()) return 'Gio khong duoc de trong.';
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value.trim())) return 'Dinh dang gio phai la HH:mm hoac HH:mm:ss.';
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
      (!checkInForm.ngay ? 'Ngay khong duoc de trong.' : '') ||
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
      (!checkOutForm.ngay ? 'Ngay khong duoc de trong.' : '') ||
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
