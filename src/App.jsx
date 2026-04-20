import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRightLeft,
  BadgeDollarSign,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GitBranch,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  API_PROFILES,
  clearSession,
  createNodeApi,
  createPublisherApi,
  loadSession,
  login,
  saveSession,
} from './lib/api';

const menuItems = [
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'publisher', label: 'Publisher', icon: Building2 },
  { key: 'node', label: 'Nghiệp vụ chi nhánh', icon: Users },
  { key: 'attendance', label: 'Chấm công', icon: CalendarClock },
  { key: 'sync', label: 'Đồng bộ', icon: ArrowRightLeft },
];

const defaultBranchForm = {
  maChiNhanh: '',
  tenChiNhanh: '',
  diaChi: '',
  trangThai: true,
};

const defaultPositionForm = {
  maChucVu: '',
  tenChucVu: '',
  heSoLuong: '',
};

const defaultContractTypeForm = {
  maLoaiHopDong: '',
  tenLoaiHopDong: '',
  thoiHanThang: '',
};

const defaultAccountForm = {
  username: '',
  password: '',
  maRole: 'publisher_admin',
  maChiNhanh: '',
};

const defaultEmployeeForm = {
  maNhanVien: '',
  hoTen: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
  sdt: '',
  email: '',
  maPhongBan: '',
  maChucVu: '',
  ngayVaoLam: '',
  maChiNhanh: '',
};

const defaultContractForm = {
  maHopDong: '',
  maNhanVien: '',
  maLoaiHopDong: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'Hieu luc',
};

const defaultAttendanceForm = {
  maNhanVien: '',
  ngay: new Date().toISOString().slice(0, 10),
  gioVao: '08:00:00',
  gioRa: '17:00:00',
};

const defaultLeaveForm = {
  maNhanVien: '',
  tuNgay: new Date().toISOString().slice(0, 10),
  denNgay: new Date().toISOString().slice(0, 10),
  lyDo: '',
};

const defaultLeaveApprovalForm = {
  maNghiPhep: '',
  trangThai: 'DA_DUYET',
};

const defaultSalaryForm = {
  maNhanVien: '',
  thang: new Date().getMonth() + 1,
  nam: new Date().getFullYear(),
  phuCap: '',
  thuong: '',
  khauTru: '',
};

const defaultReportFilters = {
  keyword: '',
  thang: new Date().getMonth() + 1,
  nam: new Date().getFullYear(),
};

function cardClass() {
  return 'rounded-[28px] border border-[var(--hr-border)] bg-[var(--hr-panel)] p-6 shadow-[0_24px_80px_rgba(71,52,40,0.10)] backdrop-blur';
}

function labelFromStatus(status) {
  const text = String(status || '').toLowerCase();

  if (text.includes('hoat dong') || text.includes('healthy') || text.includes('checked') || text.includes('du gio')) {
    return 'success';
  }

  if (text.includes('mat') || text.includes('warning') || text.includes('late') || text.includes('deferred')) {
    return 'warning';
  }

  if (text.includes('tu_choi') || text.includes('error') || text.includes('invalid')) {
    return 'danger';
  }

  return 'neutral';
}

