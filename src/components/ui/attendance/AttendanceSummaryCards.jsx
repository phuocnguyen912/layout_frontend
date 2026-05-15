import { BadgeDollarSign, CheckCircle2, Clock3 } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

function SummaryCard({ icon: Icon, label, value, tone }) {
  const tones = {
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function AttendanceSummaryCards({ employeeCount, pendingLeaveCount, payrollTotal }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-3">
      <SummaryCard
        icon={CheckCircle2}
        label="Nhân viên đi làm"
        value={employeeCount}
        tone="green"
      />
      <SummaryCard
        icon={Clock3}
        label="Đơn chờ duyệt"
        value={pendingLeaveCount}
        tone="orange"
      />
      <SummaryCard
        icon={BadgeDollarSign}
        label="Tổng quỹ lương"
        value={formatCurrency(payrollTotal)}
        tone="blue"
      />
    </div>
  );
}
