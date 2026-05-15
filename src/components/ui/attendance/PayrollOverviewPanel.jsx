import AttendanceStatsChart from './AttendanceStatsChart';
import SalaryGenerationPanel from './SalaryGenerationPanel';
import Panel from '../Panel';
import ResponsiveGrid from '../../layout/ResponsiveGrid';

export default function PayrollOverviewPanel({ salary, employees, payrollChartData }) {
  return (
    <ResponsiveGrid variant="payroll" className="mt-6">
      <Panel title="Tính lương" subtitle="Chạy bảng lương cho từng nhân viên.">
        <SalaryGenerationPanel
          error={salary.error}
          result={salary.result}
          form={salary.form}
          setForm={salary.setForm}
          employees={employees}
          submitting={salary.submitting}
          onSubmit={salary.onSubmit}
        />
      </Panel>

      <Panel title="Thống kê lương" subtitle="Biểu đồ chi phí lương chi nhánh.">
        <div className="h-[400px]">
          <AttendanceStatsChart data={payrollChartData} />
        </div>
      </Panel>
    </ResponsiveGrid>
  );
}
