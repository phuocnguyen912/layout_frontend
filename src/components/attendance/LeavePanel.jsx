import Button from '../ui/Button';
import Field from '../ui/Field';
import Input from '../ui/Input';
import Panel from '../ui/Panel';
import Select from '../ui/Select';
import StatusPill from '../ui/StatusPill';

function EmployeeSelect({ employees, value, onChange }) {
  return (
    <Select value={value} onChange={onChange}>
      <option value="">Chon nhan vien</option>
      {employees.map((employee) => (
        <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
          {employee.MaNhanVien} - {employee.HoTen}
        </option>
      ))}
    </Select>
  );
}

export default function LeavePanel({
  employees,
  leaveForm,
  setLeaveForm,
  approvalForm,
  setApprovalForm,
  leaves,
  onRequest,
  onApprove,
  submittingKey,
  errors,
  latestLeave,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Nghi phep" subtitle="Gui don nghi va cap nhat ket qua duyet tai cho.">
        {errors.leave ? <p className="mb-3 text-sm text-[#8a3828]">{errors.leave}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nhan vien">
            <EmployeeSelect
              employees={employees}
              value={leaveForm.maNhanVien}
              onChange={(event) => setLeaveForm((previous) => ({ ...previous, maNhanVien: event.target.value }))}
            />
          </Field>
          <Field label="Ly do">
            <Input
              value={leaveForm.lyDo}
              onChange={(event) => setLeaveForm((previous) => ({ ...previous, lyDo: event.target.value }))}
            />
          </Field>
          <Field label="Tu ngay">
            <Input
              type="date"
              value={leaveForm.tuNgay}
              onChange={(event) => setLeaveForm((previous) => ({ ...previous, tuNgay: event.target.value }))}
            />
          </Field>
          <Field label="Den ngay">
            <Input
              type="date"
              value={leaveForm.denNgay}
              onChange={(event) => setLeaveForm((previous) => ({ ...previous, denNgay: event.target.value }))}
            />
          </Field>
        </div>
        <Button className="mt-4 w-full" variant="accent" loading={submittingKey === 'leave-request'} onClick={onRequest}>
          Gui don nghi
        </Button>
        {latestLeave?.maNghiPhep ? <p className="mt-3 text-sm text-[#4d5d39]">Da tao don #{latestLeave.maNghiPhep}</p> : null}
      </Panel>

      <Panel title="Duyet nghi phep" subtitle="Cap nhat trang thai don nghi hien co.">
        {errors.approval ? <p className="mb-3 text-sm text-[#8a3828]">{errors.approval}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ma nghi phep">
            <Input
              value={approvalForm.maNghiPhep}
              onChange={(event) => setApprovalForm((previous) => ({ ...previous, maNghiPhep: event.target.value }))}
            />
          </Field>
          <Field label="Trang thai">
            <Select
              value={approvalForm.trangThai}
              onChange={(event) => setApprovalForm((previous) => ({ ...previous, trangThai: event.target.value }))}
            >
              <option value="DA_DUYET">DA_DUYET</option>
              <option value="TU_CHOI">TU_CHOI</option>
            </Select>
          </Field>
        </div>
        <Button className="mt-4 w-full" variant="secondary" loading={submittingKey === 'leave-approval'} onClick={onApprove}>
          Duyet don
        </Button>
        <div className="mt-5 space-y-3">
          {(leaves || []).slice(0, 5).map((leave) => (
            <div key={leave.MaNghiPhep} className="rounded-2xl border border-[#e0d0c1] bg-[#fbf5ee] px-4 py-3 text-sm">
              <p className="font-semibold">#{leave.MaNghiPhep} - {leave.MaNhanVien}</p>
              <p className="mt-1 text-[#6d6258]">{leave.LyDo || 'Khong co ly do'}</p>
              <div className="mt-2">
                <StatusPill status={leave.TrangThai} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
