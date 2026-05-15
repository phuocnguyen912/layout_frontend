import { UserPlus } from 'lucide-react';
import Button from '../Button';
import Select from '../Select';

export default function EmployeeListToolbar({ statusFilter, statusOptions, onStatusChange, onAdd }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="accent" onClick={onAdd}>
        <UserPlus className="h-4 w-4" />
        Thêm nhân viên
      </Button>
      <div className="min-w-[200px]">
        <Select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'Tất cả trạng thái' : status}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
