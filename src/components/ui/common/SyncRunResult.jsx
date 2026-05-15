import InfoBox from '../InfoBox';

export default function SyncRunResult({ result }) {
  return (
    <InfoBox title="Kết quả lần chạy gần nhất" className="mt-5">
      {result ? (
        <div className="mt-3 space-y-2 text-[#5f534b]">
          <p>Tổng: {result.total ?? 0}</p>
          <p>Đã sync: {result.synced ?? 0}</p>
          <p>Xung đột: {result.conflicts ?? 0}</p>
        </div>
      ) : (
        <p className="mt-3">Chưa chạy sync từ giao diện.</p>
      )}
    </InfoBox>
  );
}
