import { CheckCircle2, Clock3 } from 'lucide-react';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Input from '../ui/Input';
import Panel from '../ui/Panel';
import Select from '../ui/Select';
import StatusPill from '../ui/StatusPill';

function EmployeeField({ employees, value, onChange }) {
  return (
    <Field label="Nhan vien">
      <Select value={value} onChange={onChange}>
        <option value="">Chon nhan vien</option>
        {employees.map((employee) => (
          <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
            {employee.MaNhanVien} - {employee.HoTen}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export default function CheckInOutPanel({
  employees,
  checkInForm,
  setCheckInForm,
  checkOutForm,
  setCheckOutForm,
  onCheckIn,
  onCheckOut,
  submittingKey,
  checkInResult,
  checkOutResult,
  checkInError,
  checkOutError,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Check-in" subtitle="Ghi nhan gio vao va trang thai di tre/dung gio.">
        {checkInError ? <p className="mb-3 text-sm text-[#8a3828]">{checkInError}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <EmployeeField
            employees={employees}
            value={checkInForm.maNhanVien}
            onChange={(event) => setCheckInForm((previous) => ({ ...previous, maNhanVien: event.target.value }))}
          />
          <Field label="Ngay">
            <Input
              type="date"
              value={checkInForm.ngay}
              onChange={(event) => setCheckInForm((previous) => ({ ...previous, ngay: event.target.value }))}
            />
          </Field>
          <Field label="Gio vao" className="md:col-span-2">
            <Input
              value={checkInForm.gioVao}
              onChange={(event) => setCheckInForm((previous) => ({ ...previous, gioVao: event.target.value }))}
            />
          </Field>
        </div>
        <Button className="mt-4 w-full" variant="accent" loading={submittingKey === 'checkin'} onClick={onCheckIn}>
          <CheckCircle2 className="h-4 w-4" />
          Check-in
        </Button>
        {checkInResult ? (
          <div className="mt-4 rounded-2xl border border-[#d5e4c8] bg-[#edf5e4] px-4 py-3 text-sm text-[#4a6030]">
            <p>{checkInResult.maNhanVien} - {checkInResult.ngay}</p>
            <div className="mt-2">
              <StatusPill status={checkInResult.trangThai} />
            </div>
          </div>
        ) : null}
      </Panel>

      <Panel title="Check-out" subtitle="Ghi nhan gio ra va cap nhat ket qua cuoi ngay.">
        {checkOutError ? <p className="mb-3 text-sm text-[#8a3828]">{checkOutError}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <EmployeeField
            employees={employees}
            value={checkOutForm.maNhanVien}
            onChange={(event) => setCheckOutForm((previous) => ({ ...previous, maNhanVien: event.target.value }))}
          />
          <Field label="Ngay">
            <Input
              type="date"
              value={checkOutForm.ngay}
              onChange={(event) => setCheckOutForm((previous) => ({ ...previous, ngay: event.target.value }))}
            />
          </Field>
          <Field label="Gio ra" className="md:col-span-2">
            <Input
              value={checkOutForm.gioRa}
              onChange={(event) => setCheckOutForm((previous) => ({ ...previous, gioRa: event.target.value }))}
            />
          </Field>
        </div>
        <Button className="mt-4 w-full" variant="secondary" loading={submittingKey === 'checkout'} onClick={onCheckOut}>
          <Clock3 className="h-4 w-4" />
          Check-out
        </Button>
        {checkOutResult ? (
          <div className="mt-4 rounded-2xl border border-[#dfcfbf] bg-[#fbf5ee] px-4 py-3 text-sm text-[#5f534b]">
            <p>{checkOutResult.maNhanVien} - {checkOutResult.ngay}</p>
            <p className="mt-2">Gio ra: {checkOutResult.gioRa}</p>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
