import { UserPlus } from 'lucide-react';

export default function EmployeeOnboardingPanel({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ecd7cb] text-[#8a3828]">
        <UserPlus className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-[#4a3a2e]">Tiếp nhận nhân viên</h3>
      <p className="mt-2 max-w-[280px] text-sm text-[#8a7768]">
        Khai báo thông tin cơ bản cho nhân viên mới tại chi nhánh hiện tại.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#b55233] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#a0482d]"
      >
        <UserPlus className="h-4 w-4" />
        Thêm nhân viên mới
      </button>
    </div>
  );
}
