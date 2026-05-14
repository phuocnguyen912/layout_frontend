import { useEffect, useMemo, useState } from 'react';

export default function useTableState({
  rows,
  searchKeyword,
  statusFilter,
  resolveStatus,
  pageSize = 10,
}) {
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesKeyword = !keyword || JSON.stringify(row).toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === 'all' || resolveStatus(row) === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [rows, searchKeyword, statusFilter, resolveStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchKeyword, statusFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return { page, setPage, filteredRows, pagedRows, totalPages };
}
