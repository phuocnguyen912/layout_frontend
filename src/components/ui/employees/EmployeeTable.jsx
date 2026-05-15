import DataTable from '../DataTable';
import StatusPill from '../StatusPill';
import Avatar from './Avatar';
import EmployeeInfo from './EmployeeInfo';
import { getInitials } from '../../../utils/format';
import { resolveEmployeeStatus } from './employeeUtils';
import { Eye, Pencil, UserX, UserCheck } from 'lucide-react';

function IconBtn({ icon: Icon, title, onClick, colorClass, loading = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={loading}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border transition
        disabled:cursor-not-allowed disabled:opacity-50 ${colorClass}`}
    >
      {loading
        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        : <Icon className="h-4 w-4" />}
    </button>
  );
}

export default function EmployeeTable({
  rows,
  isNode,
  canManage,
  submittingKey,
  onView,
  onEdit,
  onDelete,
  onReactivate,
}) {
  const showManageActions = canManage ?? isNode;

  return (
    <DataTable
      columns={[
        {
          key: 'identity',
          label: 'Nhân viên',
          render: (row) => (
            <EmployeeInfo 
              name={row.HoTen} 
              subtext={`${row.MaNhanVien}${row.TenChucVu ? ` • ${row.TenChucVu}` : ''}`} 
            />
          ),
        },
        { key: 'Email', label: 'Email' },
        { key: 'SDT', label: 'SĐT' },
        {
          key: 'branch',
          label: 'Chi nhánh / phòng ban',
          render: (row) => row.TenChiNhanh || row.TenPhongBan || row.MaChiNhanh || 'Nội bộ Chi nhánh',
        },
        {
          key: 'status',
          label: 'Trạng thái',
          render: (row) => <StatusPill status={resolveEmployeeStatus(row)} />,
        },
        {
          key: 'actions',
          label: '',
          render: (row) => {
            const isResigned = resolveEmployeeStatus(row) === 'Nghỉ việc';
            return (
              <div className="flex items-center justify-end gap-1.5">
                <IconBtn
                  icon={Eye}
                  title="Xem chi tiết"
                  onClick={() => onView(row)}
                  colorClass="border-[#ddd0c4] bg-white text-[#7a6a60] hover:bg-[#f6ede2] hover:text-[#3f342d]"
                />
                {showManageActions && (
                  <>
                    <IconBtn
                      icon={Pencil}
                      title="Sửa thông tin"
                      onClick={() => onEdit(row)}
                      colorClass="border-[#c47a5a] bg-[#b55233] text-white hover:bg-[#964228]"
                    />
                    {isResigned ? (
                      <IconBtn
                        icon={UserCheck}
                        title="Kích hoạt lại"
                        onClick={() => onReactivate(row)}
                        loading={submittingKey === 'reactivate-employee'}
                        colorClass="border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
                      />
                    ) : (
                      <IconBtn
                        icon={UserX}
                        title="Cho nghỉ việc"
                        onClick={() => onDelete(row)}
                        loading={submittingKey === 'delete-employee'}
                        colorClass="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      />
                    )}
                  </>
                )}
              </div>
            );
          },
        },
      ]}
      rows={rows}
      emptyText="Không có nhân viên phù hợp bộ lọc."
    />
  );
}

