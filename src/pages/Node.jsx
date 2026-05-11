import { useState } from 'react';
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

export default function Node({ isNode, nodeApi, nodeData, setNodeData, localEmployees, runAction, submittingKey }) {
  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm);
  const [contractForm, setContractForm] = useState(defaultContractForm);
  const [reportFilters, setReportFilters] = useState(defaultReportFilters);

  return (
    <>
      <SectionHeader
        eyebrow="Chi nhánh"
        title="Nhân viên, hợp đồng, báo cáo local"
        description="Quản lý hồ sơ nhân viên, hợp đồng và báo cáo tại chi nhánh."
      />

      {!isNode ? (
        <Panel title="Không dùng profile node" subtitle="Trang này cần đăng nhập profile chi nhánh HCM hoặc Hà Nội.">
          <p className="text-sm text-[var(--hr-muted)]">Chuyển qua môi trường chi nhánh để tạo nhân viên, hợp đồng và xem báo cáo local.</p>
        </Panel>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Tạo nhân viên" subtitle="Thêm hồ sơ nhân sự mới vào chi nhánh.">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction('create-employee', () => nodeApi.createEmployee(employeeForm), () => setEmployeeForm(defaultEmployeeForm));
                }}
              >
                <Field label="Mã nhân viên"><Input value={employeeForm.maNhanVien} onChange={(event) => setEmployeeForm({ ...employeeForm, maNhanVien: event.target.value })} required /></Field>
                <Field label="Họ tên"><Input value={employeeForm.hoTen} onChange={(event) => setEmployeeForm({ ...employeeForm, hoTen: event.target.value })} required /></Field>
                <Field label="Ngày sinh"><Input type="date" value={employeeForm.ngaySinh} onChange={(event) => setEmployeeForm({ ...employeeForm, ngaySinh: event.target.value })} /></Field>
                <Field label="Giới tính">
                  <Select value={employeeForm.gioiTinh} onChange={(event) => setEmployeeForm({ ...employeeForm, gioiTinh: event.target.value })}>
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nu</option>
                    <option value="Khac">Khac</option>
                  </Select>
                </Field>
                <Field label="SĐT"><Input value={employeeForm.sdt} onChange={(event) => setEmployeeForm({ ...employeeForm, sdt: event.target.value })} /></Field>
                <Field label="Email"><Input type="email" value={employeeForm.email} onChange={(event) => setEmployeeForm({ ...employeeForm, email: event.target.value })} /></Field>
                <Field label="Mã phòng ban"><Input value={employeeForm.maPhongBan} onChange={(event) => setEmployeeForm({ ...employeeForm, maPhongBan: event.target.value })} required /></Field>
                <Field label="Mã chức vụ"><Input value={employeeForm.maChucVu} onChange={(event) => setEmployeeForm({ ...employeeForm, maChucVu: event.target.value })} required /></Field>
                <Field label="Ngày vào làm"><Input type="date" value={employeeForm.ngayVaoLam} onChange={(event) => setEmployeeForm({ ...employeeForm, ngayVaoLam: event.target.value })} /></Field>
                <Field label="Mã chi nhánh"><Input value={employeeForm.maChiNhanh} onChange={(event) => setEmployeeForm({ ...employeeForm, maChiNhanh: event.target.value })} required /></Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-employee'} className="md:col-span-2"><UserPlus className="h-4 w-4" />Tạo nhân viên</Button>
              </form>
            </Panel>

            <Panel title="Tạo hợp đồng" subtitle="Ghi nhận hợp đồng lao động cho nhân viên.">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction('create-contract', () => nodeApi.createContract(contractForm), () => setContractForm(defaultContractForm));
                }}
              >
                <Field label="Mã hợp đồng"><Input value={contractForm.maHopDong} onChange={(event) => setContractForm({ ...contractForm, maHopDong: event.target.value })} required /></Field>
                <Field label="Mã nhân viên"><Input value={contractForm.maNhanVien} onChange={(event) => setContractForm({ ...contractForm, maNhanVien: event.target.value })} required /></Field>
                <Field label="Mã loại hợp đồng"><Input value={contractForm.maLoaiHopDong} onChange={(event) => setContractForm({ ...contractForm, maLoaiHopDong: event.target.value })} required /></Field>
                <Field label="Trạng thái"><Input value={contractForm.trangThai} onChange={(event) => setContractForm({ ...contractForm, trangThai: event.target.value })} /></Field>
                <Field label="Ngày bắt đầu"><Input type="date" value={contractForm.ngayBatDau} onChange={(event) => setContractForm({ ...contractForm, ngayBatDau: event.target.value })} /></Field>
                <Field label="Ngày kết thúc"><Input type="date" value={contractForm.ngayKetThuc} onChange={(event) => setContractForm({ ...contractForm, ngayKetThuc: event.target.value })} /></Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-contract'} className="md:col-span-2"><FileText className="h-4 w-4" />Tạo hợp đồng</Button>
              </form>
            </Panel>
          </div>

          <Panel
            title="Bộ lọc báo cáo local"
            subtitle="Lọc nhanh nhân sự, chấm công và lương theo kỳ."
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
              <Field label="Từ khóa"><Input value={reportFilters.keyword} onChange={(event) => setReportFilters({ ...reportFilters, keyword: event.target.value })} /></Field>
              <Field label="Thang"><Input type="number" value={reportFilters.thang} onChange={(event) => setReportFilters({ ...reportFilters, thang: Number(event.target.value) })} /></Field>
              <Field label="Nam"><Input type="number" value={reportFilters.nam} onChange={(event) => setReportFilters({ ...reportFilters, nam: Number(event.target.value) })} /></Field>
            </div>
          </Panel>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Nhân viên local">
              <DataTable
                columns={[
                  { key: 'MaNhanVien', label: 'Mã NV' },
                  {
                    key: 'HoTen', label: 'Họ tên',
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
                  { key: 'TenPhongBan', label: 'Phòng ban' },
                  { key: 'Email', label: 'Email' },
                ]}
                rows={localEmployees}
              />
            </Panel>
            <Panel title="Tổng hợp chấm công">
              <DataTable columns={[{ key: 'MaNhanVien', label: 'Mã' }, { key: 'SoNgayChamCong', label: 'Số ngày' }]} rows={nodeData.report.attendance || []} />
            </Panel>
            <Panel title="Tổng hợp lương">
              <DataTable columns={[{ key: 'MaNhanVien', label: 'Mã' }, { key: 'TongLuong', label: 'Tổng lương', render: (row) => formatCurrency(row.TongLuong) }]} rows={nodeData.report.payroll || []} />
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
