import Alert from '../Alert';

export default function SyncNodeRequiredAlert() {
  return (
    <Alert type="warning">
      <p className="font-semibold">Cần môi trường chi nhánh</p>
      <p className="mt-1">Chuyển sang Node HCM hoặc Node HN để chạy đồng bộ dữ liệu.</p>
    </Alert>
  );
}
