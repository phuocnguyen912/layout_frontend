import { useEffect, useState } from 'react';
import { UserPlus, FileText, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import { getInitials, formatCurrency } from '../utils/format';

const defaultEmployeeForm = {
  maNhanVien: '',
  hoTen: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
  sdt: '',
  email: '',
  maPhongBan: '',
  maChucVu: '',
  ngayVaoLam: '',
  maChiNhanh: '',
};

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
}) {
  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm);
  const [contractForm, setContractForm] = useState(defaultContractForm);
  const [reportFilters, setReportFilters] = useState(defaultReportFilters);
  const [employeeFormError, setEmployeeFormError] = useState('');
  const [contractFormError, setContractFormError] = useState('');
  const branchCode = NODE_BRANCH_CODES[session?.profileKey] || '';

  useEffect(() => {
    if (!branchCode) return;
    setEmployeeForm((previous) =>
      previous.maChiNhanh === branchCode ? previous : { ...previous, maChiNhanh: branchCode },
    );
  }, [branchCode]);

  function validateEmployeeForm(form) {
    if (!form.maNhanVien?.trim()) return 'Mã nhân viên không được để trống.';
    if (form.maNhanVien.trim().length > 10) return 'Mã nhân viên tối đa 10 ký tự.';
    if (!form.hoTen?.trim()) return 'Họ tên không được để trống.';
    if (!form.maPhongBan?.trim()) return 'Mã phòng ban không được để trống.';
    if (form.maPhongBan.trim().length > 10) return 'Mã phòng ban tối đa 10 ký tự.';
    if (/\s/.test(form.maPhongBan.trim())) return 'Mã phòng ban không được chứa khoảng trắng.';
    if (!form.maChucVu?.trim()) return 'Mã chức vụ không được để trống.';
    if (form.maChucVu.trim().length > 10) return 'Mã chức vụ tối đa 10 ký tự.';
    if (/\s/.test(form.maChucVu.trim())) return 'Mã chức vụ không được chứa khoảng trắng.';
    if (!form.maChiNhanh?.trim()) return 'Mã chi nhánh không xác định. Vui lòng đăng nhập lại.';
    return '';
  }

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
        <Panel title="Không dùng profile node" subtitle="Trang này cần đăng nhập profile chi nhánh HCM hoặc Hà Nội.">
          <p className="text-sm text-[var(--hr-muted)]">
            Chuyển qua môi trường chi nhánh để tạo nhân viên, hợp đồng và xem báo cáo local.
          </p>
        </Panel>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Tạo nhân viên" subtitle="POST `/node/employees`">
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
                <Field label="Ma nhan vien">
                  <Input
                    value={employeeForm.maNhanVien}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maNhanVien: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ho ten">
                  <Input
                    value={employeeForm.hoTen}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, hoTen: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ngay sinh">
                  <Input
                    type="date"
                    value={employeeForm.ngaySinh}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, ngaySinh: event.target.value })}
                  />
                </Field>
                <Field label="Gioi tinh">
                  <Select
                    value={employeeForm.gioiTinh}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, gioiTinh: event.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nu</option>
                    <option value="Khac">Khac</option>
                  </Select>
                </Field>
                <Field label="SDT">
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
                <Field label="Ma phong ban">
                  <Input
                    value={employeeForm.maPhongBan}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maPhongBan: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ma chuc vu">
                  <Input
                    value={employeeForm.maChucVu}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maChucVu: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ngay vao lam">
                  <Input
                    type="date"
                    value={employeeForm.ngayVaoLam}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, ngayVaoLam: event.target.value })}
                  />
                </Field>
                <Field label="Ma chi nhanh">
                  <Input
                    value={employeeForm.maChiNhanh}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, maChiNhanh: event.target.value })}
                    readOnly={Boolean(branchCode)}
                    required
                  />
                </Field>
                <Button
                  type="submit"
                  variant="accent"
                  loading={submittingKey === 'create-employee'}
                  className="md:col-span-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Tao nhan vien
                </Button>
              </form>
            </Panel>

            <Panel title="Tạo hợp đồng" subtitle="POST `/node/contracts`">
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
                <Field label="Ma hop dong">
                  <Input
                    value={contractForm.maHopDong}
                    onChange={(event) => setContractForm({ ...contractForm, maHopDong: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ma nhan vien">
                  <Input
                    value={contractForm.maNhanVien}
                    onChange={(event) => setContractForm({ ...contractForm, maNhanVien: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Ma loai hop dong">
                  <Input
                    value={contractForm.maLoaiHopDong}
                    onChange={(event) => setContractForm({ ...contractForm, maLoaiHopDong: event.target.value })}
                    required
                  />
                </Field>
                <Field label="Trang thai">
                  <Input
                    value={contractForm.trangThai}
                    onChange={(event) => setContractForm({ ...contractForm, trangThai: event.target.value })}
                  />
                </Field>
                <Field label="Ngay bat dau">
                  <Input
                    type="date"
                    value={contractForm.ngayBatDau}
                    onChange={(event) => setContractForm({ ...contractForm, ngayBatDau: event.target.value })}
                  />
                </Field>
                <Field label="Ngay ket thuc">
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
                  Tao hop dong
                </Button>
              </form>
            </Panel>
          </div>

          <Panel
            title="Bộ lọc báo cáo local"
            subtitle="GET `/node/reports/local`"
            action={
              <Button
                variant="secondary"
                loading={submittingKey === 'filter-report'}
                onClick={() =>
                  runAction('filter-report', () => nodeApi.localReport(reportFilters), (result) =>
                    setNodeData((previous) => ({ ...previous, report: result })),
                  )
                }
              >
                <RefreshCw className="h-4 w-4" />
                Nạp báo cáo
              </Button>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Tu khoa">
                <Input
                  value={reportFilters.keyword}
                  onChange={(event) => setReportFilters({ ...reportFilters, keyword: event.target.value })}
                />
              </Field>
              <Field label="Thang">
                <Input
                  type="number"
                  value={reportFilters.thang}
                  onChange={(event) => setReportFilters({ ...reportFilters, thang: Number(event.target.value) })}
                />
              </Field>
              <Field label="Nam">
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
                  { key: 'MaNhanVien', label: 'Ma NV' },
                  {
                    key: 'HoTen',
                    label: 'Ho ten',
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
                  { key: 'TenPhongBan', label: 'Phong ban' },
                  { key: 'Email', label: 'Email' },
                ]}
                rows={localEmployees}
              />
            </Panel>
            <Panel title="Tổng hợp chấm công">
              <DataTable
                columns={[
                  { key: 'MaNhanVien', label: 'Ma' },
                  { key: 'SoNgayChamCong', label: 'So ngay' },
                ]}
                rows={nodeData.report.attendance || []}
              />
            </Panel>
            <Panel title="Tổng hợp lương">
              <DataTable
                columns={[
                  { key: 'MaNhanVien', label: 'Ma' },
                  {
                    key: 'TongLuong',
                    label: 'Tong luong',
                    render: (row) => formatCurrency(row.TongLuong),
                  },
                ]}
                rows={nodeData.report.payroll || []}
              />
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
