import { useEffect, useMemo, useState } from 'react';
import { UserPlus, FileText, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import { getInitials, formatCurrency } from '../utils/format';
import EmployeeAddModal from './employees/EmployeeAddModal';
import { SEED_DEPARTMENTS, SEED_POSITIONS } from '../data/employees';

const defaultContractForm = {
  maHopDong: '',
  maNhanVien: '',
  maLoaiHopDong: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'Hieu luc',
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
<<<<<<< HEAD
  saveEmpMeta,
=======
  publisherData,
  reportFilters,
  setReportFilters,
>>>>>>> master
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contractForm, setContractForm] = useState(defaultContractForm);
<<<<<<< HEAD
  const [reportFilters, setReportFilters] = useState(defaultReportFilters);
  const [contractFormError, setContractFormError] = useState('');
  const branchCode = NODE_BRANCH_CODES[session?.profileKey] || '';

  const availableDepts = useMemo(() => {
    const map = new Map();
    localEmployees.forEach(emp => {
      if (emp.MaPhongBan) map.set(emp.MaPhongBan, emp.TenPhongBan || emp.MaPhongBan);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [localEmployees]);
=======
  const [employeeFormError, setEmployeeFormError] = useState('');
  const [contractFormError, setContractFormError] = useState('');
  const branchCode = NODE_BRANCH_CODES[session?.profileKey] || '';

  // Logic lọc dữ liệu Chấm công và Lương theo từ khóa (Xử lý lỗi K25)
  const filteredAttendance = (nodeData.report.attendance || []).filter((att) =>
    localEmployees.some((emp) => emp.MaNhanVien === att.MaNhanVien)
  );
  const filteredPayroll = (nodeData.report.payroll || []).filter((pay) =>
    localEmployees.some((emp) => emp.MaNhanVien === pay.MaNhanVien)
  );

  useEffect(() => {
    if (!branchCode) return;
    setEmployeeForm((previous) =>
      previous.maChiNhanh === branchCode ? previous : { ...previous, maChiNhanh: branchCode },
    );
  }, [branchCode]);
>>>>>>> master

  const availablePositions = useMemo(() => {
    const map = new Map();
    localEmployees.forEach(emp => {
      if (emp.MaChucVu) map.set(emp.MaChucVu, emp.TenChucVu || emp.MaChucVu);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [localEmployees]);

  function validateContractForm(form) {
    if (!form.maHopDong?.trim()) return 'Mã hợp đồng không được để trống.';
    if (form.maHopDong.trim().length > 10) return 'Mã hợp đồng tối đa 10 ký tự.';
    if (!form.maNhanVien?.trim()) return 'Mã nhân viên không được để trống.';
    if (form.maNhanVien.trim().length > 10) return 'Mã nhân viên tối đa 10 ký tự.';
    if (!form.maLoaiHopDong?.trim()) return 'Mã loại hợp đồng không được để trống.';
    if (form.maLoaiHopDong.trim().length > 10) return 'Mã loại hợp đồng tối đa 10 ký tự.';
    return '';
  }

  return (
    <>
      <SectionHeader
        eyebrow="Chi nhánh"
        title="Nhân viên, hợp đồng, báo cáo local"
        description="Module này tập trung vào các endpoint node cho HR manager và node admin."
      />

      {!isNode ? (
<<<<<<< HEAD
        <Panel title="Không dùng profile node" subtitle="Trang này cần đăng nhập profile chi nhánh HCM hoặc Hà Nội.">
=======
        <Panel title="Không dùng profile node">
>>>>>>> master
          <p className="text-sm text-[var(--hr-muted)]">
            Chuyển qua môi trường chi nhánh để tạo nhân viên, hợp đồng và xem báo cáo local.
          </p>
        </Panel>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
<<<<<<< HEAD
            <Panel title="Quản lý nhân viên" subtitle="Thao tác với hồ sơ nhân sự local.">
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ecd7cb] text-[#8a3828]">
                  <UserPlus className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-semibold text-[var(--hr-ink)]">Thêm nhân viên mới</h4>
                <p className="mt-2 mb-6 max-w-xs text-sm text-[var(--hr-muted)]">
                  Khởi tạo hồ sơ nhân sự mới cho chi nhánh {branchCode}. Dữ liệu sẽ được lưu tại Node local trước khi đồng bộ.
                </p>
=======
            <Panel title="Tạo nhân viên" >
              {employeeFormError && (
                <div className="mb-2 rounded-xl bg-[#f3d9d2] px-3 py-2 text-sm text-[#8a3828]">
                  {employeeFormError}
                </div>
              )}
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formWithBranch = { ...employeeForm, maChiNhanh: branchCode || employeeForm.maChiNhanh };
                  const err = validateEmployeeForm(formWithBranch);
                  if (err) { setEmployeeFormError(err); return; }
                  setEmployeeFormError('');
                  runAction('create-employee', () => nodeApi.createEmployee(formWithBranch), () =>
                    setEmployeeForm({ ...defaultEmployeeForm, maChiNhanh: branchCode }),
                  );
                }}
              >
                <Field label="Mã nhân viên">
                  <Input
                    value={employeeForm.maNhanVien}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maNhanVien: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Họ tên">
                  <Input
                    value={employeeForm.hoTen}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, hoTen: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ngày sinh">
                  <Input
                    type="date"
                    value={employeeForm.ngaySinh}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, ngaySinh: event.target.value })}
                  />
                </Field>
                <Field label="Giới tính">
                  <Select
                    value={employeeForm.gioiTinh}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, gioiTinh: event.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </Select>
                </Field>
                <Field label="SĐT">
                  <Input
                    value={employeeForm.sdt}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, sdt: event.target.value })}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    value={employeeForm.email}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, email: event.target.value })}
                  />
                </Field>
                <Field label="Mã phòng ban">
                  <Select
                    value={employeeForm.maPhongBan}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maPhongBan: event.target.value })}
                    required
                  >
                    <option value="">-- Chọn phòng ban ({nodeData?.departments?.length||0}) --</option>
                    {nodeData?.departments?.map(d => (
                      <option key={d.MaPhongBan || d.maPhongBan} value={d.MaPhongBan || d.maPhongBan}>{d.TenPhongBan || d.tenPhongBan}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Mã chức vụ">
                  <Select
                    value={employeeForm.maChucVu}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maChucVu: event.target.value })}
                    required
                  >
                    <option value="">-- Chọn chức vụ ({nodeData?.positions?.length||0}) --</option>
                    {nodeData?.positions?.map(p => (
                      <option key={p.MaChucVu || p.maChucVu} value={p.MaChucVu || p.maChucVu}>{p.TenChucVu || p.tenChucVu}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Ngày vào làm">
                  <Input
                    type="date"
                    value={employeeForm.ngayVaoLam}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, ngayVaoLam: event.target.value })}
                  />
                </Field>
                <Field label="Mã chi nhánh">
                  <Select
                    value={employeeForm.maChiNhanh}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maChiNhanh: event.target.value })}
                    disabled={Boolean(branchCode)}
                    required
                  >
                    <option value="">-- Chọn chi nhánh --</option>
                    {nodeData?.branches?.map(b => (
                      <option key={b.MaChiNhanh || b.maChiNhanh} value={b.MaChiNhanh || b.maChiNhanh}>{b.TenChiNhanh || b.tenChiNhanh}</option>
                    ))}
                  </Select>
                </Field>
