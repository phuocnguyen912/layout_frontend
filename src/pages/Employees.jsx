import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Select from '../components/ui/Select';
import Toast from '../components/ui/Toast';
import useTableState from '../hooks/useTableState';
import EmployeeTable from './employees/EmployeeTable';
import EmployeeDetailModal from './employees/EmployeeDetailModal';
import EmployeeEditModal from './employees/EmployeeEditModal';
import EmployeeDeleteConfirmModal from './employees/EmployeeDeleteConfirmModal';
import { buildEditForm, resolveEmployeeKey, resolveEmployeeStatus } from './employees/employeeUtils';

const PAGE_SIZE = 10;

export default function Employees({ employees, searchKeyword, isNode, nodeApi, runAction, submittingKey }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] = useState(null);
  const [editForm, setEditForm] = useState(buildEditForm());
  const [editError, setEditError] = useState('');
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const statusOptions = useMemo(() => {
    const statuses = new Set(employees.map((employee) => resolveEmployeeStatus(employee)));
    return ['all', ...Array.from(statuses)];
  }, [employees]);

  const { page, setPage, filteredRows, pagedRows, totalPages } = useTableState({
    rows: employees,
    searchKeyword,
    statusFilter,
    resolveStatus: resolveEmployeeStatus,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (!toast.message) return;
    const timeout = setTimeout(() => setToast({ type: 'success', message: '' }), 2500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setEditForm(buildEditForm(employee));
    setEditError('');
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    if (!editEmployee || !isNode || !nodeApi) return;
    if (!editForm.HoTen.trim()) {
      setEditError('Họ tên không được để trống.');
      return;
    }
    if (!editForm.MaNhanVien.trim()) {
      setEditError('Mã nhân viên không được để trống.');
      return;
    }

    if (!editForm.MaPhongBan.trim()) {
      setEditError('Mã phòng ban không được để trống.');
      return;
    }

    if (!editForm.MaChucVu.trim()) {
      setEditError('Mã chức vụ không được để trống.');
      return;
    }

    runAction(
      'update-employee',
      () =>
        nodeApi.updateEmployee(resolveEmployeeKey(editEmployee), {
          hoTen: editForm.HoTen.trim(),
          email: editForm.Email.trim() || undefined,
          sdt: editForm.SDT.trim() || undefined,
          maPhongBan: editForm.MaPhongBan.trim(),
          maChucVu: editForm.MaChucVu.trim(),
        }),
      () => {
        setEditEmployee(null);
        setEditError('');
        setToast({ type: 'success', message: 'Cập nhật nhân viên thành công.' });
      },
    );
  };

  const handleDeleteEmployee = () => {
    if (!isNode || !nodeApi || !deleteEmployeeTarget) return;
    runAction(
      'delete-employee',
      () => nodeApi.deleteEmployee(resolveEmployeeKey(deleteEmployeeTarget)),
      () => {
        setToast({ type: 'success', message: 'Đã chuyển nhân viên sang trạng thái nghỉ việc.' });
        setDeleteEmployeeTarget(null);
      },
    );
  };

  return (
    <>
      <SectionHeader
        eyebrow="Employees"
        title="Danh sách nhân viên"
        description="Quản lý danh sách nhân viên theo từ khóa tìm kiếm, trạng thái và phân trang."
      />
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: 'success', message: '' })} />

      <Panel
        title="Danh sách nhân sự"
        subtitle={`Tổng ${filteredRows.length} nhân viên sau khi lọc.`}
        action={(
          <div className="min-w-[220px]">
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Tất cả trạng thái' : status}
                </option>
              ))}
            </Select>
          </div>
        )}
      >
        <EmployeeTable
          rows={pagedRows}
          isNode={isNode}
          submittingKey={submittingKey}
          onView={(employee) => setViewEmployee(employee)}
          onEdit={(employee) => openEditModal(employee)}
          onDelete={(employee) => setDeleteEmployeeTarget(employee)}
        />

        <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--hr-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Trang {page}/{totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[#decebd] px-3 py-2 text-[var(--hr-ink)] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={page <= 1}
            >
              Trước
            </button>
            <button
              type="button"
              className="rounded-xl border border-[#decebd] px-3 py-2 text-[var(--hr-ink)] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
              disabled={page >= totalPages}
            >
              Sau
            </button>
          </div>
        </div>
      </Panel>

      <EmployeeDetailModal employee={viewEmployee} onClose={() => setViewEmployee(null)} />
      <EmployeeEditModal
        employee={editEmployee}
        editForm={editForm}
        editError={editError}
        submittingKey={submittingKey}
        onClose={() => setEditEmployee(null)}
        onChange={(patch) => setEditForm((previous) => ({ ...previous, ...patch }))}
        onSubmit={handleSaveEdit}
      />
      <EmployeeDeleteConfirmModal
        employee={deleteEmployeeTarget}
        submittingKey={submittingKey}
        onCancel={() => setDeleteEmployeeTarget(null)}
        onConfirm={handleDeleteEmployee}
      />
    </>
  );
}
