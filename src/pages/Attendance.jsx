import { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import AttendanceCalendar from '../features/attendance/components/AttendanceCalendar';
import AttendanceCheckForm from '../features/attendance/components/AttendanceCheckForm';
import AttendanceEmptyState from '../features/attendance/components/AttendanceEmptyState';
import AttendanceErrorState from '../features/attendance/components/AttendanceErrorState';
import AttendanceFilters from '../features/attendance/components/AttendanceFilters';
import AttendanceHistoryTable from '../features/attendance/components/AttendanceHistoryTable';
import AttendanceStatsCards from '../features/attendance/components/AttendanceStatsCards';
import AttendanceStatusSummary from '../features/attendance/components/AttendanceStatusSummary';
import useAttendanceActions from '../features/attendance/hooks/useAttendanceActions';
import useAttendanceCalendar from '../features/attendance/hooks/useAttendanceCalendar';
import useAttendanceFilters from '../features/attendance/hooks/useAttendanceFilters';
import useAttendanceHistory from '../features/attendance/hooks/useAttendanceHistory';
import useAttendanceSummary from '../features/attendance/hooks/useAttendanceSummary';

export default function Attendance({
  isNode,
  nodeApi,
  localEmployees = [],
}) {
  const { draftFilters, appliedFilters, canQueryHistory, updateFilter, applyFilters, resetFilters } = useAttendanceFilters();
  const [reloadKey, setReloadKey] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [leaveError, setLeaveError] = useState('');

  const actions = useAttendanceActions({
    nodeApi,
    onSuccess: () => setReloadKey((previous) => previous + 1),
  });

  const history = useAttendanceHistory({
    nodeApi,
    filters: appliedFilters,
    reloadKey,
  });

  useEffect(() => {
    if (!isNode || !nodeApi || !appliedFilters.employeeId) {
      setLeaves([]);
      setLeaveError('');
      return;
    }

    let active = true;
    setLeaveError('');

    nodeApi
      .listLeaves({ maNhanVien: appliedFilters.employeeId })
      .then((result) => {
        if (active) setLeaves(result || []);
      })
      .catch((error) => {
        if (active) {
          setLeaves([]);
          setLeaveError(error.message || 'Khong tai duoc danh sach nghi phep.');
        }
      });

    return () => {
      active = false;
    };
  }, [isNode, nodeApi, appliedFilters.employeeId, reloadKey]);

  const summary = useAttendanceSummary({
    rows: history.rows,
    leaves,
    range: history.range,
    employeeId: appliedFilters.employeeId,
  });

  const calendarCells = useAttendanceCalendar({
    filters: appliedFilters,
    rows: history.rows,
    leaveDates: summary.leaveDates,
  });

  if (!isNode) {
    return (
      <>
        <SectionHeader
          eyebrow="Attendance"
          title="Cham cong"
          description="Module nay chi hoat dong trong profile chi nhanh va bam sat flow attendance cua backend node."
        />
        <Panel title="Can profile node" subtitle="Attendance la endpoint cua node.">
          <p className="text-sm text-[var(--hr-muted)]">Dang nhap moi truong chi nhanh de su dung module cham cong.</p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Attendance"
        title="Cham cong"
        description="Module attendance da duoc tach rieng theo 3 flow backend: check-in, check-out va tra cuu lich su theo nhan vien + khoang ngay."
      />

      <div className="space-y-6">
        <AttendanceFilters
          employees={localEmployees}
          filters={draftFilters}
          updateFilter={updateFilter}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <AttendanceCheckForm
            type="checkin"
            title="Cham cong vao"
            subtitle="POST /node/attendance/check-in"
            employees={localEmployees}
            form={actions.checkInForm}
            setForm={actions.setCheckInForm}
            error={actions.checkInError}
            result={actions.checkInResult}
            loading={actions.submittingKey === 'checkin'}
            onSubmit={actions.submitIn}
          />

          <AttendanceCheckForm
            type="checkout"
            title="Cham cong ra"
            subtitle="POST /node/attendance/check-out"
            employees={localEmployees}
            form={actions.checkOutForm}
            setForm={actions.setCheckOutForm}
            error={actions.checkOutError}
            result={actions.checkOutResult}
            loading={actions.submittingKey === 'checkout'}
            onSubmit={actions.submitOut}
          />
        </div>

        {actions.retryableAction ? (
          <AttendanceErrorState
            message="Phat hien loi timeout/network khi submit. Ban co the thu lai thao tac vua roi."
            onRetry={actions.retryableAction}
            retryLabel="Thu lai thao tac"
          />
        ) : null}

        <AttendanceStatsCards present={summary.present} late={summary.late} leave={summary.leave} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Panel title="Lich su cham cong" subtitle="GET /node/attendance/:maNhanVien?tuNgay&denNgay">
              {!appliedFilters.employeeId ? (
                <AttendanceEmptyState
                  title="Chon nhan vien de xem lich su"
                  description="Backend hien tai yeu cau ma nhan vien trong endpoint attendance history."
                />
              ) : history.error ? (
                <AttendanceErrorState message={history.error} onRetry={history.retry} />
              ) : history.loading ? (
                <p className="text-sm text-[var(--hr-muted)]">Dang tai lich su cham cong...</p>
              ) : (
                <AttendanceHistoryTable rows={history.rows} />
              )}
            </Panel>

            {leaveError ? <AttendanceErrorState message={leaveError} /> : null}

            <AttendanceStatusSummary latest={summary.latest} />
          </div>

          <AttendanceCalendar cells={calendarCells} />
        </div>

        {!canQueryHistory ? (
          <AttendanceEmptyState
            title="Bo loc chua du thong tin"
            description="Hay chon nhan vien va ngay hoac thang de frontend sinh tuNgay-denNgay dung voi flow backend."
          />
        ) : null}
      </div>
    </>
  );
}
