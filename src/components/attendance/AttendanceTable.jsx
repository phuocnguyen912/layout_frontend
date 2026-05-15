import DataTable from '../ui/DataTable';
import Panel from '../ui/Panel';
import StatusPill from '../ui/StatusPill';

export default function AttendanceTable({ rows }) {
  return (
    <Panel title="Bang tong hop cham cong" subtitle="Du lieu duoc tong hop theo ky loc hien tai.">
      <DataTable
        columns={[
          { key: 'MaNhanVien', label: 'Ma NV' },
          { key: 'HoTen', label: 'Ho ten' },
          { key: 'SoNgayChamCong', label: 'So ngay cong' },
          { key: 'SoDonNghi', label: 'Don nghi' },
          { key: 'TrangThaiLabel', label: 'Trang thai', render: (row) => <StatusPill status={row.TrangThaiLabel} /> },
        ]}
        rows={rows}
        emptyText="Chua co du lieu cham cong cho bo loc nay"
      />
    </Panel>
  );
}
