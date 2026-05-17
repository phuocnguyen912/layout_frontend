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
      title="Bộ lọc chấm công"
      subtitle="Lọc theo nhân viên, ngày hoặc tháng để tra cứu lịch sử chấm công."
      action={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetFilters}>Reset</Button>
          <Button variant="accent" onClick={applyFilters}>Áp dụng</Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nhân viên">
          {(employees || []).length > 0 ? (
            <Select value={filters.employeeId} onChange={(event) => updateFilter('employeeId', event.target.value)}>
              <option value="">-- Chọn nhân viên --</option>
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
              placeholder="Nhập mã nhân viên"
            />
          )}
        </Field>

        <Field label="Chế độ lọc">
          <Select value={filters.filterMode} onChange={(event) => updateFilter('filterMode', event.target.value)}>
            <option value={ATTENDANCE_FILTER_MODE.DAY}>Theo ngày</option>
            <option value={ATTENDANCE_FILTER_MODE.MONTH}>Theo tháng</option>
          </Select>
        </Field>

        {filters.filterMode === ATTENDANCE_FILTER_MODE.DAY ? (
          <Field label="Ngày">
            <Input
              type="date"
              value={filters.selectedDate}
              onChange={(event) => updateFilter('selectedDate', event.target.value)}
            />
          </Field>
        ) : (
          <Field label="Tháng">
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