>>>>>>> master
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <UserPlus className="h-4 w-4" />
<<<<<<< HEAD
                  Mở form thêm nhân viên
=======
                  Tạo nhân viên
>>>>>>> master
                </Button>
              </div>
            </Panel>

<<<<<<< HEAD
            <Panel title="Tạo hợp đồng" subtitle="POST `/node/contracts`">
=======
            <Panel title="Tạo hợp đồng">
>>>>>>> master
              {contractFormError && (
                <div className="mb-2 rounded-xl bg-[#f3d9d2] px-3 py-2 text-sm text-[#8a3828]">
                  {contractFormError}
                </div>
              )}
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const err = validateContractForm(contractForm);
                  if (err) { setContractFormError(err); return; }
                  setContractFormError('');
                  runAction('create-contract', () => nodeApi.createContract(contractForm), () =>
                    setContractForm(defaultContractForm),
                  );
                }}
              >
                <Field label="Mã hợp đồng">
                  <Input
                    value={contractForm.maHopDong}
                    onChange={(event) => setContractForm({ ...contractForm, maHopDong: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Mã nhân viên">
                  <Select
                    value={contractForm.maNhanVien}
                    onChange={(event) => setContractForm({ ...contractForm, maNhanVien: event.target.value })}
                    required
                  >
                    <option value="">-- Chọn nhân viên ({localEmployees?.length || 0}) --</option>
                    {localEmployees?.map(e => (
                      <option key={e.MaNhanVien} value={e.MaNhanVien}>{e.MaNhanVien} — {e.HoTen}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Mã loại hợp đồng">
                  <Select
                    value={contractForm.maLoaiHopDong}
                    onChange={(event) => setContractForm({ ...contractForm, maLoaiHopDong: event.target.value })}
                    required
                  >
                    <option value="">-- Chọn loại hợp đồng ({nodeData?.contractTypes?.length || 0}) --</option>
                    {nodeData?.contractTypes?.map(ct => (
                      <option key={ct.MaLoaiHopDong || ct.maLoaiHopDong} value={ct.MaLoaiHopDong || ct.maLoaiHopDong}>{ct.TenLoaiHopDong || ct.tenLoaiHopDong}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Trạng thái">
                  <Input
                    value={contractForm.trangThai}
                    onChange={(event) => setContractForm({ ...contractForm, trangThai: event.target.value })}
                  />
                </Field>
                <Field label="Ngày bắt đầu">
                  <Input
                    type="date"
                    value={contractForm.ngayBatDau}
                    onChange={(event) => setContractForm({ ...contractForm, ngayBatDau: event.target.value })}
                  />
                </Field>
                <Field label="Ngày kết thúc">
                  <Input
                    type="date"
                    value={contractForm.ngayKetThuc}
                    onChange={(event) => setContractForm({ ...contractForm, ngayKetThuc: event.target.value })}
                  />
                </Field>
                <Button
                  type="submit"
                  variant="accent"
                  loading={submittingKey === 'create-contract'}
                  className="md:col-span-2"
                >
                  <FileText className="h-4 w-4" />
                  Tạo hợp đồng
                </Button>
              </form>
            </Panel>
          </div>

          <Panel
            title="Bộ lọc báo cáo local"
<<<<<<< HEAD
            subtitle="GET `/node/reports/local`"
=======
>>>>>>> master
            action={
              <Button
                variant="secondary"
                loading={submittingKey === 'filter-report'}
                onClick={() => setReportFilters({ ...reportFilters })}
              >
                <RefreshCw className="h-4 w-4" />
                Nạp báo cáo
              </Button>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Từ khóa">
                <Input
                  value={reportFilters.keyword}
                  onChange={(event) => setReportFilters({ ...reportFilters, keyword: event.target.value })}
                />
              </Field>
              <Field label="Tháng">
                <Input
                  type="number"
                  value={reportFilters.thang}
                  onChange={(event) => setReportFilters({ ...reportFilters, thang: Number(event.target.value) })}
                />
              </Field>
              <Field label="Năm">
                <Input
                  type="number"
                  value={reportFilters.nam}
                  onChange={(event) => setReportFilters({ ...reportFilters, nam: Number(event.target.value) })}
                />
              </Field>
            </div>
          </Panel>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Nhân viên local">
              <DataTable
                columns={[
                  { key: 'MaNhanVien', label: 'Mã NV' },
                  {
                    key: 'HoTen',
                    label: 'Họ tên',
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ecd7cb] text-xs font-semibold text-[#8a3828]">
                          {getInitials(row.HoTen)}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--hr-ink)]">{row.HoTen}</p>
                          <p className="text-xs text-[var(--hr-muted)]">{row.TenChucVu || 'N/A'}</p>
                        </div>
                      </div>
                    ),
                  },
<<<<<<< HEAD
                  { key: 'TenPhongBan', label: 'Phong ban' },
                  { key: 'TenChucVu', label: 'Chuc vu' },
=======
                  { key: 'TenPhongBan', label: 'Phòng ban' },
>>>>>>> master
                  { key: 'Email', label: 'Email' },
                ]}
                rows={localEmployees}
              />
            </Panel>
            <Panel title="Tổng hợp chấm công">
              <DataTable
                columns={[
                  { key: 'MaNhanVien', label: 'Mã' },
                  { key: 'SoNgayChamCong', label: 'Số ngày' },
                ]}
                rows={filteredAttendance}
              />
            </Panel>
            <Panel title="Tổng hợp lương">
              <DataTable
                columns={[
                  { key: 'MaNhanVien', label: 'Mã' },
                  {
                    key: 'TongLuong',
                    label: 'Tổng lương',
                    render: (row) => formatCurrency(row.TongLuong),
                  },
                ]}
                rows={filteredPayroll}
              />
            </Panel>
          </div>
        </>
      )}

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
    </>
  );
}
