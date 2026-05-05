import {
  ArrowRightLeft,
  Building2,
  CalendarClock,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Users,
} from 'lucide-react';
import Button from '../ui/Button';

const menuItems = [
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'publisher', label: 'Publisher', icon: Building2 },
  { key: 'node', label: 'Nghiệp vụ chi nhánh', icon: Users },
  { key: 'attendance', label: 'Chấm công', icon: CalendarClock },
  { key: 'sync', label: 'Đồng bộ', icon: ArrowRightLeft },
];

export default function Sidebar({ session, activePage, setActivePage, handleLogout }) {
  if (!session) return null;

  return (
    <aside className="border-b border-white/50 bg-[#241d19] px-5 py-6 text-white xl:min-h-screen xl:border-b-0 xl:border-r xl:border-white/10">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.38em] text-[#d8b39e]">DDB HRM</p>
        <h1 className="mt-3 text-2xl font-semibold">{session.profile.label}</h1>
        <p className="mt-2 text-sm leading-6 text-[#d5c8bf]">{session.profile.description}</p>
      </div>

      <div className="mt-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = item.key === activePage;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePage(item.key)}
              className={`flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left transition ${
                active ? 'bg-[#d8b39e] text-[#241d19]' : 'bg-white/5 text-[#f1e6dd] hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3 font-medium">
                <Icon className="h-5 w-5" />
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm">
        <p className="font-semibold text-white">{session.user.username}</p>
        <p className="mt-1 text-[#d4c9c0]">Vai trò: {session.user.maRole || 'N/A'}</p>
        <p className="mt-1 text-[#d4c9c0]">Chi nhánh: {session.user.maChiNhanh || 'Toàn hệ thống'}</p>
        <Button variant="secondary" className="mt-4 w-full bg-white/10 text-white hover:bg-white/20" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
