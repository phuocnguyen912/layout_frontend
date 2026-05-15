import Button from '../../../components/ui/Button';

export default function AttendanceErrorState({ message, onRetry, retryLabel = 'Thu lai' }) {
  if (!message) return null;

  return (
    <div className="rounded-[24px] border border-[#e8c9bf] bg-[#fbf1ed] p-4 text-sm text-[#8a3828]">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-3" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