function statusClasses(type) {
  if (type === 'success') return 'bg-[#dfe7d2] text-[#566142]';
  if (type === 'warning') return 'bg-[#f2dfc0] text-[#9b6a28]';
  if (type === 'danger') return 'bg-[#f2d6cf] text-[#9b4331]';
  return 'bg-[#ebe1d7] text-[#6d6258]';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) return 'Chua co';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getInitials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function StatCard({ title, value, hint, icon: Icon, tone = 'blue' }) {
  const palette = {
    blue: 'from-[#b55233] to-[#7a3420]',
    emerald: 'from-[#7f8a63] to-[#586145]',
    amber: 'from-[#d59d54] to-[#a86a2d]',
    slate: 'from-[#5e524a] to-[#2d2622]',
  };

  return (
    <div className={`${cardClass()} relative overflow-hidden`}>
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${palette[tone]}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d7a6b]">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-[var(--hr-ink)]">{value}</p>
          <p className="mt-2 text-sm text-[var(--hr-muted)]">{hint}</p>
        </div>
        <div className="rounded-3xl bg-[#efe3d6] p-3 text-[#6a3d2e]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a4f35]">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hr-ink)]">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--hr-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Panel({ title, subtitle, children, action }) {
  return (
    <section className={cardClass()}>
      <div className="flex flex-col gap-3 border-b border-[#eadbcc] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--hr-ink)]">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-[var(--hr-muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StatusPill({ status }) {
  const tone = labelFromStatus(status);
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(tone)}`}>{status || 'N/A'}</span>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#4e433c]">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[#decebd] bg-[#fbf6ef] px-4 py-3 text-sm text-[var(--hr-ink)] outline-none transition placeholder:text-[#9b8d80] focus:border-[#b55233] focus:bg-white ${props.className || ''}`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-[#decebd] bg-[#fbf6ef] px-4 py-3 text-sm text-[var(--hr-ink)] outline-none transition focus:border-[#b55233] focus:bg-white ${props.className || ''}`}
    />
  );
}

function Button({ children, variant = 'primary', loading = false, ...props }) {
  const styles = {
    primary: 'bg-[#2f2824] text-white hover:bg-[#201a17]',
    secondary: 'bg-[#fff9f2] text-[#3f342d] border border-[#ddcdbc] hover:bg-[#f6ede2]',
    accent: 'bg-[#b55233] text-white hover:bg-[#964228]',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${props.className || ''}`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

function DataTable({ columns, rows, emptyText = 'Không có dữ liệu' }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#dfcfbf]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e8dbce] text-left">
          <thead className="bg-[#f7f0e8]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7768]">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecdfd2] bg-[#fffdf9]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[var(--hr-muted)]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || row.key || index} className="hover:bg-[#f8f1e8]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 text-sm text-[#4f433b]">
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, pending, error }) {
  const [profileKey, setProfileKey] = useState('publisher');
  const [username, setUsername] = useState(API_PROFILES.publisher.defaultUsername);
  const [password, setPassword] = useState(API_PROFILES.publisher.defaultPassword);

  useEffect(() => {
    const profile = API_PROFILES[profileKey];
    setUsername(profile.defaultUsername);
    setPassword(profile.defaultPassword);
  }, [profileKey]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7efe6_0%,#ecdcc8_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-[rgba(255,248,241,0.92)] p-8 shadow-[0_30px_80px_rgba(71,52,40,0.14)]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c7b6c]">DDB HRM</p>
          <h1 className="mt-4 text-3xl font-semibold text-[var(--hr-ink)]">Đăng nhập hệ thống</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--hr-muted)]">
            Vui lòng chọn môi trường làm việc và đăng nhập bằng tài khoản của bạn.
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin({ profileKey, username, password });
          }}
        >
          <Field label="Môi trường">
            <Select value={profileKey} onChange={(event) => setProfileKey(event.target.value)}>
              {Object.values(API_PROFILES).map((profile) => (
                <option key={profile.key} value={profile.key}>
                  {profile.label}
                </option>
              ))}
            </Select>
          </Field>

          <div className="rounded-2xl border border-[#eadbcc] bg-[#fbf5ee] px-4 py-3">
            <p className="text-sm font-semibold text-[#4f433b]">{API_PROFILES[profileKey].label}</p>
            <p className="mt-1 text-sm text-[var(--hr-muted)]">{API_PROFILES[profileKey].description}</p>
            <p className="mt-1 text-xs text-[#8c7b6c]">{API_PROFILES[profileKey].baseUrl}</p>
          </div>

          <Field label="Tên đăng nhập">
            <Input value={username} onChange={(event) => setUsername(event.target.value)} />
          </Field>
          <Field label="Mật khẩu">
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>

          {error ? <p className="rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{error}</p> : null}

          <Button type="submit" variant="accent" loading={pending} className="w-full">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [activePage, setActivePage] = useState('overview');
  const [loginPending, setLoginPending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingKey, setSubmittingKey] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [publisherData, setPublisherData] = useState({
    summary: null,
    sync: [],
    employees: [],
    branches: [],
    positions: [],
    contractTypes: [],
  });
  const [nodeData, setNodeData] = useState({
    report: { employees: [], attendance: [], payroll: [] },
    sync: null,
    health: null,
  });
  const [branchForm, setBranchForm] = useState(defaultBranchForm);
  const [positionForm, setPositionForm] = useState(defaultPositionForm);
  const [contractTypeForm, setContractTypeForm] = useState(defaultContractTypeForm);
  const [accountForm, setAccountForm] = useState(defaultAccountForm);
  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm);
  const [contractForm, setContractForm] = useState(defaultContractForm);
  const [attendanceForm, setAttendanceForm] = useState(defaultAttendanceForm);
  const [leaveForm, setLeaveForm] = useState(defaultLeaveForm);
  const [leaveApprovalForm, setLeaveApprovalForm] = useState(defaultLeaveApprovalForm);
  const [salaryForm, setSalaryForm] = useState(defaultSalaryForm);
  const [reportFilters, setReportFilters] = useState(defaultReportFilters);

  const publisherApi = useMemo(
    () => (session ? createPublisherApi(session.profileKey, session.token) : null),
    [session],
  );
  const nodeApi = useMemo(
    () => (session ? createNodeApi(session.profileKey, session.token) : null),
    [session],
  );

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const isPublisher = session?.profile?.mode === 'publisher';
  const isNode = session?.profile?.mode === 'node';

  const filteredCompanyEmployees = useMemo(() => {
    const source = isPublisher ? publisherData.employees : nodeData.report.employees || [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return source;

    return source.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(keyword),
    );
  }, [isPublisher, publisherData.employees, nodeData.report.employees, search]);

  const branchChartData = useMemo(() => {
    if (!publisherData.summary?.employeeByBranch) return [];
    return publisherData.summary.employeeByBranch.map((item) => ({
      name: item.TenChiNhanh || item.MaChiNhanh,
      employees: Number(item.SoNhanVien || 0),
    }));
  }, [publisherData.summary]);

  const payrollChartData = useMemo(
    () =>
      (nodeData.report.payroll || []).map((item) => ({
        name: item.MaNhanVien,
        salary: Number(item.TongLuong || 0),
      })),
    [nodeData.report.payroll],
  );

  async function loadPublisherData(currentSession) {
    const api = createPublisherApi(currentSession.profileKey, currentSession.token);
    const [summary, sync, employees, branches, positions, contractTypes] = await Promise.all([
      api.summary(),
      api.syncMonitor(),
      api.listEmployees(),
      api.listBranches(),
      api.listPositions(),
      api.listContractTypes(),
    ]);

    setPublisherData({ summary, sync, employees, branches, positions, contractTypes });
  }

  async function loadNodeData(currentSession, filters = reportFilters) {
    const api = createNodeApi(currentSession.profileKey, currentSession.token);
    const [report, health] = await Promise.all([
      api.localReport(filters),
      fetch(`${API_PROFILES[currentSession.profileKey].baseUrl}/health`)
        .then((response) => response.json())
        .catch(() => null),
    ]);

    setNodeData((previous) => ({ ...previous, report, health }));
  }

  async function refreshAll(currentSession = session) {
    if (!currentSession) return;

    setRefreshing(true);
    setError('');

    try {
      if (currentSession.profile.mode === 'publisher') {
        await loadPublisherData(currentSession);
      } else {
        await loadNodeData(currentSession);
      }
    } catch (refreshError) {
      setError(refreshError.message);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (session) {
      refreshAll(session);
    }
  }, [session]);

  async function handleLogin(credentials) {
    setLoginPending(true);
    setError('');

    try {
      const result = await login(credentials.profileKey, {
        username: credentials.username,
        password: credentials.password,
      });

      const nextSession = {
        profileKey: credentials.profileKey,
        profile: API_PROFILES[credentials.profileKey],
        token: result.token,
        user: result.user,
      };

      saveSession(nextSession);
      setSession(nextSession);
      setToast(`Đăng nhập thành công vào ${API_PROFILES[credentials.profileKey].label}`);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoginPending(false);
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setPublisherData({
      summary: null,
      sync: [],
      employees: [],
      branches: [],
      positions: [],
      contractTypes: [],
    });
    setNodeData({
      report: { employees: [], attendance: [], payroll: [] },
      sync: null,
      health: null,
    });
    setError('');
    setToast('');
  }

  async function runAction(key, action, onSuccess) {
    setSubmittingKey(key);
    setError('');

    try {
      const result = await action();
      if (onSuccess) onSuccess(result);
      await refreshAll();
      setToast('Đã cập nhật dữ liệu thành công');
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setSubmittingKey('');
    }
  }

  if (!session) {
    return <LoginScreen onLogin={handleLogin} pending={loginPending} error={error} />;
  }

  const totalEmployees = isPublisher
    ? filteredCompanyEmployees.length
    : (nodeData.report.employees || []).length;
  const totalAttendance = isPublisher
    ? publisherData.sync.length
    : (nodeData.report.attendance || []).reduce((sum, row) => sum + Number(row.SoNgayChamCong || 0), 0);
  const totalPayroll = isPublisher
    ? publisherData.summary?.salaryStats?.TongLuong || 0
    : (nodeData.report.payroll || []).reduce((sum, row) => sum + Number(row.TongLuong || 0), 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(181,82,51,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(127,138,99,0.18),_transparent_30%),linear-gradient(180deg,#f8f1e8_0%,#efdfcd_100%)] text-[var(--hr-ink)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] xl:grid-cols-[300px_minmax(0,1fr)]">
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

        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-6 rounded-[30px] border border-white/70 bg-[rgba(255,248,241,0.72)] px-5 py-4 shadow-[0_20px_50px_rgba(97,74,59,0.12)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a4f35]">Giao diện vận hành</p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--hr-ink)]">Quản lý nhân sự phân tán</h2>
                <p className="mt-2 text-sm text-[var(--hr-muted)]">Frontend đang gọi trực tiếp backend `distributed` theo môi trường đã chọn.</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm nhanh nhân viên, chi nhánh, mã..."
                  className="min-w-[280px] bg-white"
                />
                <Button variant="secondary" loading={refreshing} onClick={() => refreshAll()}>
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>
            </div>
          </header>

          {toast ? <div className="mb-4 rounded-2xl bg-[#dce7d4] px-4 py-3 text-sm text-[#4d5d39]">{toast}</div> : null}
          {error ? <div className="mb-4 rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{error}</div> : null}

          <div className="grid gap-6 xl:grid-cols-3">
            <StatCard title="Nhân sự hiển thị" value={totalEmployees} hint="Số bản ghi có thể thao tác trên giao diện hiện tại." icon={Users} tone="blue" />
            <StatCard title="Tổng chấm công / sync" value={totalAttendance} hint={isPublisher ? 'Số node đang được giám sát từ publisher.' : 'Tổng số ngày chấm công trong kỳ lọc.'} icon={Clock3} tone="emerald" />
            <StatCard title="Quỹ lương" value={formatCurrency(totalPayroll)} hint="Dữ liệu tính từ API tổng hợp hiện có." icon={WalletCards} tone="amber" />
          </div>

          <main className="mt-6 space-y-6">
            {activePage === 'overview' ? (
              <>
                <SectionHeader
                  eyebrow="Tổng quan"
                  title="Tổng quan hệ thống HRM"
                  description="Bộ KPI, biểu đồ và danh sách chính được tạo từ dữ liệu backend thay vì mock data."
                />

                <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                  <Panel title="Phân bổ nhân sự theo chi nhánh" subtitle="Lấy từ `/publisher/reports/summary` nếu đang ở Publisher.">
                    {branchChartData.length > 0 ? (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={branchChartData}>
                            <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                            <XAxis dataKey="name" stroke="#8a7768" />
                            <YAxis stroke="#8a7768" />
                            <Tooltip />
                            <Bar dataKey="employees" radius={[10, 10, 0, 0]}>
                              {branchChartData.map((item, index) => (
                                <Cell key={item.name} fill={index % 2 === 0 ? '#b55233' : '#7f8a63'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--hr-muted)]">Môi trường hiện tại không có dữ liệu tổng hợp theo chi nhánh. Chuyển sang Publisher để xem biểu đồ này.</p>
                    )}
                  </Panel>

                  <Panel title="Trạng thái sync / health" subtitle="Tổng hợp monitor đồng bộ và health endpoint.">
                    <div className="space-y-4">
                      {(isPublisher ? publisherData.sync : []).length > 0 ? (
                        publisherData.sync.map((item) => (
                          <div key={`${item.Node}-${item.LastSyncTime}`} className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-[var(--hr-ink)]">{item.Node}</p>
                                <p className="mt-1 text-sm text-[var(--hr-muted)]">Lần cuối: {formatDateTime(item.LastSyncTime)}</p>
                              </div>
                              <StatusPill status={item.TrangThai} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                          <p className="font-semibold text-[var(--hr-ink)]">Thông tin health</p>
                          <p className="mt-2 text-sm text-[var(--hr-muted)]">Chế độ: {nodeData.health?.mode || session.profile.mode}</p>
                          <p className="mt-1 text-sm text-[var(--hr-muted)]">Thời gian: {formatDateTime(nodeData.health?.timestamp)}</p>
                        </div>
                      )}
                    </div>
                  </Panel>
                </div>

                <Panel title="Danh sách nhân sự / tìm kiếm" subtitle="Publisher dùng `company-search`, Node dùng `reports/local`.">
                  <DataTable
                    columns={[
                      {
                        key: 'identity',
                        label: 'Nhân viên',
                        render: (row) => (
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecd7cb] font-semibold text-[#8a3828]">
                              {getInitials(row.HoTen)}
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--hr-ink)]">{row.HoTen}</p>
                              <p className="text-xs text-[var(--hr-muted)]">{row.MaNhanVien}</p>
                            </div>
                          </div>
                        ),
                      },
                      { key: 'Email', label: 'Email' },
                      { key: 'SDT', label: 'SDT' },
                      {
                        key: 'branch',
                        label: 'Chi nhánh / phòng ban',
                        render: (row) => row.TenChiNhanh || row.TenPhongBan || 'Nội bộ node',
                      },
                    ]}
                    rows={filteredCompanyEmployees}
                  />
                </Panel>

                {payrollChartData.length > 0 ? (
                  <Panel title="Top payroll theo kỳ lọc" subtitle="Lấy từ `/node/reports/local` của node hiện tại.">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={payrollChartData}>
                          <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                          <XAxis dataKey="name" stroke="#8a7768" />
                          <YAxis stroke="#8a7768" />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Line type="monotone" dataKey="salary" stroke="#7a3420" strokeWidth={3} dot={{ r: 4, fill: '#b55233' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                ) : null}
              </>
            ) : null}

            {activePage === 'publisher' ? (
              <>
                <SectionHeader
                  eyebrow="Publisher"
                  title="Dữ liệu dùng chung và tài khoản"
                  description="Các form này gọi trực tiếp endpoint publisher để tạo chi nhánh, chức vụ, loại hợp đồng và tài khoản."
                  action={
                    isPublisher ? (
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          loading={submittingKey === 'publisher-pull'}
                          onClick={() => runAction('publisher-pull', () => publisherApi.triggerNodePull())}
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          {'Node → Publisher'}
                        </Button>
                        <Button
                          variant="accent"
                          loading={submittingKey === 'publisher-push'}
                          onClick={() => runAction('publisher-push', () => publisherApi.triggerNodePush())}
                        >
                          <GitBranch className="h-4 w-4" />
                          {'Publisher → Node'}
                        </Button>
                      </div>
                    ) : null
                  }
                />

                {!isPublisher ? (
                  <Panel title="Không dùng profile Publisher" subtitle="Trang này cần đăng nhập profile Publisher để thao tác dữ liệu dùng chung.">
                    <p className="text-sm text-[var(--hr-muted)]">Đăng nhập lại với `publisher_admin` để sử dụng đầy đủ module này.</p>
                  </Panel>
                ) : (
                  <>
                    <div className="grid gap-6 xl:grid-cols-2">
                      <Panel title="Tạo chi nhánh" subtitle="POST `/publisher/branches`">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            runAction('create-branch', () => publisherApi.createBranch({
                              ...branchForm,
                            }), () => setBranchForm(defaultBranchForm));
                          }}
                        >
                          <Field label="Mã chi nhánh">
                            <Input value={branchForm.maChiNhanh} onChange={(event) => setBranchForm({ ...branchForm, maChiNhanh: event.target.value })} required />
                          </Field>
                          <Field label="Tên chi nhánh">
                            <Input value={branchForm.tenChiNhanh} onChange={(event) => setBranchForm({ ...branchForm, tenChiNhanh: event.target.value })} required />
                          </Field>
                          <Field label="Địa chỉ" >
                            <Input value={branchForm.diaChi} onChange={(event) => setBranchForm({ ...branchForm, diaChi: event.target.value })} className="md:col-span-2" />
                          </Field>
                          <Button type="submit" variant="accent" loading={submittingKey === 'create-branch'} className="md:col-span-2">Tạo chi nhánh</Button>
                        </form>
                      </Panel>

                      <Panel title="Tạo chức vụ" subtitle="POST `/publisher/positions`">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            runAction('create-position', () => publisherApi.createPosition({
                              ...positionForm,
                              heSoLuong: positionForm.heSoLuong ? Number(positionForm.heSoLuong) : undefined,
                            }), () => setPositionForm(defaultPositionForm));
                          }}
                        >
                          <Field label="Mã chức vụ">
                            <Input value={positionForm.maChucVu} onChange={(event) => setPositionForm({ ...positionForm, maChucVu: event.target.value })} required />
                          </Field>
                          <Field label="Tên chức vụ">
                            <Input value={positionForm.tenChucVu} onChange={(event) => setPositionForm({ ...positionForm, tenChucVu: event.target.value })} required />
                          </Field>
                          <Field label="Hệ số lương">
                            <Input type="number" step="0.1" value={positionForm.heSoLuong} onChange={(event) => setPositionForm({ ...positionForm, heSoLuong: event.target.value })} className="md:col-span-2" />
                          </Field>
                          <Button type="submit" variant="accent" loading={submittingKey === 'create-position'} className="md:col-span-2">Tạo chức vụ</Button>
                        </form>
                      </Panel>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      <Panel title="Tạo loại hợp đồng" subtitle="POST `/publisher/contract-types`">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            runAction('create-contract-type', () => publisherApi.createContractType({
                              ...contractTypeForm,
                              thoiHanThang: contractTypeForm.thoiHanThang ? Number(contractTypeForm.thoiHanThang) : undefined,
                            }), () => setContractTypeForm(defaultContractTypeForm));
                          }}
                        >
                          <Field label="Mã loại hợp đồng">
                            <Input value={contractTypeForm.maLoaiHopDong} onChange={(event) => setContractTypeForm({ ...contractTypeForm, maLoaiHopDong: event.target.value })} required />
                          </Field>
                          <Field label="Tên loại hợp đồng">
                            <Input value={contractTypeForm.tenLoaiHopDong} onChange={(event) => setContractTypeForm({ ...contractTypeForm, tenLoaiHopDong: event.target.value })} required />
                          </Field>
                          <Field label="Thời hạn (tháng)">
                            <Input type="number" value={contractTypeForm.thoiHanThang} onChange={(event) => setContractTypeForm({ ...contractTypeForm, thoiHanThang: event.target.value })} className="md:col-span-2" />
                          </Field>
                          <Button type="submit" variant="accent" loading={submittingKey === 'create-contract-type'} className="md:col-span-2">Tạo loại hợp đồng</Button>
                        </form>
                      </Panel>

                      <Panel title="Tạo tài khoản" subtitle="POST `/publisher/accounts`">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            runAction('create-account', () => publisherApi.createAccount(accountForm), () => setAccountForm(defaultAccountForm));
                          }}
                        >
                          <Field label="Tên đăng nhập">
                            <Input value={accountForm.username} onChange={(event) => setAccountForm({ ...accountForm, username: event.target.value })} required />
                          </Field>
                          <Field label="Mật khẩu">
                            <Input type="password" value={accountForm.password} onChange={(event) => setAccountForm({ ...accountForm, password: event.target.value })} required />
                          </Field>
                          <Field label="Vai trò">
                            <Select value={accountForm.maRole} onChange={(event) => setAccountForm({ ...accountForm, maRole: event.target.value })}>
                              <option value="publisher_admin">publisher_admin</option>
                              <option value="hr_manager">hr_manager</option>
                              <option value="viewer">viewer</option>
                              <option value="node_admin">node_admin</option>
                            </Select>
                          </Field>
                          <Field label="Mã chi nhánh">
                            <Input value={accountForm.maChiNhanh} onChange={(event) => setAccountForm({ ...accountForm, maChiNhanh: event.target.value })} />
                          </Field>
                          <Button type="submit" variant="accent" loading={submittingKey === 'create-account'} className="md:col-span-2">Tạo tài khoản</Button>
                        </form>
                      </Panel>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-3">
                      <Panel title="Danh sách chi nhánh">
                        <DataTable columns={[{ key: 'MaChiNhanh', label: 'Mã' }, { key: 'TenChiNhanh', label: 'Tên' }, { key: 'DiaChi', label: 'Địa chỉ' }]} rows={publisherData.branches} />
                      </Panel>
                      <Panel title="Danh sách chức vụ">
                        <DataTable columns={[{ key: 'MaChucVu', label: 'Mã' }, { key: 'TenChucVu', label: 'Tên' }, { key: 'HeSoLuong', label: 'Hệ số lương' }]} rows={publisherData.positions} />
                      </Panel>
                      <Panel title="Loại hợp đồng">
                        <DataTable columns={[{ key: 'MaLoaiHopDong', label: 'Mã' }, { key: 'TenLoaiHopDong', label: 'Tên' }, { key: 'ThoiHanThang', label: 'Thời hạn' }]} rows={publisherData.contractTypes} />
                      </Panel>
                    </div>
                  </>
                )}
              </>
            ) : null}

            {activePage === 'node' ? (
              <>
                <SectionHeader
                  eyebrow="Chi nhánh"
                  title="Nhân viên, hợp đồng, báo cáo local"
                  description="Module này tập trung vào các endpoint node cho HR manager và node admin."
                />

                {!isNode ? (
                  <Panel title="Không dùng profile node" subtitle="Trang này cần đăng nhập profile chi nhánh HCM hoặc Hà Nội.">
                    <p className="text-sm text-[var(--hr-muted)]">Chuyển qua môi trường chi nhánh để tạo nhân viên, hợp đồng và xem báo cáo local.</p>
                  </Panel>
                ) : (
                  <>
                    <div className="grid gap-6 xl:grid-cols-2">
                      <Panel title="Tạo nhân viên" subtitle="POST `/node/employees`">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            runAction('create-employee', () => nodeApi.createEmployee(employeeForm), () => setEmployeeForm(defaultEmployeeForm));
                          }}
                        >
                          <Field label="Mã nhân viên"><Input value={employeeForm.maNhanVien} onChange={(event) => setEmployeeForm({ ...employeeForm, maNhanVien: event.target.value })} required /></Field>
                          <Field label="Họ tên"><Input value={employeeForm.hoTen} onChange={(event) => setEmployeeForm({ ...employeeForm, hoTen: event.target.value })} required /></Field>
                          <Field label="Ngày sinh"><Input type="date" value={employeeForm.ngaySinh} onChange={(event) => setEmployeeForm({ ...employeeForm, ngaySinh: event.target.value })} /></Field>
                          <Field label="Giới tính">
                            <Select value={employeeForm.gioiTinh} onChange={(event) => setEmployeeForm({ ...employeeForm, gioiTinh: event.target.value })}>
                              <option value="Nam">Nam</option>
                              <option value="Nu">Nu</option>
                              <option value="Khac">Khac</option>
                            </Select>
                          </Field>
                          <Field label="SĐT"><Input value={employeeForm.sdt} onChange={(event) => setEmployeeForm({ ...employeeForm, sdt: event.target.value })} /></Field>
                          <Field label="Email"><Input type="email" value={employeeForm.email} onChange={(event) => setEmployeeForm({ ...employeeForm, email: event.target.value })} /></Field>
                          <Field label="Mã phòng ban"><Input value={employeeForm.maPhongBan} onChange={(event) => setEmployeeForm({ ...employeeForm, maPhongBan: event.target.value })} required /></Field>
                          <Field label="Mã chức vụ"><Input value={employeeForm.maChucVu} onChange={(event) => setEmployeeForm({ ...employeeForm, maChucVu: event.target.value })} required /></Field>
                          <Field label="Ngày vào làm"><Input type="date" value={employeeForm.ngayVaoLam} onChange={(event) => setEmployeeForm({ ...employeeForm, ngayVaoLam: event.target.value })} /></Field>
                          <Field label="Mã chi nhánh"><Input value={employeeForm.maChiNhanh} onChange={(event) => setEmployeeForm({ ...employeeForm, maChiNhanh: event.target.value })} required /></Field>
                          <Button type="submit" variant="accent" loading={submittingKey === 'create-employee'} className="md:col-span-2"><UserPlus className="h-4 w-4" />Tạo nhân viên</Button>
                        </form>
                      </Panel>

                      <Panel title="Tạo hợp đồng" subtitle="POST `/node/contracts`">
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            runAction('create-contract', () => nodeApi.createContract(contractForm), () => setContractForm(defaultContractForm));
                          }}
                        >
                          <Field label="Mã hợp đồng"><Input value={contractForm.maHopDong} onChange={(event) => setContractForm({ ...contractForm, maHopDong: event.target.value })} required /></Field>
                          <Field label="Mã nhân viên"><Input value={contractForm.maNhanVien} onChange={(event) => setContractForm({ ...contractForm, maNhanVien: event.target.value })} required /></Field>
                          <Field label="Mã loại hợp đồng"><Input value={contractForm.maLoaiHopDong} onChange={(event) => setContractForm({ ...contractForm, maLoaiHopDong: event.target.value })} required /></Field>
                          <Field label="Trạng thái"><Input value={contractForm.trangThai} onChange={(event) => setContractForm({ ...contractForm, trangThai: event.target.value })} /></Field>
                          <Field label="Ngày bắt đầu"><Input type="date" value={contractForm.ngayBatDau} onChange={(event) => setContractForm({ ...contractForm, ngayBatDau: event.target.value })} /></Field>
                          <Field label="Ngày kết thúc"><Input type="date" value={contractForm.ngayKetThuc} onChange={(event) => setContractForm({ ...contractForm, ngayKetThuc: event.target.value })} /></Field>
                          <Button type="submit" variant="accent" loading={submittingKey === 'create-contract'} className="md:col-span-2"><FileText className="h-4 w-4" />Tạo hợp đồng</Button>
                        </form>
                      </Panel>
                    </div>

                    <Panel
                      title="Bộ lọc báo cáo local"
                      subtitle="GET `/node/reports/local`"
                      action={
                        <Button
                          variant="secondary"
                          loading={submittingKey === 'filter-report'}
                          onClick={() =>
                            runAction('filter-report', () => nodeApi.localReport(reportFilters), (result) =>
                              setNodeData((previous) => ({ ...previous, report: result })),
                            )
                          }
                        >
                          <RefreshCw className="h-4 w-4" />
                          Nạp báo cáo
                        </Button>
                      }
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Từ khóa"><Input value={reportFilters.keyword} onChange={(event) => setReportFilters({ ...reportFilters, keyword: event.target.value })} /></Field>
                        <Field label="Thang"><Input type="number" value={reportFilters.thang} onChange={(event) => setReportFilters({ ...reportFilters, thang: Number(event.target.value) })} /></Field>
                        <Field label="Nam"><Input type="number" value={reportFilters.nam} onChange={(event) => setReportFilters({ ...reportFilters, nam: Number(event.target.value) })} /></Field>
                      </div>
                    </Panel>

                    <div className="grid gap-6 xl:grid-cols-3">
                      <Panel title="Nhân viên local">
                        <DataTable columns={[{ key: 'MaNhanVien', label: 'Mã' }, { key: 'HoTen', label: 'Họ tên' }, { key: 'Email', label: 'Email' }]} rows={nodeData.report.employees || []} />
                      </Panel>
                      <Panel title="Tổng hợp chấm công">
                        <DataTable columns={[{ key: 'MaNhanVien', label: 'Mã' }, { key: 'SoNgayChamCong', label: 'Số ngày' }]} rows={nodeData.report.attendance || []} />
                      </Panel>
                      <Panel title="Tổng hợp lương">
                        <DataTable columns={[{ key: 'MaNhanVien', label: 'Mã' }, { key: 'TongLuong', label: 'Tổng lương', render: (row) => formatCurrency(row.TongLuong) }]} rows={nodeData.report.payroll || []} />
                      </Panel>
                    </div>
                  </>
                )}
              </>
            ) : null}

            {activePage === 'attendance' ? (
              <>
                <SectionHeader
                  eyebrow="Attendance"
                  title="Chấm công, nghỉ phép, tính lương"
                  description="Toàn bộ thao tác nghiệp vụ node được gom vào một khu giao diện để nhập nhanh."
                />

                {!isNode ? (
                  <Panel title="Cần profile node" subtitle="Chấm công và tính lương là endpoint của node.">
                    <p className="text-sm text-[var(--hr-muted)]">Đăng nhập môi trường chi nhánh để sử dụng module này.</p>
                  </Panel>
                ) : (
                  <div className="grid gap-6 xl:grid-cols-2">
                    <Panel title="Check-in / Check-out" subtitle="POST `/node/attendance/check-in` và `/check-out`">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Mã nhân viên"><Input value={attendanceForm.maNhanVien} onChange={(event) => setAttendanceForm({ ...attendanceForm, maNhanVien: event.target.value })} /></Field>
                        <Field label="Ngày"><Input type="date" value={attendanceForm.ngay} onChange={(event) => setAttendanceForm({ ...attendanceForm, ngay: event.target.value })} /></Field>
                        <Field label="Giờ vào"><Input value={attendanceForm.gioVao} onChange={(event) => setAttendanceForm({ ...attendanceForm, gioVao: event.target.value })} /></Field>
                        <Field label="Giờ ra"><Input value={attendanceForm.gioRa} onChange={(event) => setAttendanceForm({ ...attendanceForm, gioRa: event.target.value })} /></Field>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="accent"
                          loading={submittingKey === 'checkin'}
                          onClick={() => runAction('checkin', () => nodeApi.checkIn({
                            maNhanVien: attendanceForm.maNhanVien,
                            ngay: attendanceForm.ngay,
                            gioVao: attendanceForm.gioVao,
                          }))}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Chấm công vào
                        </Button>
                        <Button
                          variant="secondary"
                          loading={submittingKey === 'checkout'}
                          onClick={() => runAction('checkout', () => nodeApi.checkOut({
                            maNhanVien: attendanceForm.maNhanVien,
                            ngay: attendanceForm.ngay,
                            gioRa: attendanceForm.gioRa,
                          }))}
                        >
                          <Clock3 className="h-4 w-4" />
                          Chấm công ra
                        </Button>
                      </div>
                    </Panel>

                    <Panel title="Nghỉ phép" subtitle="POST `/node/leaves` và PUT `/node/leaves/:id/approval`">
                      <div className="grid gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Mã nhân viên"><Input value={leaveForm.maNhanVien} onChange={(event) => setLeaveForm({ ...leaveForm, maNhanVien: event.target.value })} /></Field>
                          <Field label="Lý do"><Input value={leaveForm.lyDo} onChange={(event) => setLeaveForm({ ...leaveForm, lyDo: event.target.value })} /></Field>
                          <Field label="Từ ngày"><Input type="date" value={leaveForm.tuNgay} onChange={(event) => setLeaveForm({ ...leaveForm, tuNgay: event.target.value })} /></Field>
                          <Field label="Đến ngày"><Input type="date" value={leaveForm.denNgay} onChange={(event) => setLeaveForm({ ...leaveForm, denNgay: event.target.value })} /></Field>
                        </div>
                        <Button
                          variant="accent"
                          loading={submittingKey === 'leave-request'}
                          onClick={() => runAction('leave-request', () => nodeApi.createLeave(leaveForm), (result) =>
                            setLeaveApprovalForm((previous) => ({ ...previous, maNghiPhep: String(result.maNghiPhep || '') })),
                          )}
                        >
                          Gửi đơn nghỉ phép
                        </Button>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Mã nghỉ phép"><Input value={leaveApprovalForm.maNghiPhep} onChange={(event) => setLeaveApprovalForm({ ...leaveApprovalForm, maNghiPhep: event.target.value })} /></Field>
                          <Field label="Trạng thái">
                            <Select value={leaveApprovalForm.trangThai} onChange={(event) => setLeaveApprovalForm({ ...leaveApprovalForm, trangThai: event.target.value })}>
                              <option value="DA_DUYET">DA_DUYET</option>
                              <option value="TU_CHOI">TU_CHOI</option>
                            </Select>
                          </Field>
                        </div>
                        <Button
                          variant="secondary"
                          loading={submittingKey === 'leave-approval'}
                          onClick={() => runAction('leave-approval', () => nodeApi.approveLeave(leaveApprovalForm.maNghiPhep, {
                            trangThai: leaveApprovalForm.trangThai,
                          }))}
                        >
                          Duyệt / từ chối đơn
                        </Button>
                      </div>
                    </Panel>

                    <Panel title="Tính lương" subtitle="POST `/node/salaries/generate`">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Mã nhân viên"><Input value={salaryForm.maNhanVien} onChange={(event) => setSalaryForm({ ...salaryForm, maNhanVien: event.target.value })} /></Field>
                        <Field label="Tháng"><Input type="number" value={salaryForm.thang} onChange={(event) => setSalaryForm({ ...salaryForm, thang: Number(event.target.value) })} /></Field>
                        <Field label="Năm"><Input type="number" value={salaryForm.nam} onChange={(event) => setSalaryForm({ ...salaryForm, nam: Number(event.target.value) })} /></Field>
                        <Field label="Phụ cấp"><Input type="number" value={salaryForm.phuCap} onChange={(event) => setSalaryForm({ ...salaryForm, phuCap: event.target.value })} /></Field>
                        <Field label="Thưởng"><Input type="number" value={salaryForm.thuong} onChange={(event) => setSalaryForm({ ...salaryForm, thuong: event.target.value })} /></Field>
                        <Field label="Khấu trừ"><Input type="number" value={salaryForm.khauTru} onChange={(event) => setSalaryForm({ ...salaryForm, khauTru: event.target.value })} /></Field>
                      </div>
                      <Button
                        variant="accent"
                        className="mt-4"
                        loading={submittingKey === 'salary'}
                        onClick={() => runAction('salary', () => nodeApi.generateSalary({
                          maNhanVien: salaryForm.maNhanVien,
                          thang: Number(salaryForm.thang),
                          nam: Number(salaryForm.nam),
                          phuCap: salaryForm.phuCap ? Number(salaryForm.phuCap) : 0,
                          thuong: salaryForm.thuong ? Number(salaryForm.thuong) : 0,
                          khauTru: salaryForm.khauTru ? Number(salaryForm.khauTru) : 0,
                        }))}
                      >
                        <BadgeDollarSign className="h-4 w-4" />
                        Tính lương
                      </Button>
                    </Panel>

                    <Panel title="Lương theo nhân viên" subtitle="Biểu đồ từ kết quả báo cáo local đang nạp.">
                      {payrollChartData.length > 0 ? (
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={payrollChartData}>
                              <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                              <XAxis dataKey="name" stroke="#8a7768" />
                              <YAxis stroke="#8a7768" />
                              <Tooltip formatter={(value) => formatCurrency(value)} />
                              <Bar dataKey="salary" fill="#b55233" radius={[10, 10, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-sm text-[var(--hr-muted)]">Chưa có dữ liệu payroll trong kỳ lọc hiện tại.</p>
                      )}
                    </Panel>
                  </div>
                )}
              </>
            ) : null}

            {activePage === 'sync' ? (
              <>
                <SectionHeader
                  eyebrow="Đồng bộ"
                  title="Đồng bộ hai chiều"
                  description="Có thể monitor ở Publisher hoặc trigger sync trực tiếp ở node."
                />

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <Panel title="Trạng thái đồng bộ">
                    {isPublisher ? (
                      <DataTable
                        columns={[
                          { key: 'Node', label: 'Node' },
                          { key: 'LastSyncTime', label: 'Lần cuối', render: (row) => formatDateTime(row.LastSyncTime) },
                          { key: 'TrangThai', label: 'Trạng thái', render: (row) => <StatusPill status={row.TrangThai} /> },
                        ]}
                        rows={publisherData.sync}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                          <p className="font-semibold text-[var(--hr-ink)]">Health</p>
                          <p className="mt-2 text-sm text-[var(--hr-muted)]">Chế độ: {nodeData.health?.mode || 'node'}</p>
                          <p className="mt-1 text-sm text-[var(--hr-muted)]">Thời gian: {formatDateTime(nodeData.health?.timestamp)}</p>
                        </div>
                        {nodeData.sync?.error ? (
                          <div className="rounded-[24px] bg-[#f2dfc0] p-4 text-sm text-[#9b6a28]">{nodeData.sync.error}</div>
                        ) : null}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Tác vụ sync" subtitle="Dùng cho cả publisher và node profile.">
                    <div className="space-y-3">
                      <Button
                        variant="accent"
                        className="w-full"
                        loading={submittingKey === 'sync-up'}
                        onClick={() =>
                          runAction('sync-up', () =>
                            (isPublisher ? publisherApi.triggerNodePull() : nodeApi.syncToPublisher()), (result) =>
                              setNodeData((previous) => ({ ...previous, sync: result })),
                          )
                        }
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                        Đẩy dữ liệu lên Publisher
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full"
                        loading={submittingKey === 'sync-down'}
                        onClick={() =>
                          runAction('sync-down', () =>
                            (isPublisher ? publisherApi.triggerNodePush() : nodeApi.syncFromPublisher()), (result) =>
                              setNodeData((previous) => ({ ...previous, sync: result })),
                          )
                        }
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Kéo dữ liệu từ Publisher
                      </Button>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                      <p className="font-semibold text-[var(--hr-ink)]">Kết quả lần chạy gần nhất</p>
                      {nodeData.sync ? (
                        <div className="mt-3 space-y-2 text-sm text-[#5f534b]">
                          <p>Tổng: {nodeData.sync.total ?? nodeData.sync.nodeToPublisher?.total ?? 0}</p>
                          <p>Đã đồng bộ: {nodeData.sync.synced ?? nodeData.sync.nodeToPublisher?.synced ?? 0}</p>
                          <p>Xung đột: {nodeData.sync.conflicts ?? nodeData.sync.nodeToPublisher?.conflicts ?? 0}</p>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-[var(--hr-muted)]">Chưa chạy sync từ giao diện.</p>
                      )}
                    </div>
                  </Panel>
                </div>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
