import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import { summaryCards, lineChartData, syncNodes } from '../data/mockData';

export default function PublisherDashboard() {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <DashboardCard key={card.title} title={card.title} value={card.value} delta={card.delta} />
        ))}
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-[3fr_1fr] xl:items-start">
        <div className="rounded-2xl bg-white p-6 shadow-card xl:min-h-[30rem]">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Weekly Attendance</h2>
              <p className="text-sm text-slate-500">Track employee presence and sync performance.</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">Live</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="sync" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid h-full gap-6 rounded-2xl bg-white p-6 shadow-card xl:min-h-[30rem]">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Node Sync Status</h2>
            <p className="mt-2 text-sm text-slate-500">Current status of connected synchronization nodes.</p>
          </div>
          <div className="space-y-4">
            {syncNodes.map((node) => (
              <div key={node.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-900">{node.name}</p>
                  <p className="text-sm text-slate-500">Last sync {node.lastSync}</p>
                </div>
                <StatusBadge status={node.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
