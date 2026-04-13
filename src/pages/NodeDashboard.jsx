import { CircleDollarSign, Clock3, ShieldCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { nodeKpis, attendanceRows, notifications, attendanceChart } from '../data/mockData';

export default function NodeDashboard() {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-4">
        {nodeKpis.map((kpi) => (
          <div key={kpi.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{kpi.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{kpi.value}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">{kpi.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr] xl:items-start">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Attendance Today</h2>
              <p className="text-sm text-slate-500">Live attendance overview for active employees.</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">Updated</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid h-full gap-6 rounded-2xl bg-white p-6 shadow-card">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
            <p className="mt-2 text-sm text-slate-500">Latest node alerts and system updates.</p>
          </div>
          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-white p-3 text-slate-600 shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-slate-900">Employee attendance today</h2>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Employee</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {attendanceRows.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm text-slate-700">{row.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.status}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
