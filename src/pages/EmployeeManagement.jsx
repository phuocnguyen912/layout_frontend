import { Plus, Pen, Trash2, Search } from 'lucide-react';
import { employeeRows } from '../data/mockData';

export default function EmployeeManagement() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Employee Management</h2>
          <p className="mt-2 text-sm text-slate-500">Search, filter, and manage employee records.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search employee" className="border-none bg-transparent text-sm text-slate-700 outline-none" />
          </div>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-card hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Name</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Role</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {employeeRows.map((employee) => (
              <tr key={employee.name} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">{employee.initials}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{employee.name}</p>
                      <p className="text-sm text-slate-500">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{employee.role}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{employee.status}</td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100">
                      <Pen className="h-4 w-4" />
                    </button>
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
