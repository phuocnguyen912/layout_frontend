import AttendanceFormPanel from './AttendanceFormPanel';
import Panel from '../Panel';

export default function AttendanceWorkdayPanel({
  checkIn,
  checkOut,
  employees,
}) {
  return (
    <Panel title="Check-in / Check-out" subtitle="Ghi nhận giờ công thủ công.">
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceFormPanel
          title="Check-in"
          error={checkIn.error}
          result={checkIn.result}
          form={checkIn.form}
          setForm={checkIn.setForm}
          employees={employees}
          submitting={checkIn.submitting}
          onSubmit={checkIn.onSubmit}
          buttonText="Check-in"
          buttonVariant="accent"
          timeLabel="Giờ vào"
          resultKey="GioVao"
          resultPrefix="Vào lúc: "
        />

        <AttendanceFormPanel
          title="Check-out"
          error={checkOut.error}
          result={checkOut.result}
          form={checkOut.form}
          setForm={checkOut.setForm}
          employees={employees}
          submitting={checkOut.submitting}
          onSubmit={checkOut.onSubmit}
          buttonText="Check-out"
          buttonVariant="secondary"
          timeLabel="Giờ ra"
          resultKey="GioRa"
          resultPrefix="Ra lúc: "
        />
      </div>
    </Panel>
  );
}
