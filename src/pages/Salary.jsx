import { useEffect, useMemo, useState } from 'react';
import { HandCoins, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import { formatCurrency } from '../utils/format';

const currentDate = new Date();

const defaultSalaryForm = {
  maNhanVien: '',
  thang: currentDate.getMonth() + 1,
  nam: currentDate.getFullYear(),
  phuCap: '0',
  thuong: '0',
  khauTru: '0',
};

export default function Salary({
  isPublisher,
  isNode,
  publisherData,
  nodeApi,
  runAction,
  submittingKey,
  payrollChartData,
}) {
  const [form, setForm] = useState(defaultSalaryForm);
  const [filters, setFilters] = useState({
    thang: currentDate.getMonth() + 1,
    nam: currentDate.getFullYear(),
    maNhanVien: '',
  });
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNode || !nodeApi) return;
    setLoading(true);
    Promise.all([
      nodeApi.listEmployees?.().catch(() => []),
      nodeApi.listSalaries?.(filters).catch(() => []),
    ])
      .then(([employeeRows, salaryRows]) => {
        setEmployees(employeeRows || []);
        setSalaries(salaryRows || []);
      })
      .finally(() => setLoading(false));
  }, [isNode, nodeApi, filters, reloadKey]);

  const employeeOptions = useMemo(
    () =>
      employees.map((item) => ({
        id: item.MaNhanVien,
        label: `${item.MaNhanVien} - ${item.HoTen || 'Nhân viên'}`,
      })),
    [employees],
  );

  const totalSalary = isPublisher
    ? Number(publisherData?.summary?.salaryStats?.TongLuong || 0)
    : salaries.reduce((sum, item) => sum + Number(item.TongLuong || 0), 0);

  const averageSalary = salaries.length ? totalSalary / salaries.length : 0;

  const submitGenerateSalary = () => {
    if (!nodeApi?.generateSalary) return;
    runAction(
      'generate-salary',
      () =>
        nodeApi.generateSalary({
          maNhanVien: form.maNhanVien,
          thang: Number(form.thang),
          nam: Number(form.nam),
          phuCap: Number(form.phuCap || 0),
          thuong: Number(form.thuong || 0),
          khauTru: Number(form.khauTru || 0),
        }),
      () => {
        setFilters((prev) => ({
          ...prev,
          maNhanVien: form.maNhanVien,
          thang: Number(form.thang),
          nam: Number(form.nam),
        }));
        setReloadKey((key) => key + 1);
      },
    );
  };

  const salaryColumns = [
    {
      key: 'NhanVien',
      label: 'Nhân viên',
      render: (row) => (
        <div>
          <p className="font-semibold text-[var(--hr-ink)]">{row.HoTen || row.MaNhanVien}</p>
          <p className="text-xs text-[var(--hr-muted)]">{row.MaNhanVien}</p>
        </div>
      ),
    },
    { key: 'KyLuong', label: 'Kỳ lương', render: (row) => `${row.Thang}/${row.Nam}` },
    { key: 'LuongCoBan', label: 'Lương cơ bản', render: (row) => formatCurrency(row.LuongCoBan) },
    { key: 'PhuCap', label: 'Phụ cấp', render: (row) => formatCurrency(row.PhuCap) },
    { key: 'Thuong', label: 'Thưởng', render: (row) => formatCurrency(row.Thuong) },
    { key: 'KhauTru', label: 'Khấu trừ', render: (row) => formatCurrency(row.KhauTru) },
    {
      key: 'TongLuong',
      label: 'Tổng lương',
      render: (row) => <span className="font-semibold text-[var(--hr-ink)]">{formatCurrency(row.TongLuong)}</span>,
    },
  ];

  const chartRows = (payrollChartData || []).map((item) => ({
    id: item.name,
    MaNhanVien: item.name,
    TongLuong: item.salary,
  }));

  return (
    <>
      <SectionHeader
        eyebrow="Salary"
        title="Quản lý lương"
        description="Chi nhánh sinh lương theo nhân viên, tháng và năm. Lương cơ bản được hệ thống tính từ hệ số lương của chức vụ."
        action={
          isNode ? (
            <Button type="button" variant="secondary" onClick={() => setReloadKey((key) => key + 1)} loading={loading}>
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title={isPublisher ? 'Tổng lương công ty' : 'Tổng lương kỳ này'} value={formatCurrency(totalSalary)} hint={isPublisher ? 'Từ báo cáo Publisher' : `${filters.thang}/${filters.nam}`} icon={HandCoins} tone="emerald" />
        <StatCard title="Bảng lương" value={isPublisher ? chartRows.length : salaries.length} hint={isPublisher ? 'Từ báo cáo tổng quan' : 'Bản ghi tại chi nhánh'} icon={HandCoins} tone="slate" />
        <StatCard title="Bình quân" value={formatCurrency(averageSalary)} hint="Trên kết quả hiện tại" icon={HandCoins} tone="amber" />
      </div>

      {isNode ? (
        <>
          <Panel title="Sinh bảng lương" subtitle="Tính lương cho một nhân viên trong kỳ đã chọn.">
            <form
              className="grid gap-4 md:grid-cols-3"
              onSubmit={(event) => {
                event.preventDefault();
                submitGenerateSalary();
              }}
            >
              <Field label="Nhân viên">
                <Select value={form.maNhanVien} onChange={(event) => setForm({ ...form, maNhanVien: event.target.value })} required>
                  <option value="">Chọn nhân viên</option>
                  {employeeOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Tháng">
                <Input type="number" min="1" max="12" value={form.thang} onChange={(event) => setForm({ ...form, thang: event.target.value })} required />
              </Field>
              <Field label="Nam">
                <Input type="number" min="2000" value={form.nam} onChange={(event) => setForm({ ...form, nam: event.target.value })} required />
              </Field>
              <Field label="Phụ cấp">
                <Input type="number" min="0" value={form.phuCap} onChange={(event) => setForm({ ...form, phuCap: event.target.value })} />
              </Field>
              <Field label="Thưởng">
                <Input type="number" min="0" value={form.thuong} onChange={(event) => setForm({ ...form, thuong: event.target.value })} />
              </Field>
              <Field label="Khấu trừ">
                <Input type="number" min="0" value={form.khauTru} onChange={(event) => setForm({ ...form, khauTru: event.target.value })} />
              </Field>
              <Button type="submit" variant="accent" loading={submittingKey === 'generate-salary'} className="md:col-span-3">
                <HandCoins className="h-4 w-4" />
                Sinh lương
              </Button>
            </form>
          </Panel>

          <Panel title="Lọc bảng lương" subtitle="Tra cứu bảng lương theo nhân viên hoặc kỳ lương.">
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Nhân viên">
                <Select value={filters.maNhanVien} onChange={(event) => setFilters({ ...filters, maNhanVien: event.target.value })}>
                  <option value="">Tất cả</option>
                  {employeeOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Tháng">
                <Input type="number" min="1" max="12" value={filters.thang} onChange={(event) => setFilters({ ...filters, thang: event.target.value ? Number(event.target.value) : '' })} />
              </Field>
              <Field label="Nam">
                <Input type="number" min="2000" value={filters.nam} onChange={(event) => setFilters({ ...filters, nam: event.target.value ? Number(event.target.value) : '' })} />
              </Field>
              <div className="flex items-end">
                <Button type="button" variant="secondary" className="w-full" onClick={() => setFilters({ thang: '', nam: '', maNhanVien: '' })}>
                  Xóa lọc
                </Button>
              </div>
            </div>
          </Panel>

          <Panel title="Bảng lương chi nhánh" subtitle="Danh sách lương đã sinh trong dữ liệu chi nhánh.">
            <DataTable columns={salaryColumns} rows={salaries.map((item) => ({ ...item, id: item.MaLuong || `${item.MaNhanVien}-${item.Thang}-${item.Nam}` }))} emptyText="Chưa có bảng lương" />
          </Panel>
        </>
      ) : (
        <Panel title="Tổng hợp lương Publisher" subtitle="Publisher hiển thị tổng lương theo báo cáo toàn hệ thống. Việc sinh lương được thực hiện tại chi nhánh.">
          <DataTable
            columns={[
              { key: 'MaNhanVien', label: 'Nhân viên' },
              { key: 'TongLuong', label: 'Tổng lương', render: (row) => formatCurrency(row.TongLuong) },
            ]}
            rows={chartRows}
            emptyText="Chưa có dữ liệu lương trên báo cáo"
          />
        </Panel>
      )}
    </>
  );
}
