import { useEffect, useState } from 'react';
import { API_PROFILES, clearSession, createNodeApi, createPublisherApi, fetchHealth, loadSession, login, saveSession } from './lib/api';
import LoginScreen from './pages/Login';
import Overview from './pages/Overview';
import Publisher from './pages/Publisher';
import NodePage from './pages/Node';
import Attendance from './pages/Attendance';
import Sync from './pages/Sync';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/layout/DashboardStats';

export default function App() {
  const [session, setSession] = useState(loadSession);
  const [ui, setUi] = useState({ page: 'overview', load: false, submit: '', err: '', msg: '', search: '' });
  const [pub, setPub] = useState({ summary: null, sync: [], employees: [], branches: [], positions: [], contractTypes: [], departments: [] });
  const [node, setNode] = useState({ report: { employees: [], attendance: [], payroll: [] }, sync: null, health: null, branches: [], positions: [], contractTypes: [], departments: [] });
  const [leaves, setLeaves] = useState([]);
  const [localEmps, setLocalEmps] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  const [reportFilters, setReportFilters] = useState({ keyword: '', thang: new Date().getMonth() + 1, nam: new Date().getFullYear() });

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
        const [report, health, branches, positions, contractTypes, departments, detailedEmps] = await Promise.all([
          a.localReport(reportFilters),
          fetchHealth(s.profileKey).catch(() => null),
          a.listBranches().catch(e => { console.error('Lỗi listBranches:', e.message); return []; }),
          a.listPositions().catch(e => { console.error('Lỗi listPositions:', e.message); return []; }),
          a.listContractTypes().catch(e => { console.error('Lỗi listContractTypes:', e.message); return []; }),
          a.listDepartments().catch(e => { console.error('Lỗi listDepartments:', e.message); return []; }),
          a.listEmployees().catch(e => { console.error('Lỗi listEmployees:', e.message); return []; }),
        ]);
        setNode(p => ({ ...p, report, health, branches, positions, contractTypes, departments }));
        setLocalEmps(detailedEmps.length > 0 ? detailedEmps : (report?.employees || []));
        setSyncStatus(null);
      }
    } catch (e) {
      if (/token|Unauthorized/i.test(e.message)) handleLogout('Phiên hết hạn.');
      else setUi(p => ({ ...p, err: e.message }));
    } finally { setUi(p => ({ ...p, load: false })); }
  };

  useEffect(() => { refreshAll(); }, [session, reportFilters]);

  const handleLogin = async ({ profileKey, username, password }) => {
    setUi(p => ({ ...p, load: true, err: '' }));
    try {
      const { token, user } = await login(profileKey, { username, password });
      const s = { profileKey, profile: API_PROFILES[profileKey], token, user };
      saveSession(s); setSession(s);
      setUi(p => ({ ...p, page: 'overview', msg: `Đăng nhập thành công ${API_PROFILES[profileKey].label}` }));
    } catch (e) { setUi(p => ({ ...p, err: e.message })); }
    finally { setUi(p => ({ ...p, load: false })); }
  };

  const handleLogout = (msg = '') => {
    clearSession(); setSession(null);
    setPub({ summary: null, sync: [], employees: [], branches: [], positions: [], contractTypes: [] });
    setNode({ report: { employees: [], attendance: [], payroll: [] }, sync: null, health: null, branches: [], positions: [], contractTypes: [], departments: [] });
    setLeaves([]); setLocalEmps([]); setSyncStatus(null);
    setUi(p => ({ ...p, page: 'overview', err: '', msg }));
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
  const filteredEmps = kw ? emps.filter(i => JSON.stringify(i).toLowerCase().includes(kw)) : emps;
  const branchChart = (pub.summary?.employeeByBranch || []).map(i => ({ name: i.TenChiNhanh || i.MaChiNhanh, employees: Number(i.SoNhanVien || 0) }));
  const payrollChart = (node.report.payroll || []).map(i => ({ name: i.MaNhanVien, salary: Number(i.TongLuong || 0) }));
  const attList = isPub ? pub.sync : (node.report.attendance || []);
  const totalAtt = isPub ? attList.length : attList.reduce((s, r) => s + Number(r.SoNgayChamCong || 0), 0);
  const totalPay = isPub ? (pub.summary?.salaryStats?.TongLuong || 0) : payrollChart.reduce((s, r) => s + r.salary, 0);

  const apiProps = { publisherApi: isPub ? createPublisherApi(session.profileKey, session.token) : null, nodeApi: isNode ? createNodeApi(session.profileKey, session.token) : null };
  const sharedProps = { isPublisher: isPub, isNode, session, runAction, submittingKey: ui.submit, publisherData: pub, nodeData: node, setNodeData: setNode, reportFilters, setReportFilters };

  const pages = {
    overview: <Overview {...sharedProps} {...apiProps} filteredCompanyEmployees={filteredEmps} branchChartData={branchChart} />,
    ...(isPub ? { publisher: <Publisher {...sharedProps} {...apiProps} /> } : {}),
    node: <NodePage {...sharedProps} {...apiProps} setNodeData={setNode} localEmployees={localEmps} publisherData={pub} reportFilters={reportFilters} setReportFilters={setReportFilters} />,
    attendance: <Attendance {...sharedProps} {...apiProps} setNodeData={setNode} leaves={leaves} localEmployees={localEmps} payrollChartData={payrollChart} />,
    sync: <Sync {...sharedProps} {...apiProps} setNodeData={setNode} syncStatus={syncStatus} />
  };

  const activePage = pages[ui.page] ? ui.page : 'overview';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(181,82,51,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(127,138,99,0.18),_transparent_30%),linear-gradient(180deg,#f8f1e8_0%,#efdfcd_100%)] text-[var(--hr-ink)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] xl:grid-cols-[300px_minmax(0,1fr)]">
        <Sidebar session={session} activePage={activePage} setActivePage={page => setUi(p => ({ ...p, page }))} handleLogout={() => handleLogout()} />
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <Header search={ui.search} setSearch={search => setUi(p => ({ ...p, search }))} refreshing={ui.load} refreshAll={() => refreshAll()} />
          {ui.msg && <div className="mb-4 rounded-2xl bg-[#dce7d4] px-4 py-3 text-sm text-[#4d5d39]">{ui.msg}</div>}
          {ui.err && <div className="mb-4 rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{ui.err}</div>}
          <DashboardStats totalEmployees={isPub ? filteredEmps.length : (node.report.employees || []).length} totalAttendance={totalAtt} totalPayroll={totalPay} isPublisher={isPub} />
          <main className="mt-6 space-y-6">{pages[activePage]}</main>
        </div>
      </div>
    </div>
  );
}
