import Button from '../ui/Button';

export default function AttendanceStateBanner({ banner, onRetry }) {
  if (!banner?.message) return null;

  return (
    <div className="mb-4 rounded-2xl border border-[#e4cfc6] bg-[#f8e6df] px-4 py-3 text-sm text-[#8a3828]">
      <div className="flex items-center justify-between gap-3">
        <p>{banner.message}</p>
        {banner.retryable && onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            Thu lai
          </Button>
        ) : null}
      </div>
    </div>
  );
}
