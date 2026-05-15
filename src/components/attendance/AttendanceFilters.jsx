import Field from '../ui/Field';
import Input from '../ui/Input';
import Panel from '../ui/Panel';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function AttendanceFilters({ filters, setFilters, reportFilters, setReportFilters, employees, onApply }) {
  return (
    <Panel
      title="Bo loc cham cong"
      subtitle="Loc theo ngay, thang va nhan vien tren du lieu backend hien co."
      action={
        <Button variant="secondary" onClick={onApply}>
          Ap dung
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-5">
        <Field label="Ngay">
          <Input
            type="date"
            value={filters.date}
            onChange={(event) => setFilters((previous) => ({ ...previous, date: event.target.value }))}
          />
        </Field>
        <Field label="Thang">
          <Input
            type="number"
            min={1}
            max={12}
            value={reportFilters.thang}
            onChange={(event) => setReportFilters((previous) => ({ ...previous, thang: Number(event.target.value) }))}
          />
        </Field>
        <Field label="Nam">
          <Input
            type="number"
            min={2020}
            value={reportFilters.nam}
            onChange={(event) => setReportFilters((previous) => ({ ...previous, nam: Number(event.target.value) }))}
          />
        </Field>
        <Field label="Nhan vien">
          <Select
            value={filters.employeeId}
            onChange={(event) => setFilters((previous) => ({ ...previous, employeeId: event.target.value }))}
          >
            <option value="">Tat ca nhan vien</option>
            {employees.map((employee) => (
              <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
                {employee.MaNhanVien} - {employee.HoTen}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tu khoa">
          <Input
            value={filters.keyword}
            onChange={(event) => setFilters((previous) => ({ ...previous, keyword: event.target.value }))}
            placeholder="Tim theo ten hoac ma"
          />
        </Field>
      </div>
    </Panel>
  );
}
