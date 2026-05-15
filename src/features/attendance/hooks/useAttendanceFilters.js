import { useMemo, useState } from 'react';
import { ATTENDANCE_FILTER_MODE } from '../constants/attendanceConstants';
import { buildAttendanceRange, monthValueFromDate, todayValue } from '../utils/attendanceFilters';

export default function useAttendanceFilters() {
  const initialFilters = {
    employeeId: '',
    filterMode: ATTENDANCE_FILTER_MODE.DAY,
    selectedDate: todayValue(),
    selectedMonth: monthValueFromDate(),
  };

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const canQueryHistory = useMemo(() => Boolean(buildAttendanceRange(appliedFilters)), [appliedFilters]);

  function updateFilter(key, value) {
    setDraftFilters((previous) => ({ ...previous, [key]: value }));
  }

  function applyFilters() {
    setAppliedFilters(draftFilters);
  }

  function resetFilters() {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }

  return {
    draftFilters,
    appliedFilters,
    canQueryHistory,
    updateFilter,
    applyFilters,
    resetFilters,
  };
}
