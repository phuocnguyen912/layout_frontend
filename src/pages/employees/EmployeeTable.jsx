import DataTable from '../../components/ui/DataTable';
import StatusPill from '../../components/ui/StatusPill';
import Button from '../../components/ui/Button';
import { getInitials } from '../../utils/format';
import { resolveEmployeeStatus } from './employeeUtils';

export default function EmployeeTable({
  rows,
  isNode,
  submittingKey,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <DataTable
      columns={[
        {
          key: 'identity',
          label: 'Nhân viên',
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecd7cb] font-semibold text-[#8a3828]">
                {getInitials(row.HoTen)}
              </div>
              <div>
                <p className="font-semibold text-[var(--hr-ink)]">{row.HoTen || 'N/A'}</p>
                <p className="text-xs text-[var(--hr-muted)]">{row.MaNhanVien || 'N/A'}</p>
              </div>
            </div>
          ),
        },
        { key: 'Email', label: 'Email' },
        { key: 'SDT', label: 'SĐT' },
        {
          key: 'branch',
          label: 'Chi nhánh / phòng ban',
          render: (row) => row.TenChiNhanh || row.TenPhongBan || row.MaChiNhanh || 'Nội bộ node',
        },
        {
          key: 'status',
          label: 'Trạng thái',
          render: (row) => <StatusPill status={resolveEmployeeStatus(row)} />,
        },
        {
          key: 'actions',
          label: 'Thao tác',
          render: (row) => (
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" className="px-3 py-2" onClick={() => onView(row)}>
                Xem
              </Button>
              {isNode ? (
                <>
                  <Button type="button" variant="accent" className="px-3 py-2" onClick={() => onEdit(row)}>
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-2"
                    loading={submittingKey === 'delete-employee'}
                    onClick={() => onDelete(row)}
                  >
                    Nghỉ việc
                  </Button>
                </>
              ) : null}
            </div>
          ),
        },
      ]}
      rows={rows}
      emptyText="Không có nhân viên phù hợp bộ lọc."
    />
  );
}

