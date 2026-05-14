export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  const toneClass = type === 'error'
    ? 'border-[#e5b7ac] bg-[#f7e1db] text-[#7a2e1f]'
    : 'border-[#cdddbf] bg-[#e4efdc] text-[#415730]';

  return (
    <div className={`mb-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>
      <p>{message}</p>
      <button type="button" className="font-semibold opacity-70 hover:opacity-100" onClick={onClose}>
        Đóng
      </button>
    </div>
  );
}
