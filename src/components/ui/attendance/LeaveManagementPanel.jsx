import LeaveApprovalPanel from './LeaveApprovalPanel';
import LeaveRequestPanel from './LeaveRequestPanel';
import Panel from '../Panel';

export default function LeaveManagementPanel({ request, approval, employees, leaves }) {
  return (
    <Panel title="Nghỉ phép" subtitle="Gửi đơn và duyệt nghỉ phép.">
      <div className="grid gap-6 md:grid-cols-2">
        <LeaveRequestPanel
          error={request.error}
          created={request.created}
          form={request.form}
          setForm={request.setForm}
          employees={employees}
          submitting={request.submitting}
          onSubmit={request.onSubmit}
        />

        <LeaveApprovalPanel
          error={approval.error}
          form={approval.form}
          setForm={approval.setForm}
          leaves={leaves}
          submitting={approval.submitting}
          onSubmit={approval.onSubmit}
        />
      </div>
    </Panel>
  );
}
