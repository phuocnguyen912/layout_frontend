import DataTable from '../DataTable';
import Panel from '../Panel';
import EmployeeTable from '../employees/EmployeeTable';
import ResponsiveGrid from '../../layout/ResponsiveGrid';
import { formatCurrency } from '../../../utils/format';

export default function LocalReportTables({
  employees,
  attendance,
  payroll,
  isNode,
  submittingKey,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onReactivateEmployee,
}) {
  return (
    <ResponsiveGrid variant="three" className="mt-6">
      <Panel title="Nhân viên local">
        <EmployeeTable
          rows={employees}
          isNode={isNode}
          canManage
          submittingKey={submittingKey}
          onView={onViewEmployee}
          onEdit={onEditEmployee}
          onDelete={onDeleteEmployee}
          onReactivate={onReactivateEmployee}
        />
      </Panel>
      <Panel title="Tổng hợp chấm công">
        <DataTable
          columns={[
            { key: 'MaNhanVien', label: 'Ma' },
            { key: 'SoNgayChamCong', label: 'So ngay' },
          ]}
          rows={attendance}
        />
      </Panel>
      <Panel title="Tổng hợp lương">
        <DataTable
          columns={[
            { key: 'MaNhanVien', label: 'Ma' },
            {
              key: 'TongLuong',
              label: 'Tong luong',
              render: (row) => formatCurrency(row.TongLuong),
            },
          ]}
          rows={payroll}
        />
      </Panel>
    </ResponsiveGrid>
  );
}
