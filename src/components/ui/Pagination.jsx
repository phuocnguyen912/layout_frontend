import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--hr-muted)] sm:flex-row sm:items-center sm:justify-between">
      <p>
        Trang {currentPage}/{totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-xl border border-[#decebd] px-3 py-2 text-[var(--hr-ink)] transition-colors hover:bg-[#f7f0e8] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          Trước
        </button>
        <button
          type="button"
          className="rounded-xl border border-[#decebd] px-3 py-2 text-[var(--hr-ink)] transition-colors hover:bg-[#f7f0e8] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
