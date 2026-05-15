import { CalendarCheck2, CircleAlert, Plane } from 'lucide-react';
import StatCard from '../../../components/ui/StatCard';

export default function AttendanceStatsCards({ present, late, leave }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard title="Co mat" value={present} hint="So ban ghi cham cong trong bo loc hien tai." icon={CalendarCheck2} tone="emerald" />
      <StatCard title="Di tre" value={late} hint="So lan co trang thai LATE trong bo loc hien tai." icon={CircleAlert} tone="amber" />
      <StatCard title="Nghi phep" value={leave} hint="So ngay nghi phep da duyet trung voi khoang loc." icon={Plane} tone="blue" />
    </div>
  );
}
