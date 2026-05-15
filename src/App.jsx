import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { API_PROFILES, clearSession, createNodeApi, createPublisherApi, fetchHealth, loadSession, login, saveSession } from './lib/api';
import LoginScreen from './pages/Login';
import Overview from './pages/Overview';
import Publisher from './pages/Publisher';
import NodePage from './pages/Node';
import Attendance from './pages/Attendance';
import Sync from './pages/Sync';
import Employees from './pages/Employees';
import Positions from './pages/Positions';
import Contracts from './pages/Contracts';
import Salary from './pages/Salary';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/layout/DashboardStats';
import { SEED_EMPLOYEES } from './data/employees';

export default function App() {
  const location = useLocation();
  const [session, setSession] = useState(loadSession);
  const [ui, setUi] = useState({ load: false, submit: '', err: '', msg: '', search: '' });
  const [pub, setPub] = useState({ summary: null, sync: [], employees: [], branches: [], positions: [], contractTypes: [] });
  const [node, setNode] = useState({ report: { employees: [], attendance: [], payroll: [] }, sync: null, health: null });
  const [leaves, setLeaves] = useState([]);
  const [localEmps, setLocalEmps] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [empMeta, setEmpMeta] = useState(() => {
    try {
      const saved = localStorage.getItem('ddb-emp-meta');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('ddb-emp-meta', JSON.stringify(empMeta));
  }, [empMeta]);

  useEffect(() => {
    if (!ui.msg) return;
    const t = setTimeout(() => setUi(p => ({ ...p, msg: '' })), 3200);
    return () => clearTimeout(t);
  }, [ui.msg]);

  const refreshAll = async (s = session) => {
    if (!s) return;
    setUi(p => ({ ...p, load: true, err: '' }));
    try {
      if (s.profile.mode === 'publisher') {
        const a = createPublisherApi(s.profileKey, s.token);
        const [summary, sync, employees, branches, positions, contractTypes] = await Promise.all([
          a.summary(), a.syncMonitor(), a.listEmployees(), a.listBranches(), a.listPositions(), a.listContractTypes()
        ]);
        setPub({ summary, sync, employees, branches, positions, contractTypes });
      } else {
        const a = createNodeApi(s.profileKey, s.token);
        const d = new Date();
        const [report, health] = await Promise.all([
          a.localReport({ keyword: '', thang: d.getMonth() + 1, nam: d.getFullYear() }),
          fetchHealth(s.profileKey).catch(() => null),
        ]);
        setNode(p => ({ ...p, report, health }));
        setLocalEmps(report?.employees || []);
        setSyncStatus(null);
      }
    } catch (e) {
      if (/token|Unauthorized/i.test(e.message)) handleLogout('Phiên hết hạn.');
      else setUi(p => ({ ...p, err: e.message }));
    } finally { setUi(p => ({ ...p, load: false })); }
  };

  useEffect(() => { refreshAll(); }, [session]);

  const handleLogin = async ({ profileKey, username, password }) => {
    setUi(p => ({ ...p, load: true, err: '' }));
    try {
      const { token, user } = await login(profileKey, { username, password });
      const s = { profileKey, profile: API_PROFILES[profileKey], token, user };
      saveSession(s); setSession(s);
      setUi(p => ({ ...p, msg: `Đăng nhập thành công ${API_PROFILES[profileKey].label}` }));
    } catch (e) { setUi(p => ({ ...p, err: e.message })); }
    finally { setUi(p => ({ ...p, load: false })); }
  };

  const handleLogout = (msg = '') => {
    clearSession(); setSession(null);
    setPub({ summary: null, sync: [], employees: [], branches: [], positions: [], contractTypes: [] });
    setNode({ report: { employees: [], attendance: [], payroll: [] }, sync: null, health: null });
    setLeaves([]); setLocalEmps([]); setSyncStatus(null);
    setUi(p => ({ ...p, err: '', msg }));
  };

  const runAction = async (key, action, onOk) => {
    setUi(p => ({ ...p, submit: key, err: '' }));
    try {
      const res = await action();
      if (onOk) onOk(res);
      if (key === 'leave-request' && res?.maNghiPhep) {
        setLeaves((previous) => [
          {
            MaNghiPhep: res.maNghiPhep,
            MaNhanVien: res.maNhanVien,
            TuNgay: res.tuNgay,
            DenNgay: res.denNgay,
            LyDo: res.lyDo,
            TrangThai: 'CHO_DUYET',
          },
          ...previous,
        ]);
      }
      if (key === 'leave-approval') {
        setLeaves((previous) =>
          previous.map((item) =>
            String(item.MaNghiPhep) === String(res?.maNghiPhep)
              ? { ...item, TrangThai: res?.trangThai || item.TrangThai }
              : item,
          ),
        );
      }
      await refreshAll();
      setUi(p => ({ ...p, msg: 'Cập nhật thành công' }));
    } catch (e) {
      if (/token|Unauthorized/i.test(e.message)) handleLogout('Phiên hết hạn.');
      else setUi(p => ({ ...p, err: e.message }));
    } finally { setUi(p => ({ ...p, submit: '' })); }
  };

  if (!session) return <LoginScreen onLogin={handleLogin} pending={ui.load} error={ui.err} />;

  const isPub = session.profile.mode === 'publisher', isNode = !isPub;
  const kw = ui.search.trim().toLowerCase();
  const emps = isPub ? pub.employees : (node.report.employees || []);
  const saveEmpMeta = (id, data) => setEmpMeta(p => ({ ...p, [id]: data }));

  const hydrate = (list) => (list || []).map(item => {
    const itemId = String(item.MaNhanVien || '').toUpperCase();
    
    // Nguon 1: Tu bo nho dem (Local Metadata)
    const metaKey = Object.keys(empMeta).find(k => k.toUpperCase() === itemId);
    const meta = metaKey ? empMeta[metaKey] : null;

    // Nguon 2: Tu du lieu Publisher (neu co)
    const pubEmp = (pub.employees || []).find(e => String(e.MaNhanVien || '').toUpperCase() === itemId);

    // Nguon 3: Tu SEED data
    const seedEmp = (SEED_EMPLOYEES || []).find(e => String(e.MaNhanVien || '').toUpperCase() === itemId);

    const source = { ...seedEmp, ...pubEmp, ...meta };

    return {
      ...item,
      SDT: item.SDT || source.SDT || source.sdt,
      Email: item.Email || source.Email || source.email,
      NgaySinh: item.NgaySinh || source.NgaySinh || source.ngaySinh,
      NgayVaoLam: item.NgayVaoLam || source.NgayVaoLam || source.ngayVaoLam,
      MaChiNhanh: item.MaChiNhanh || source.MaChiNhanh || source.maChiNhanh,
      TenChiNhanh: item.TenChiNhanh || source.TenChiNhanh || source.tenChiNhanh,
      TenPhongBan: item.TenPhongBan || source.TenPhongBan || source.tenPhongBan,
      TenChucVu: item.TenChucVu || source.TenChucVu || source.tenChucVu,
      MaPhongBan: item.MaPhongBan || source.MaPhongBan || source.maPhongBan,
      MaChucVu: item.MaChucVu || source.MaChucVu || source.maChucVu,
      TrangThai: item.TrangThai || source.TrangThai || source.trangThai || 'Hoat dong',
    };
  });

  const hydratedEmps = hydrate(emps);
  const filteredEmps = kw ? hydratedEmps.filter(i => JSON.stringify(i).toLowerCase().includes(kw)) : hydratedEmps;
  const branchChart = (pub.summary?.employeeByBranch || []).map(i => ({ name: i.TenChiNhanh || i.MaChiNhanh, employees: Number(i.SoNhanVien || 0) }));
  const payrollChart = (node.report.payroll || []).map(i => ({ name: i.MaNhanVien, salary: Number(i.TongLuong || 0) }));
  const attList = isPub ? pub.sync : (node.report.attendance || []);
  const totalAtt = isPub ? attList.length : attList.reduce((s, r) => s + Number(r.SoNgayChamCong || 0), 0);
  const totalPay = isPub ? (pub.summary?.salaryStats?.TongLuong || 0) : payrollChart.reduce((s, r) => s + r.salary, 0);

  const apiProps = { publisherApi: isPub ? createPublisherApi(session.profileKey, session.token) : null, nodeApi: isNode ? createNodeApi(session.profileKey, session.token) : null };
  const sharedProps = { isPublisher: isPub, isNode, session, runAction, submittingKey: ui.submit, publisherData: pub, nodeData: node, saveEmpMeta };

  const pageMeta = {
    '/': 'Tổng quan',
    '/publisher': 'Publisher',
    '/employees': 'Nghiệp vụ chi nhánh',
    '/node': 'Nghiệp vụ node',
    '/attendance': 'Chấm công',
    '/positions': 'Chức vụ',
    '/contracts': 'Hợp đồng',
    '/salary': 'Lương',
    '/sync': 'Đồng bộ',
  };
  const breadcrumb = pageMeta[location.pathname] || 'Tổng quan';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(181,82,51,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(127,138,99,0.18),_transparent_30%),linear-gradient(180deg,#f8f1e8_0%,#efdfcd_100%)] text-[var(--hr-ink)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] xl:grid-cols-[300px_minmax(0,1fr)]">
        <Sidebar session={session} handleLogout={() => handleLogout()} />
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <Header
            breadcrumb={breadcrumb}
            search={ui.search}
            setSearch={search => setUi(p => ({ ...p, search }))}
            refreshing={ui.load}
            refreshAll={() => refreshAll()}
          />
          {ui.msg && <div className="mb-4 rounded-2xl bg-[#dce7d4] px-4 py-3 text-sm text-[#4d5d39]">{ui.msg}</div>}
          {ui.err && <div className="mb-4 rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{ui.err}</div>}
          <DashboardStats totalEmployees={isPub ? filteredEmps.length : (node.report.employees || []).length} totalAttendance={totalAtt} totalPayroll={totalPay} isPublisher={isPub} />
          <main className="mt-6 space-y-6">
            <Routes>
              <Route
                path="/"
                element={<Overview {...sharedProps} filteredCompanyEmployees={filteredEmps} branchChartData={branchChart} payrollChartData={payrollChart} />}
              />
              <Route
                path="/publisher"
                element={isPub ? <Publisher {...sharedProps} {...apiProps} /> : <Navigate to="/" replace />}
              />
              <Route
                path="/employees"
                element={(
                  <Employees
                    employees={filteredEmps}
                    searchKeyword={kw}
                    isNode={isNode}
                    nodeApi={apiProps.nodeApi}
                    publisherApi={apiProps.publisherApi}
                    publisherData={pub}
                    session={session}
                    runAction={runAction}
                    submittingKey={ui.submit}
                    saveEmpMeta={saveEmpMeta}
                  />
                )}
              />
              <Route
                path="/node"
                element={<NodePage {...sharedProps} {...apiProps} setNodeData={setNode} localEmployees={hydrate(localEmps)} />}
              />
              <Route
                path="/attendance"
                element={isNode ? <Attendance {...sharedProps} {...apiProps} leaves={leaves} localEmployees={hydrate(localEmps)} payrollChartData={payrollChart} /> : <Navigate to="/" replace />}
              />
              <Route
                path="/positions"
                element={<Positions {...sharedProps} {...apiProps} />}
              />
              <Route
                path="/contracts"
                element={<Contracts {...sharedProps} {...apiProps} />}
              />
              <Route
                path="/salary"
                element={<Salary {...sharedProps} {...apiProps} setNodeData={setNode} localEmployees={hydrate(localEmps)} payrollChartData={payrollChart} />}
              />
              <Route
                path="/sync"
                element={<Sync {...sharedProps} {...apiProps} setNodeData={setNode} syncStatus={syncStatus} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
