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
          setLeaveError(error.message || 'Không tải được danh sách nghỉ phép.');
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
          title="Chấm công"
          description="Module này chỉ hoạt động trong profile chi nhánh và bám sát nghiệp vụ chấm công của backend node."
        />
        <Panel title="Cần profile chi nhánh" subtitle="Đăng nhập vào môi trường chi nhánh để thao tác chấm công.">
          <p className="text-sm text-[var(--hr-muted)]">Đăng nhập môi trường chi nhánh để sử dụng module chấm công.</p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Attendance"
        title="Chấm công"
        description="Module chấm công gồm ba luồng chính: chấm vào, chấm ra và tra cứu lịch sử theo nhân viên trong khoảng ngày."
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
            title="Chấm công vào"
            subtitle="Ghi nhận giờ vào làm của nhân viên."
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
            title="Chấm công ra"
            subtitle="Ghi nhận giờ ra và hoàn tất ngày công."
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
            message="Phát hiện lỗi timeout hoặc mạng khi gửi dữ liệu. Bạn có thể thử lại thao tác vừa rồi."
            onRetry={actions.retryableAction}
            retryLabel="Thử lại thao tác"
          />
        ) : null}

        <AttendanceStatsCards present={summary.present} late={summary.late} leave={summary.leave} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Panel title="Lịch sử chấm công" subtitle="Tra cứu theo nhân viên và khoảng thời gian đã chọn.">
              {!appliedFilters.employeeId ? (
                <AttendanceEmptyState
                  title="Chọn nhân viên để xem lịch sử"
                  description="Hãy chọn nhân viên và kỳ thời gian cần tra cứu."
                />
              ) : history.error ? (
                <AttendanceErrorState message={history.error} onRetry={history.retry} />
              ) : history.loading ? (
                <p className="text-sm text-[var(--hr-muted)]">Đang tải lịch sử chấm công...</p>
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
            title="Bộ lọc chưa đủ thông tin"
            description="Hãy chọn nhân viên và ngày hoặc tháng để tra cứu lịch sử chấm công."
          />
        ) : null}
      </div>
    </>
  );
}
