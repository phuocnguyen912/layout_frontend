import Button from '../../../components/ui/Button';
import Field from '../../../components/ui/Field';
import Input from '../../../components/ui/Input';
import Panel from '../../../components/ui/Panel';
import Select from '../../../components/ui/Select';
import { ATTENDANCE_FILTER_MODE } from '../constants/attendanceConstants';

export default function AttendanceFilters({
  employees,
  filters,
  updateFilter,
  applyFilters,
  resetFilters,
}) {
  return (
    <Panel
      title="Bo loc cham cong"
      subtitle="Loc theo nhan vien, ngay hoac thang. Frontend se convert sang tuNgay-denNgay theo flow backend."
      action={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetFilters}>Reset</Button>
          <Button variant="accent" onClick={applyFilters}>Ap dung</Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nhan vien">
          {(employees || []).length > 0 ? (
            <Select value={filters.employeeId} onChange={(event) => updateFilter('employeeId', event.target.value)}>
              <option value="">-- Chon nhan vien --</option>
              {(employees || []).map((employee) => (
                <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
                  {employee.MaNhanVien} - {employee.HoTen}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              value={filters.employeeId}
              onChange={(event) => updateFilter('employeeId', event.target.value)}
              placeholder="Nhap ma nhan vien"
            />
          )}
        </Field>

        <Field label="Che do loc">
          <Select value={filters.filterMode} onChange={(event) => updateFilter('filterMode', event.target.value)}>
            <option value={ATTENDANCE_FILTER_MODE.DAY}>Theo ngay</option>
            <option value={ATTENDANCE_FILTER_MODE.MONTH}>Theo thang</option>
          </Select>
        </Field>

        {filters.filterMode === ATTENDANCE_FILTER_MODE.DAY ? (
          <Field label="Ngay">
            <Input
              type="date"
              value={filters.selectedDate}
              onChange={(event) => updateFilter('selectedDate', event.target.value)}
            />
          </Field>
        ) : (
          <Field label="Thang">
            <Input
              type="month"
              value={filters.selectedMonth}
              onChange={(event) => updateFilter('selectedMonth', event.target.value)}
            />
          </Field>
        )}
      </div>
    </Panel>
  );
}
