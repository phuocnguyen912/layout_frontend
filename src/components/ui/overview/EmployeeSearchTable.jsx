import DataTable from '../DataTable';
import EmployeeInfo from '../employees/EmployeeInfo';

export default function EmployeeSearchTable({ rows }) {
  return (
    <DataTable
      columns={[
        {
          key: 'identity',
          label: 'Nhân viên',
          render: (row) => (
            <EmployeeInfo
              name={row.HoTen}
              subtext={row.MaNhanVien}
              avatarSize="lg"
            />
          ),
        },
        { key: 'Email', label: 'Email' },
        { key: 'SDT', label: 'SDT' },
        {
          key: 'branch',
          label: 'Chi nhánh / phòng ban',
          render: (row) => row.TenChiNhanh || row.TenPhongBan || 'Nội bộ node',
        },
      ]}
      rows={rows}
    />
  );
}
