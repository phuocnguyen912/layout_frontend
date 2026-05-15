import { BadgeDollarSign } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Input from '../ui/Input';
import Panel from '../ui/Panel';
import Select from '../ui/Select';
import { formatCurrency } from '../../utils/format';

export default function SalaryPanel({ employees, salaryForm, setSalaryForm, salaryResult, salaryError, onGenerate, submittingKey, payrollChartData }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Tinh luong" subtitle="Giu nguyen flow tinh luong hien co trong module node.">
        {salaryError ? <p className="mb-3 text-sm text-[#8a3828]">{salaryError}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nhan vien">
            <Select
              value={salaryForm.maNhanVien}
              onChange={(event) => setSalaryForm((previous) => ({ ...previous, maNhanVien: event.target.value }))}
            >
              <option value="">Chon nhan vien</option>
              {employees.map((employee) => (
                <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
                  {employee.MaNhanVien} - {employee.HoTen}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Thang">
            <Input type="number" value={salaryForm.thang} onChange={(event) => setSalaryForm((previous) => ({ ...previous, thang: event.target.value }))} />
          </Field>
          <Field label="Nam">
            <Input type="number" value={salaryForm.nam} onChange={(event) => setSalaryForm((previous) => ({ ...previous, nam: event.target.value }))} />
          </Field>
          <Field label="Phu cap">
            <Input value={salaryForm.phuCap} onChange={(event) => setSalaryForm((previous) => ({ ...previous, phuCap: event.target.value }))} />
          </Field>
          <Field label="Thuong">
            <Input value={salaryForm.thuong} onChange={(event) => setSalaryForm((previous) => ({ ...previous, thuong: event.target.value }))} />
          </Field>
          <Field label="Khau tru">
            <Input value={salaryForm.khauTru} onChange={(event) => setSalaryForm((previous) => ({ ...previous, khauTru: event.target.value }))} />
          </Field>
        </div>
        <Button className="mt-4 w-full" variant="accent" loading={submittingKey === 'salary'} onClick={onGenerate}>
          <BadgeDollarSign className="h-4 w-4" />
          Tinh luong
        </Button>
        {salaryResult ? (
          <div className="mt-4 rounded-2xl border border-[#d5e4c8] bg-[#edf5e4] px-4 py-3 text-sm text-[#4a6030]">
            <p>{salaryResult.maNhanVien}</p>
            <p className="mt-1">Luong co ban: {formatCurrency(salaryResult.luongCoBan)}</p>
          </div>
        ) : null}
      </Panel>

      <Panel title="Bieu do luong" subtitle="Giu lai tong quan luong theo ky dang loc.">
        {payrollChartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollChartData}>
                <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#8a7768" interval={0} angle={-20} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                <YAxis stroke="#8a7768" tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="salary" fill="#b55233" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-[var(--hr-muted)]">Chua co du lieu luong trong ky nay.</p>
        )}
      </Panel>
    </div>
  );
}
