import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchInput from '../ui/SearchInput';
import Button from '../ui/Button';

export default function Header({ breadcrumb, search, setSearch, refreshing, refreshAll }) {
  return (
    <header className="sticky top-0 z-20 mb-6 rounded-[30px] border border-white/70 bg-[rgba(255,248,241,0.72)] px-5 py-4 shadow-[0_20px_50px_rgba(97,74,59,0.12)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs text-[var(--hr-muted)]">
            <Link to="/" className="hover:text-[var(--hr-ink)]">Trang chủ</Link>
            <span>/</span>
            <span className="font-semibold text-[var(--hr-ink)]">{breadcrumb}</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a4f35]">Giao diện vận hành</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--hr-ink)]">Quản lý nhân sự phân tán</h2>
          <p className="mt-2 text-sm text-[var(--hr-muted)]">Theo dõi nhân sự, chi nhánh và đồng bộ dữ liệu trong một giao diện.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Tìm nhanh nhân viên, chi nhánh, mã..."
            className="min-w-[280px]"
          />
          <Button variant="secondary" loading={refreshing} onClick={() => refreshAll()}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>
    </header>
  );
}
