import { ArrowUpRight, CheckCircle2, CircleDollarSign, Clock3, ShieldCheck, TrendingUp, Wifi } from 'lucide-react';

export const summaryCards = [
  {
    title: 'Total Employees',
    value: '128',
    delta: '+8%',
    icon: 'Users',
  },
  {
    title: 'Active Nodes',
    value: '16',
    delta: '+5%',
    icon: 'Server',
  },
  {
    title: 'Attendance Today',
    value: '104',
    delta: '+12%',
    icon: 'CheckCircle',
  },
];

export const lineChartData = [
  { date: 'Mon', attendance: 82, sync: 90 },
  { date: 'Tue', attendance: 88, sync: 92 },
  { date: 'Wed', attendance: 95, sync: 89 },
  { date: 'Thu', attendance: 90, sync: 94 },
  { date: 'Fri', attendance: 97, sync: 96 },
  { date: 'Sat', attendance: 78, sync: 85 },
  { date: 'Sun', attendance: 85, sync: 88 },
];

export const syncNodes = [
  { name: 'Node A', status: 'Up to date', lastSync: '2 min ago' },
  { name: 'Node B', status: 'Syncing', lastSync: '45 sec ago' },
  { name: 'Node C', status: 'Delayed', lastSync: '14 min ago' },
  { name: 'Node D', status: 'Up to date', lastSync: '4 min ago' },
];

export const nodeKpis = [
  { title: 'Total Revenue', value: '$82K', description: 'Monthly sync revenue generated.', icon: CircleDollarSign },
  { title: 'Nodes Online', value: '18', description: 'Nodes currently connected.', icon: Wifi },
  { title: 'Health Score', value: '95%', description: 'Overall system health.', icon: ShieldCheck },
  { title: 'Sync Rate', value: '88%', description: 'Average successful sync rate.', icon: TrendingUp },
];

export const attendanceRows = [
  { name: 'Elena Hunter', status: 'Checked in', time: '08:15 AM' },
  { name: 'Mark Holloway', status: 'Absent', time: '-' },
  { name: 'Priya Kumar', status: 'Checked in', time: '08:48 AM' },
  { name: 'Oliver Smith', status: 'Checked out', time: '05:12 PM' },
];

export const notifications = [
  { title: 'Sync node updated', subtitle: 'Node C completed a full sync.', icon: CheckCircle2 },
  { title: 'Security check', subtitle: 'All connection checks passed.', icon: ShieldCheck },
  { title: 'Alert resolved', subtitle: 'Backup sync finished successfully.', icon: ArrowUpRight },
];

export const attendanceChart = [
  { day: 'Mon', count: 60 },
  { day: 'Tue', count: 75 },
  { day: 'Wed', count: 80 },
  { day: 'Thu', count: 72 },
  { day: 'Fri', count: 88 },
  { day: 'Sat', count: 54 },
  { day: 'Sun', count: 65 },
];

export const employeeRows = [
  { initials: 'ER', name: 'Eva Roberts', email: 'eva@example.com', role: 'HR Manager', status: 'Active' },
  { initials: 'JS', name: 'Jason Scott', email: 'jason@example.com', role: 'Developer', status: 'Active' },
  { initials: 'MT', name: 'Mia Tran', email: 'mia@example.com', role: 'Designer', status: 'On leave' },
  { initials: 'LK', name: 'Linh Kim', email: 'linh@example.com', role: 'Support', status: 'Active' },
];

export const attendanceHistory = [
  { day: 'Monday', status: 'Checked in', time: '08:12 AM' },
  { day: 'Tuesday', status: 'Checked in', time: '08:05 AM' },
  { day: 'Wednesday', status: 'Checked in', time: '08:28 AM' },
  { day: 'Thursday', status: 'Checked out', time: '05:10 PM' },
];

export const attendanceTrend = [
  { day: 'Mon', value: 78 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 82 },
  { day: 'Thu', value: 88 },
  { day: 'Fri', value: 92 },
  { day: 'Sat', value: 73 },
  { day: 'Sun', value: 80 },
];

export const systemMetrics = [
  { title: 'Sync Latency', value: '122ms', subtitle: 'Average response time.', icon: Clock3 },
  { title: 'Active Paths', value: '14', subtitle: 'Current sync paths active.', icon: Wifi },
  { title: 'Security Score', value: '97%', subtitle: 'Current node security rating.', icon: ShieldCheck },
];

export const nodeSyncStatus = [
  { name: 'Core Node A', status: 'Healthy', lastSync: '2 min ago' },
  { name: 'Core Node B', status: 'Healthy', lastSync: '4 min ago' },
  { name: 'Backup Node C', status: 'Warning', lastSync: '18 min ago' },
];
