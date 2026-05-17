import DataTable from '../../../components/ui/DataTable';
import StatusPill from '../../../components/ui/StatusPill';

export default function AttendanceHistoryTable({ rows }) {
  const columns = [
    { key: 'date', label: 'Ngày' },
    { key: 'checkInTime', label: 'Giờ vào' },
    {
      key: 'checkOutTime',
      label: 'Giờ ra',
      render: (row) => row.checkOutTime || 'Chưa chấm ra',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => <StatusPill status={row.isIncomplete ? 'INCOMPLETE' : row.status} />,
    },
    {
      key: 'note',
      label: 'Ghi chú',
      render: (row) => (row.isIncomplete ? 'Cần hoàn tất chấm ra.' : row.statusLabel),
    },
  ];

  return <DataTable columns={columns} rows={rows} emptyText="Không có lịch sử chấm công trong bộ lọc này." />;
}
