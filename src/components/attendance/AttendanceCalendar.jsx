import Panel from '../ui/Panel';

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function toneClass(status) {
  if (status === 'LATE') return 'bg-[#f4dfc4] text-[#9b6a28]';
  if (status === 'LEAVE') return 'bg-[#dce7d4] text-[#4d5d39]';
  return 'bg-[#ecd7cb] text-[#8a3828]';
}

export default function AttendanceCalendar({ calendarMap, month, year }) {
  const totalDays = daysInMonth(year, month);
  const cells = Array.from({ length: totalDays }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    const key = `${year}-${String(month).padStart(2, '0')}-${day}`;
    return { key, day, status: calendarMap[key] || '' };
  });

  return (
    <Panel title="Calendar attendance" subtitle="Highlight du lieu co mat, di tre va nghi phep trong thang.">
      <div className="grid grid-cols-7 gap-3">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={`rounded-2xl border border-[#e5d9cd] px-3 py-4 text-center text-sm ${cell.status ? toneClass(cell.status) : 'bg-[#fffaf5] text-[#8a7768]'}`}
          >
            <p className="font-semibold">{cell.day}</p>
            <p className="mt-1 text-xs">{cell.status || 'Trong'}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
