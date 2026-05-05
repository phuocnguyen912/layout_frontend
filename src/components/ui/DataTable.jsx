export default function DataTable({ columns, rows, emptyText = 'Không có dữ liệu' }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#dfcfbf]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e8dbce] text-left">
          <thead className="bg-[#f7f0e8]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7768]">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecdfd2] bg-[#fffdf9]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[var(--hr-muted)]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || row.key || index} className="hover:bg-[#f8f1e8]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 text-sm text-[#4f433b]">
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
