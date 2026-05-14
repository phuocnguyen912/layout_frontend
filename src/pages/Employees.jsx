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
import EmployeeAddModal from './employees/EmployeeAddModal';
import { buildEditForm, resolveEmployeeKey, resolveEmployeeStatus } from './employees/employeeUtils';
import Button from '../components/ui/Button';
import { UserPlus } from 'lucide-react';
import { SEED_DEPARTMENTS, SEED_POSITIONS } from '../data/employees';

const PAGE_SIZE = 10;

export default function Employees({
  employees,
  searchKeyword,
  isNode,
  nodeApi,
  publisherApi,
  publisherData,
  session,
  runAction,
  submittingKey,
  saveEmpMeta,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] = useState(null);
  const [editForm, setEditForm] = useState(buildEditForm());
  const [editError, setEditError] = useState('');
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const statusOptions = useMemo(() => {
    const statuses = new Set(employees.map((employee) => resolveEmployeeStatus(employee)));
    // Luôn thêm trạng thái Nghỉ việc để cho phép xem nhân viên đã bị cho nghỉ việc
    statuses.add('Nghỉ việc');
    return ['all', ...Array.from(statuses)];
  }, [employees]);

  const { page, setPage, filteredRows, pagedRows, totalPages } = useTableState({
    rows: employees,
    searchKeyword,
    statusFilter,
    resolveStatus: resolveEmployeeStatus,
    pageSize: PAGE_SIZE,
  });

  const availableDepts = useMemo(() => {
    const map = new Map();
    employees.forEach(emp => {
      if (emp.MaPhongBan) map.set(emp.MaPhongBan, emp.TenPhongBan || emp.MaPhongBan);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [employees]);

  const availablePositions = useMemo(() => {
    const map = new Map();
    if (publisherData?.positions) {
      publisherData.positions.forEach(p => map.set(p.MaChucVu, p.TenChucVu));
    }
    employees.forEach(emp => {
      if (emp.MaChucVu) map.set(emp.MaChucVu, emp.TenChucVu || emp.MaChucVu);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [employees, publisherData]);

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
        const dept = SEED_DEPARTMENTS.find(d => d.MaPhongBan === editForm.MaPhongBan);
        const pos = SEED_POSITIONS.find(p => p.MaChucVu === editForm.MaChucVu);
        if (saveEmpMeta) {
          saveEmpMeta(editForm.MaNhanVien, {
            sdt: editForm.SDT,
            email: editForm.Email,
            ngaySinh: editForm.NgaySinh,
            ngayVaoLam: editForm.NgayVaoLam,
            maChiNhanh: editForm.MaChiNhanh || editEmployee.MaChiNhanh,
            tenChiNhanh: (editForm.MaChiNhanh || editEmployee.MaChiNhanh) === 'CNHCM' ? 'Chi nhánh HCM' : 'Chi nhánh Hà Nội',
            tenPhongBan: dept?.TenPhongBan || editForm.MaPhongBan,
            tenChucVu: pos?.TenChucVu || editForm.MaChucVu,
            maPhongBan: editForm.MaPhongBan,
            maChucVu: editForm.MaChucVu,
          });
        }
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

  const handleReactivateEmployee = (employee) => {
    if (!isNode || !nodeApi) return;
    runAction(
      'reactivate-employee',
      () => nodeApi.reactivateEmployee(resolveEmployeeKey(employee)),
      () => {
        setToast({ type: 'success', message: `Đã kích hoạt lại nhân viên ${employee.HoTen}.` });
      },
    );
  };

  const handleCreateEmployee = (formData) => {
    const api = isNode ? nodeApi : publisherApi;
    if (!api) return;

    runAction(
      'create-employee',
      () => api.createEmployee(formData),
      () => {
        const dept = SEED_DEPARTMENTS.find(d => d.MaPhongBan === formData.maPhongBan);
        const pos = SEED_POSITIONS.find(p => p.MaChucVu === formData.maChucVu);
        if (saveEmpMeta) {
          saveEmpMeta(formData.maNhanVien, {
            sdt: formData.sdt,
            email: formData.email,
            ngaySinh: formData.ngaySinh,
            ngayVaoLam: formData.ngayVaoLam,
            maChiNhanh: formData.maChiNhanh,
            tenChiNhanh: formData.maChiNhanh === 'CNHCM' ? 'Chi nhánh HCM' : 'Chi nhánh Hà Nội',
            tenPhongBan: dept?.TenPhongBan || formData.maPhongBan,
            tenChucVu: pos?.TenChucVu || formData.maChucVu,
            maPhongBan: formData.maPhongBan,
            maChucVu: formData.maChucVu,
          });
        }
        setIsAddModalOpen(false);
        setToast({ type: 'success', message: 'Thêm nhân viên thành công.' });
      },
    );
  };

  const branchCode = session?.profileKey === 'node_hcm' ? 'CNHCM' : session?.profileKey === 'node_hn' ? 'CNHN' : '';

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
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="accent" onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Thêm nhân viên
            </Button>
            <div className="min-w-[200px]">
              <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tất cả trạng thái' : status}
                  </option>
                ))}
              </Select>
            </div>
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
          onReactivate={handleReactivateEmployee}
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

      <EmployeeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEmployee}
        submittingKey={submittingKey}
        isNode={isNode}
        initialMaChiNhanh={branchCode}
        branches={publisherData?.branches || []}
        existingIds={employees.map(r => r.MaNhanVien)}
        departments={availableDepts}
        positions={availablePositions}
      />
    </>
  );
}
