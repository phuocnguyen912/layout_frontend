import { useEffect, useState } from 'react';
import { fetchAttendanceHistory } from '../api/attendanceService';
import { ATTENDANCE_RETRY_LIMIT } from '../constants/attendanceConstants';
import { isRetryableAttendanceError } from '../utils/attendanceRetry';

export default function useAttendanceHistory({ nodeApi, filters, reloadKey = 0 }) {
  const [rows, setRows] = useState([]);
  const [range, setRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  async function loadHistory() {
    if (!nodeApi) return;

    setLoading(true);
    setError('');

    try {
      let attempt = 0;

      while (attempt <= ATTENDANCE_RETRY_LIMIT) {
        try {
          const result = await fetchAttendanceHistory(nodeApi, filters);
          setRows(result.rows);
          setRange(result.range);
          setRetryCount(attempt);
          return;
        } catch (nextError) {
          if (isRetryableAttendanceError(nextError) && attempt < ATTENDANCE_RETRY_LIMIT) {
            attempt += 1;
            continue;
          }

          throw nextError;
        }
      }
    } catch (nextError) {
      setRows([]);
      setRange(null);
      setError(nextError.message);
      setRetryCount(ATTENDANCE_RETRY_LIMIT);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!filters?.employeeId?.trim()) {
      setRows([]);
      setRange(null);
      setError('');
      setRetryCount(0);
      return;
    }

    loadHistory();
  }, [nodeApi, filters, reloadKey]);

  function retry() {
    loadHistory();
  }

  return {
    rows,
    range,
    loading,
    error,
    retryCount,
    retry,
  };
}
