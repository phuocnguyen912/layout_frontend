import DataTable from '../../../components/ui/DataTable';
import StatusPill from '../../../components/ui/StatusPill';

export default function AttendanceHistoryTable({ rows }) {
  const columns = [
    { key: 'date', label: 'Ngay' },
    { key: 'checkInTime', label: 'Gio vao' },
    {
      key: 'checkOutTime',
      label: 'Gio ra',
      render: (row) => row.checkOutTime || 'Chua check-out',
    },
    {
      key: 'status',
      label: 'Trang thai',
      render: (row) => <StatusPill status={row.isIncomplete ? 'INCOMPLETE' : row.status} />,
    },
    {
      key: 'note',
      label: 'Ghi chu',
      render: (row) => (row.isIncomplete ? 'Can hoan tat check-out.' : row.statusLabel),
    },
  ];

  return <DataTable columns={columns} rows={rows} emptyText="Khong co lich su cham cong trong bo loc nay." />;
}
