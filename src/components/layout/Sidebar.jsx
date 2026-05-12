import { useState } from 'react';
import {
  ArrowRightLeft,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  FileText,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';

const menuItems = [
  { key: 'overview', path: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'publisher', path: '/publisher', label: 'Quản trị Publisher', icon: Building2 },
  { key: 'employees', path: '/employees', label: 'Danh sách nhân viên', icon: Users },
  { key: 'node', path: '/node', label: 'Nghiệp vụ local', icon: BriefcaseBusiness },
  { key: 'attendance', path: '/attendance', label: 'Chấm công', icon: CalendarClock },
  { key: 'positions', path: '/positions', label: 'Chức vụ', icon: BriefcaseBusiness },
  { key: 'contracts', path: '/contracts', label: 'Hợp đồng', icon: FileText },
  { key: 'salary', path: '/salary', label: 'Lương', icon: HandCoins },
  { key: 'sync', path: '/sync', label: 'Đồng bộ', icon: ArrowRightLeft },
];

export default function Sidebar({ session, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!session) return null;

  const visibleMenuItems = session.profile.mode === 'publisher'
    ? menuItems.filter((item) => !['node', 'attendance'].includes(item.key))
    : menuItems.filter((item) => item.key !== 'publisher');

  const sidebarContent = (
    <>
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.38em] text-[#d8b39e]">DDB HRM</p>
        <h1 className="mt-3 text-2xl font-semibold">{session.profile.label}</h1>
        <p className="mt-2 text-sm leading-6 text-[#d5c8bf]">{session.profile.description}</p>
      </div>

      <div className="mt-8 space-y-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left transition ${
                  isActive ? 'bg-[#d8b39e] text-[#241d19]' : 'bg-white/5 text-[#f1e6dd] hover:bg-white/10'
                }`
              }
            >
              <span className="flex items-center gap-3 font-medium">
                <Icon className="h-5 w-5" />
                {item.label}
              </span>
            </NavLink>
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#241d19] text-white shadow-lg xl:hidden"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[300px] transform overflow-y-auto bg-[#241d19] px-5 py-6 text-white transition-transform duration-300 xl:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden border-b border-white/50 bg-[#241d19] px-5 py-6 text-white xl:block xl:min-h-screen xl:border-b-0 xl:border-r xl:border-white/10">
        {sidebarContent}
      </aside>
    </>
  );
}
