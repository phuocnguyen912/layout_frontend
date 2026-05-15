import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import BranchDistributionChart from '../components/ui/overview/BranchDistributionChart';
import EmployeeSearchTable from '../components/ui/overview/EmployeeSearchTable';
import TopSalaryChart from '../components/ui/overview/TopSalaryChart';
import SystemSyncOverview from '../components/ui/overview/SystemSyncOverview';

export default function Overview({ isPublisher, publisherData, nodeData, session, filteredCompanyEmployees, branchChartData, payrollChartData }) {
  return (
    <>
      <SectionHeader
        eyebrow="Tổng quan"
        title="Tổng quan hệ thống HRM"
        description="Bộ KPI, biểu đồ và danh sách chính được tổng hợp từ dữ liệu vận hành."
      />

      <ResponsiveGrid variant="overview">
        <Panel title="Phân bổ nhân sự theo chi nhánh" subtitle="Tổng hợp số lượng nhân sự ở từng chi nhánh.">
          <BranchDistributionChart data={branchChartData} />
        </Panel>

        <Panel title="Trạng thái đồng bộ" subtitle="Theo dõi kết nối và lần đồng bộ gần nhất.">
          <SystemSyncOverview
            isPublisher={isPublisher}
            syncItems={isPublisher ? publisherData.sync : []}
            health={nodeData.health}
            mode={session.profile.mode}
          />
        </Panel>
      </ResponsiveGrid>

      <Panel title="Danh sách nhân sự / tìm kiếm" subtitle="Tra cứu nhân sự theo môi trường hiện tại.">
        <EmployeeSearchTable rows={filteredCompanyEmployees} />
      </Panel>

      <TopSalaryChart data={payrollChartData} />
    </>
  );
}
