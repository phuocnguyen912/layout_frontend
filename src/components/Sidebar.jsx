import { Search, ChevronRight } from 'lucide-react';

export default function Sidebar({ logo, menuItems, activeKey, onSelect }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-full border-b border-slate-200 bg-white shadow-card xl:static xl:w-80">
      <div className="flex h-full flex-col justify-between overflow-y-auto px-6 py-6">
        <div className="space-y-10">
          <div className="flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-4 text-white shadow-lg shadow-slate-200/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-xl font-bold">H</div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">ADMIN</p>
              <h1 className="text-xl font-semibold">{logo}</h1>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm shadow-slate-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search menu"
                disabled
              />
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activeKey;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelect(item.key)}
                  className={`group flex w-full items-center justify-between rounded-3xl px-4 py-4 text-left transition ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200/50' : 'bg-transparent text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-slate-100 p-2 text-slate-600 group-hover:bg-slate-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">System</p>
          <p className="mt-2 leading-6">All nodes are operating normally. Recent sync checks completed successfully.</p>
        </div>
      </div>
    </aside>
  );
}
