import { AlertTriangle, CalendarCheck2, CalendarMinus2 } from 'lucide-react';
import StatCard from '../ui/StatCard';

export default function AttendanceStatsCards({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Co mat" value={stats.present} hint="Tong cong trong ky" icon={CalendarCheck2} tone="emerald" />
      <StatCard title="Di tre" value={stats.late} hint="Su kien late gan nhat" icon={AlertTriangle} tone="amber" />
      <StatCard title="Nghi phep" value={stats.leave} hint="Don da duyet" icon={CalendarMinus2} tone="blue" />
    </div>
  );
}
