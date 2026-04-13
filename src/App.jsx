import { useMemo, useState } from 'react';
import { Activity, CalendarDays, Hammer, LayoutDashboard, ListChecks, User, Users } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PublisherDashboard from './pages/PublisherDashboard';
import NodeDashboard from './pages/NodeDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendancePage from './pages/AttendancePage';
import SynchronizationMonitor from './pages/SynchronizationMonitor';

const menuItems = [
  { title: 'Publisher Dashboard', key: 'publisher', icon: LayoutDashboard },
  { title: 'Node Dashboard', key: 'node', icon: Activity },
  { title: 'Employees', key: 'employees', icon: Users },
  { title: 'Attendance', key: 'attendance', icon: CalendarDays },
  { title: 'Synchronization', key: 'sync', icon: ListChecks },
];

const pageTitle = {
  publisher: 'Publisher Dashboard',
  node: 'Node Dashboard',
  employees: 'Employee Management',
  attendance: 'Attendance',
  sync: 'Synchronization Monitor',
};

const pageDescription = {
  publisher: 'A snapshot of employee attendance and node sync health.',
  node: 'Monitor node statistics and staff attendance at a glance.',
  employees: 'Manage employee records, roles, and status.',
  attendance: 'Track daily check-ins and attendance history.',
  sync: 'Review synchronization metrics and node health.',
};

function placeholderContent(page) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-card">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">{pageTitle[page]}</h2>
        <p className="text-slate-500">{pageDescription[page]}</p>
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-700">
          <p className="text-sm leading-7">
            This page is under construction. The Publisher Dashboard is fully implemented with summary cards, charts, and sync status.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('publisher');
  const [searchQuery, setSearchQuery] = useState('');

  const pageTitleText = pageTitle[activePage] || 'Dashboard';
  const pageDescriptionText = pageDescription[activePage] || '';

  const headerDetails = useMemo(
    () => ({ title: pageTitleText, subtitle: pageDescriptionText, query: searchQuery }),
    [pageTitleText, pageDescriptionText, searchQuery]
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Sidebar
        logo="HR Pulse"
        menuItems={menuItems}
        activeKey={activePage}
        onSelect={setActivePage}
      />

      <div className="ml-0 xl:ml-80">
        <Header
          title={headerDetails.title}
          subtitle={headerDetails.subtitle}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {activePage === 'publisher' && <PublisherDashboard />}
          {activePage === 'node' && <NodeDashboard />}
          {activePage === 'employees' && <EmployeeManagement />}
          {activePage === 'attendance' && <AttendancePage />}
          {activePage === 'sync' && <SynchronizationMonitor />}
        </main>
      </div>
    </div>
  );
}
