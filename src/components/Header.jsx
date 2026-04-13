import { Search, Bell, UserCircle2 } from 'lucide-react';

export default function Header({ title, subtitle, searchValue, onSearchChange }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100/90 px-4 py-4 backdrop-blur-xl xl:px-10">
      <div className="mx-auto flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full max-w-md items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-card">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search dashboard"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-white px-4 py-3 shadow-card">
            <Bell className="h-5 w-5 text-slate-500" />
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Mia Collins</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
