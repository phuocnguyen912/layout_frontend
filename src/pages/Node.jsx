import { useMemo, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import PermissionGuard from '../components/layout/PermissionGuard';
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import EmployeeAddModal from '../components/ui/employees/EmployeeAddModal';
import EmployeeDetailModal from '../components/ui/employees/EmployeeDetailModal';
import EmployeeEditModal from '../components/ui/employees/EmployeeEditModal';
import EmployeeDeleteConfirmModal from '../components/ui/employees/EmployeeDeleteConfirmModal';
import { buildEditForm, resolveEmployeeKey } from '../components/ui/employees/employeeUtils';
import ContractFormPanel from '../components/ui/node/ContractFormPanel';
import LocalReportFilters from '../components/ui/node/LocalReportFilters';
import EmployeeOnboardingPanel from '../components/ui/node/EmployeeOnboardingPanel';
import LocalReportTables from '../components/ui/node/LocalReportTables';
import { SEED_DEPARTMENTS, SEED_POSITIONS } from '../data/employees';

const defaultContractForm = {
  maHopDong: '',
  maNhanVien: '',
  maLoaiHopDong: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'Hieu luc',
};

const defaultReportFilters = {
  keyword: '',
  thang: new Date().getMonth() + 1,
  nam: new Date().getFullYear(),
};

const NODE_BRANCH_CODES = {
  node_hcm: 'CNHCM',
  node_hn: 'CNHN',
};

export default function Node({
  isNode,
  nodeApi,
  nodeData,
  setNodeData,
  localEmployees,
  runAction,
  submittingKey,
  session,
  saveEmpMeta,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] = useState(null);
  const [editForm, setEditForm] = useState(buildEditForm());
  const [editError, setEditError] = useState('');
  const [contractForm, setContractForm] = useState(defaultContractForm);
  const [reportFilters, setReportFilters] = useState(defaultReportFilters);
  const branchCode = NODE_BRANCH_CODES[session?.profileKey] || '';

  const availableDepts = useMemo(() => {
    const map = new Map();
    localEmployees.forEach(emp => {
      if (emp.MaPhongBan) map.set(emp.MaPhongBan, emp.TenPhongBan || emp.MaPhongBan);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [localEmployees]);

  const availablePositions = useMemo(() => {
    const map = new Map();
    localEmployees.forEach(emp => {
      if (emp.MaChucVu) map.set(emp.MaChucVu, emp.TenChucVu || emp.MaChucVu);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [localEmployees]);

  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setEditForm({ ...buildEditForm(employee), MaChiNhanh: employee.MaChiNhanh || branchCode });
    setEditError('');
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    if (!editEmployee || !nodeApi?.updateEmployee) return;

    if (!editForm.HoTen.trim()) {
      setEditError('Họ tên không được để trống.');
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
      () => nodeApi.updateEmployee(resolveEmployeeKey(editEmployee), {
        hoTen: editForm.HoTen.trim(),
        email: editForm.Email.trim() || undefined,
        sdt: editForm.SDT.trim() || undefined,
        maPhongBan: editForm.MaPhongBan.trim(),
        maChucVu: editForm.MaChucVu.trim(),
        maChiNhanh: editForm.MaChiNhanh || branchCode,
        trangThai: editForm.TrangThai,
        ngaySinh: editForm.NgaySinh || undefined,
        ngayVaoLam: editForm.NgayVaoLam || undefined,
        gioiTinh: editForm.GioiTinh || editEmployee.GioiTinh || 'Nam',
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
            maChiNhanh: editForm.MaChiNhanh || branchCode,
            tenChiNhanh: (editForm.MaChiNhanh || branchCode) === 'CNHCM' ? 'Chi nhánh HCM' : 'Chi nhánh Hà Nội',
            tenPhongBan: dept?.TenPhongBan || editForm.MaPhongBan,
            tenChucVu: pos?.TenChucVu || editForm.MaChucVu,
            maPhongBan: editForm.MaPhongBan,
            maChucVu: editForm.MaChucVu,
          });
        }
        setEditEmployee(null);
        setEditError('');
      },
    );
  };

  const handleDeleteEmployee = () => {
    if (!deleteEmployeeTarget || !nodeApi?.deleteEmployee) return;

    runAction(
      'delete-employee',
      () => nodeApi.deleteEmployee(resolveEmployeeKey(deleteEmployeeTarget)),
      () => setDeleteEmployeeTarget(null),
    );
  };

  const handleReactivateEmployee = (employee) => {
    if (!nodeApi?.reactivateEmployee) return;

    runAction(
      'reactivate-employee',
      () => nodeApi.reactivateEmployee(resolveEmployeeKey(employee)),
    );
  };

  return (
    <>
      <SectionHeader
        eyebrow="Chi nhánh"
        title="Nhân viên, hợp đồng, báo cáo local"
        description="Module này tập trung vào các endpoint node cho HR manager và node admin."
      />

      <PermissionGuard 
        hasPermission={isNode} 
        title="Không dùng profile node" 
        subtitle="Trang này cần đăng nhập profile chi nhánh HCM hoặc Hà Nội."
        description="Chuyển qua môi trường chi nhánh để tạo nhân viên, hợp đồng và xem báo cáo local."
      >
        <ResponsiveGrid>
          <Panel title="Quản lý nhân viên" subtitle="Thao tác với hồ sơ nhân sự local.">
            <EmployeeOnboardingPanel onAdd={() => setIsAddModalOpen(true)} />
          </Panel>

          <ContractFormPanel 
            form={contractForm}
            setForm={setContractForm}
            submitting={submittingKey === 'create-contract'}
            onSubmit={() => runAction('create-contract', () => nodeApi.createContract(contractForm), () => setContractForm(defaultContractForm))}
          />
        </ResponsiveGrid>

        <LocalReportFilters 
          filters={reportFilters}
          setFilters={setReportFilters}
          submitting={submittingKey === 'filter-report'}
          onRefresh={() =>
            runAction('filter-report', () => nodeApi.localReport(reportFilters), (result) =>
              setNodeData((previous) => ({ ...previous, report: result })),
            )
          }
        />

        <LocalReportTables
          employees={localEmployees}
          attendance={nodeData.report.attendance || []}
          payroll={nodeData.report.payroll || []}
          isNode={isNode}
          submittingKey={submittingKey}
          onViewEmployee={(employee) => setViewEmployee(employee)}
          onEditEmployee={openEditModal}
          onDeleteEmployee={(employee) => setDeleteEmployeeTarget(employee)}
          onReactivateEmployee={handleReactivateEmployee}
        />
      </PermissionGuard>

      <EmployeeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(formData) => {
          runAction('create-employee', () => nodeApi.createEmployee(formData), () => {
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
          });
        }}
        submittingKey={submittingKey}
        isNode={true}
        initialMaChiNhanh={branchCode}
        existingIds={localEmployees.map(r => r.MaNhanVien)}
        departments={availableDepts}
        positions={availablePositions}
      />
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
