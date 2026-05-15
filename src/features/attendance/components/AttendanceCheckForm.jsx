import { CheckCircle2, Clock3 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Field from '../../../components/ui/Field';
import Input from '../../../components/ui/Input';
import Panel from '../../../components/ui/Panel';
import Select from '../../../components/ui/Select';
import StatusPill from '../../../components/ui/StatusPill';

function ResultBox({ children }) {
  return (
    <div className="mt-3 rounded-xl border border-[#c8ddb5] bg-[#edf5e4] px-4 py-3 text-sm text-[#4a6030]">
      {children}
    </div>
  );
}

export default function AttendanceCheckForm({
  type,
  title,
  subtitle,
  employees,
  form,
  setForm,
  error,
  result,
  loading,
  onSubmit,
}) {
  const isCheckIn = type === 'checkin';
  const buttonIcon = isCheckIn ? CheckCircle2 : Clock3;
  const ButtonIcon = buttonIcon;
  const timeKey = isCheckIn ? 'gioVao' : 'gioRa';
  const timeLabel = isCheckIn ? 'Gio vao (HH:mm:ss)' : 'Gio ra (HH:mm:ss)';

  return (
    <Panel title={title} subtitle={subtitle}>
      {error ? (
        <div className="mb-3 rounded-xl bg-[#f3d9d2] px-3 py-2 text-sm text-[#8a3828]">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ma nhan vien">
          {(employees || []).length > 0 ? (
            <Select value={form.maNhanVien} onChange={(event) => setForm({ ...form, maNhanVien: event.target.value })}>
              <option value="">-- Chon nhan vien --</option>
              {(employees || []).map((employee) => (
                <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
                  {employee.MaNhanVien} - {employee.HoTen}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              value={form.maNhanVien}
              onChange={(event) => setForm({ ...form, maNhanVien: event.target.value })}
              placeholder="Nhap ma nhan vien"
            />
          )}
        </Field>

        <Field label="Ngay">
          <Input type="date" value={form.ngay} onChange={(event) => setForm({ ...form, ngay: event.target.value })} />
        </Field>

        <Field label={timeLabel} className="md:col-span-2">
          <Input
            value={form[timeKey]}
            onChange={(event) => setForm({ ...form, [timeKey]: event.target.value })}
            placeholder={isCheckIn ? '08:00:00' : '17:00:00'}
          />
        </Field>
      </div>

      <Button
        variant={isCheckIn ? 'accent' : 'secondary'}
        className="mt-4 w-full"
        loading={loading}
        onClick={onSubmit}
      >
        <ButtonIcon className="h-4 w-4" />
        {isCheckIn ? 'Cham cong vao' : 'Cham cong ra'}
      </Button>

      {result ? (
        <ResultBox>
          {isCheckIn ? (
            <>
              Cham vao thanh cong - <strong>{result.maNhanVien}</strong> ngay <strong>{result.ngay}</strong> -
              Trang thai: <StatusPill status={result.trangThai} />
            </>
          ) : (
            <>
              Cham ra thanh cong - <strong>{result.maNhanVien}</strong> ngay <strong>{result.ngay}</strong> -
              Gio ra: <strong>{String(result.gioRa || '').split(' ')[0]}</strong>
            </>
          )}
        </ResultBox>
      ) : null}
    </Panel>
  );
}
