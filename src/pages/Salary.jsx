import { useState } from 'react';
import { BadgeDollarSign, RefreshCw } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import { formatCurrency } from '../utils/format';

const currentDate = new Date();

const emptyForm = {
  maNhanVien: '',
  thang: currentDate.getMonth() + 1,
  nam: currentDate.getFullYear(),
  phuCap: '',
  thuong: '',
  khauTru: '',
};

export default function Salary({
  isNode,
  nodeApi,
  nodeData,
  setNodeData,
  localEmployees = [],
  payrollChartData = [],
  runAction,
  submittingKey,
}) {
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({
    keyword: '',
    thang: currentDate.getMonth() + 1,
    nam: currentDate.getFullYear(),
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function validate() {
    if (!form.maNhanVien.trim()) return 'Mã nhân viên không được để trống.';
    const thang = Number(form.thang);
    const nam = Number(form.nam);
    if (thang < 1 || thang > 12) return 'Tháng phải từ 1 đến 12.';
    if (nam < 2000 || nam > 2100) return 'Năm không hợp lệ.';
    return '';
  }

  function generateSalary(event) {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setError('');
    setResult(null);
    runAction('salary', () => nodeApi.generateSalary({
      maNhanVien: form.maNhanVien.trim(),
      thang: Number(form.thang),
      nam: Number(form.nam),
      phuCap: form.phuCap ? Number(form.phuCap) : 0,
      thuong: form.thuong ? Number(form.thuong) : 0,
      khauTru: form.khauTru ? Number(form.khauTru) : 0,
    }), (response) => {
      setResult(response);
      setFilters((previous) => ({ ...previous, thang: Number(form.thang), nam: Number(form.nam) }));
    });
  }

  function loadReport() {
    setError('');
    runAction('salary-report', () => nodeApi.localReport(filters), (response) =>
      setNodeData((previous) => ({ ...previous, report: response })),
    );
  }

  if (!isNode) {
    return (
      <>
        <SectionHeader
          eyebrow="Lương"
          title="Quản lý lương"
          description="Tính lương là nghiệp vụ của từng chi nhánh."
        />
        <Panel title="Cần profile chi nhánh" subtitle="Đăng nhập Node HCM hoặc Node HN để tính và xem bảng lương.">
          <p className="text-sm text-[var(--hr-muted)]">Publisher chỉ xem tổng hợp lương ở trang tổng quan.</p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Lương"
        title="Tính và xem bảng lương"
        description="Tạo bảng lương theo kỳ cho nhân viên local và tải báo cáo lương theo tháng."
      />

      {error && <div className="rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Tính lương nhân viên" subtitle="POST /node/salaries/generate">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={generateSalary}>
            <Field label="Nhân viên">
              <Select value={form.maNhanVien} onChange={(event) => setForm({ ...form, maNhanVien: event.target.value })} required>
                <option value="">-- Chọn nhân viên --</option>
                {localEmployees.map((employee) => (
                  <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
                    {employee.MaNhanVien} - {employee.HoTen}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tháng">
              <Input type="number" min="1" max="12" value={form.thang} onChange={(event) => setForm({ ...form, thang: event.target.value })} />
            </Field>
            <Field label="Năm">
              <Input type="number" min="2000" max="2100" value={form.nam} onChange={(event) => setForm({ ...form, nam: event.target.value })} />
            </Field>
            <Field label="Phụ cấp">
              <Input type="number" min="0" value={form.phuCap} onChange={(event) => setForm({ ...form, phuCap: event.target.value })} placeholder="0" />
            </Field>
            <Field label="Thưởng">
              <Input type="number" min="0" value={form.thuong} onChange={(event) => setForm({ ...form, thuong: event.target.value })} placeholder="0" />
            </Field>
            <Field label="Khấu trừ">
              <Input type="number" min="0" value={form.khauTru} onChange={(event) => setForm({ ...form, khauTru: event.target.value })} placeholder="0" />
            </Field>
            <Button type="submit" variant="accent" loading={submittingKey === 'salary'} className="md:col-span-2">
              <BadgeDollarSign className="h-4 w-4" />
              Tính lương
            </Button>
          </form>

          {result ? (
            <div className="mt-4 rounded-2xl border border-[#c8ddb5] bg-[#edf5e4] p-4 text-sm text-[#4a6030]">
              <p className="font-semibold">Đã tính lương cho {result.maNhanVien}</p>
              <p className="mt-1">Kỳ lương: tháng {result.thang}/{result.nam}</p>
              <p className="mt-1">Lương cơ bản: {formatCurrency(result.luongCoBan)}</p>
            </div>
          ) : null}
        </Panel>

        <Panel
          title="Bộ lọc bảng lương"
          subtitle="Dữ liệu lấy từ báo cáo local theo kỳ."
          action={(
            <Button variant="secondary" loading={submittingKey === 'salary-report'} onClick={loadReport}>
              <RefreshCw className="h-4 w-4" />
              Tải báo cáo
            </Button>
          )}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Từ khóa">
              <Input value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} />
            </Field>
            <Field label="Tháng">
              <Input type="number" min="1" max="12" value={filters.thang} onChange={(event) => setFilters({ ...filters, thang: Number(event.target.value) })} />
            </Field>
            <Field label="Năm">
              <Input type="number" min="2000" max="2100" value={filters.nam} onChange={(event) => setFilters({ ...filters, nam: Number(event.target.value) })} />
            </Field>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel title="Bảng lương" subtitle={`${nodeData.report.payroll?.length || 0} dòng`}>
          <DataTable
            columns={[
              { key: 'MaNhanVien', label: 'Mã NV' },
              { key: 'TongLuong', label: 'Tổng lương', render: (row) => formatCurrency(row.TongLuong) },
            ]}
            rows={nodeData.report.payroll || []}
          />
        </Panel>

        <Panel title="Biểu đồ lương" subtitle="So sánh tổng lương theo nhân viên.">
          {payrollChartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollChartData}>
                  <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                  <XAxis dataKey="name" stroke="#8a7768" />
                  <YAxis stroke="#8a7768" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="salary" fill="#b55233" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-[var(--hr-muted)]">Chưa có dữ liệu lương cho kỳ đang chọn.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
