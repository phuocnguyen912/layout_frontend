import { ArrowRight, Clock3, CheckCircle2, XCircle } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { attendanceHistory, attendanceTrend } from '../data/mockData';

export default function AttendancePage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr] xl:items-start">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Attendance Center</h2>
              <p className="mt-2 text-sm text-slate-500">Quick check-in and check-out actions.</p>
            </div>
            <div className="rounded-3xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">Live</div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Current time</p>
              <div className="mt-4 flex items-end justify-between gap-6">
                <div>
                  <p className="text-5xl font-semibold text-slate-900">09:42</p>
                  <p className="text-sm text-slate-500">Wed, Apr 13</p>
                </div>
                <CheckCircle2 className="h-12 w-12 rounded-3xl bg-emerald-100 p-3 text-emerald-700" />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Actions</p>
              <div className="mt-6 flex flex-col gap-4">
                <button className="inline-flex items-center justify-center gap-3 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  <ArrowRight className="h-4 w-4" /> Check in
                </button>
                <button className="inline-flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <XCircle className="h-4 w-4 text-rose-500" /> Check out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">Attendance history</h2>
          <div className="mt-6 space-y-4">
            {attendanceHistory.map((item) => (
              <div key={item.day} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.day}</p>
                    <p className="text-sm text-slate-500">{item.status}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Weekly attendance trend</h2>
            <p className="mt-2 text-sm text-slate-500">Compare check-in flow across the week.</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
