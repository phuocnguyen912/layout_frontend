import { ArrowUpRight, CheckCircle2, ShieldCheck, Wifi } from 'lucide-react';
import { nodeSyncStatus, systemMetrics } from '../data/mockData';

export default function SynchronizationMonitor() {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        {systemMetrics.map((metric) => (
          <div key={metric.title} className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{metric.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{metric.value}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">{metric.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr] xl:items-start">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">Synchronization nodes</h2>
          <p className="mt-2 text-sm text-slate-500">Monitor node status and last sync activity.</p>
          <div className="mt-6 space-y-4">
            {nodeSyncStatus.map((node) => (
              <div key={node.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{node.name}</p>
                  <p className="text-sm text-slate-500">Last sync {node.lastSync}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${node.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {node.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Health overview</h2>
              <p className="mt-2 text-sm text-slate-500">Overall synchronization readiness.</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-8 space-y-5">
            {['Core sync', 'Backup sync', 'Alert pipeline'].map((label, index) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                  <span>{label}</span>
                  <span>{['80%', '65%', '90%'][index]}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: ['80%', '65%', '90%'][index] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
