import { Users, Clock3, WalletCards } from 'lucide-react';
import StatCard from '../ui/StatCard';
import { formatCurrency } from '../../utils/format';

export default function DashboardStats({ totalEmployees, totalAttendance, totalPayroll, isPublisher }) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <StatCard 
        title="Nhân sự hiển thị" 
        value={totalEmployees} 
        hint="Số bản ghi có thể thao tác trên giao diện hiện tại." 
        icon={Users} 
        tone="blue" 
      />
      <StatCard 
        title="Tổng chấm công / sync" 
        value={totalAttendance} 
        hint={isPublisher ? 'Số node đang được giám sát từ publisher.' : 'Tổng số ngày chấm công trong kỳ lọc.'} 
        icon={Clock3} 
        tone="emerald" 
      />
      <StatCard 
        title="Quỹ lương" 
        value={formatCurrency(totalPayroll)} 
        hint="Tổng lương theo dữ liệu hiện có." 
        icon={WalletCards} 
        tone="amber" 
      />
    </div>
  );
}
