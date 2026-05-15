import SectionHeader from '../components/ui/SectionHeader';
import Toast from '../components/ui/Toast';
import AttendanceStateBanner from '../components/attendance/AttendanceStateBanner';
import AttendanceFilters from '../components/attendance/AttendanceFilters';
import AttendanceStatsCards from '../components/attendance/AttendanceStatsCards';
import AttendanceCalendar from '../components/attendance/AttendanceCalendar';
import AttendanceTable from '../components/attendance/AttendanceTable';
import CheckInOutPanel from '../components/attendance/CheckInOutPanel';
import LeavePanel from '../components/attendance/LeavePanel';
import SalaryPanel from '../components/attendance/SalaryPanel';
import Panel from '../components/ui/Panel';
import { useAttendanceState } from '../hooks/useAttendanceState';

export default function Attendance(props) {
  const {
    isNode,
    localEmployees = [],
    payrollChartData = [],
  } = props;

  const state = useAttendanceState(props);

  if (!isNode) {
    return (
      <>
        <SectionHeader
          eyebrow="Attendance"
          title="Cham cong va dong bo du lieu attendance"
          description="Module nay chi hoat dong trong profile chi nhanh."
        />
        <Panel title="Can profile node">
          <p className="text-sm text-[var(--hr-muted)]">Dang nhap node HCM hoac node HN de su dung module nay.</p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Attendance"
        title="Cham cong, thong ke va bo loc attendance"
        description="Refactor module cham cong theo huong tach state, tach service va bo sung sync-friendly UI."
      />

      <Toast type={state.toast.type} message={state.toast.message} onClose={() => state.setToast({ type: 'success', message: '' })} />
      <AttendanceStateBanner banner={state.banner} onRetry={state.refreshReport} />

      <div className="space-y-6">
        <AttendanceFilters
          filters={state.filters}
          setFilters={state.setFilters}
          reportFilters={state.reportFilters}
          setReportFilters={state.setReportFilters}
          employees={localEmployees}
          onApply={state.refreshReport}
        />
        <AttendanceStatsCards stats={state.stats} />
        <CheckInOutPanel
          employees={localEmployees}
          checkInForm={state.checkInForm}
          setCheckInForm={state.setCheckInForm}
          checkOutForm={state.checkOutForm}
          setCheckOutForm={state.setCheckOutForm}
          onCheckIn={state.handleCheckIn}
          onCheckOut={state.handleCheckOut}
          submittingKey={props.submittingKey}
          checkInResult={state.results.checkIn}
          checkOutResult={state.results.checkOut}
          checkInError={state.formErrors.checkIn}
          checkOutError={state.formErrors.checkOut}
        />
        <AttendanceCalendar
          calendarMap={state.calendarMap}
          month={state.reportFilters.thang}
          year={state.reportFilters.nam}
        />
        <AttendanceTable rows={state.rows} />
        <LeavePanel
          employees={localEmployees}
          leaveForm={state.leaveForm}
          setLeaveForm={state.setLeaveForm}
          approvalForm={state.approvalForm}
          setApprovalForm={state.setApprovalForm}
          leaves={props.leaves}
          onRequest={state.handleLeaveRequest}
          onApprove={state.handleLeaveApproval}
          submittingKey={props.submittingKey}
          errors={state.formErrors}
          latestLeave={state.results.leave}
        />
        <SalaryPanel
          employees={localEmployees}
          salaryForm={state.salaryForm}
          setSalaryForm={state.setSalaryForm}
          salaryResult={state.results.salary}
          salaryError={state.formErrors.salary}
          onGenerate={state.handleSalaryGenerate}
          submittingKey={props.submittingKey}
          payrollChartData={payrollChartData}
        />
      </div>
    </>
  );
}
