import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Clock3, BadgeDollarSign } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import { formatDateTime, formatCurrency } from '../utils/format';

const defaultAttendanceForm = {
  maNhanVien: '',
  ngay: new Date().toISOString().slice(0, 10),
  gioVao: '08:00:00',
  gioRa: '17:00:00',
};

const defaultLeaveForm = {
  maNhanVien: '',
  tuNgay: new Date().toISOString().slice(0, 10),
  denNgay: new Date().toISOString().slice(0, 10),
  lyDo: '',
};

const defaultLeaveApprovalForm = {
  maNghiPhep: '',
  trangThai: 'DA_DUYET',
};

const defaultSalaryForm = {
  maNhanVien: '',
  thang: new Date().getMonth() + 1,
  nam: new Date().getFullYear(),
  phuCap: '',
  thuong: '',
  khauTru: '',
};

export default function Attendance({ isNode, nodeApi, leaves, runAction, submittingKey, payrollChartData }) {
  const [attendanceForm, setAttendanceForm] = useState(defaultAttendanceForm);
  const [leaveForm, setLeaveForm] = useState(defaultLeaveForm);
  const [leaveApprovalForm, setLeaveApprovalForm] = useState(defaultLeaveApprovalForm);
  const [salaryForm, setSalaryForm] = useState(defaultSalaryForm);

  return (
    <>
      <SectionHeader
        eyebrow="Attendance"
        title="Chấm công, nghỉ phép, tính lương"
        description="Theo dõi công, xử lý nghỉ phép và tính lương cho nhân sự tại chi nhánh."
      />

      {!isNode ? (
        <Panel title="Cần profile node" subtitle="Chức năng này chỉ dùng tại môi trường chi nhánh.">
          <p className="text-sm text-[var(--hr-muted)]">Đăng nhập môi trường chi nhánh để sử dụng module này.</p>
        </Panel>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Check-in / Check-out" subtitle="Ghi nhận giờ vào và giờ ra của nhân viên.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mã nhân viên"><Input value={attendanceForm.maNhanVien} onChange={(event) => setAttendanceForm({ ...attendanceForm, maNhanVien: event.target.value })} /></Field>
              <Field label="Ngày"><Input type="date" value={attendanceForm.ngay} onChange={(event) => setAttendanceForm({ ...attendanceForm, ngay: event.target.value })} /></Field>
              <Field label="Giờ vào"><Input value={attendanceForm.gioVao} onChange={(event) => setAttendanceForm({ ...attendanceForm, gioVao: event.target.value })} /></Field>
              <Field label="Giờ ra"><Input value={attendanceForm.gioRa} onChange={(event) => setAttendanceForm({ ...attendanceForm, gioRa: event.target.value })} /></Field>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="accent"
                loading={submittingKey === 'checkin'}
                onClick={() => runAction('checkin', () => nodeApi.checkIn({
                  maNhanVien: attendanceForm.maNhanVien,
                  ngay: attendanceForm.ngay,
                  gioVao: attendanceForm.gioVao,
                }))}
              >
                <CheckCircle2 className="h-4 w-4" />
                Chấm công vào
              </Button>
              <Button
                variant="secondary"
                loading={submittingKey === 'checkout'}
                onClick={() => runAction('checkout', () => nodeApi.checkOut({
                  maNhanVien: attendanceForm.maNhanVien,
                  ngay: attendanceForm.ngay,
                  gioRa: attendanceForm.gioRa,
                }))}
              >
                <Clock3 className="h-4 w-4" />
                Chấm công ra
              </Button>
            </div>
          </Panel>

          <Panel title="Danh sách đơn nghỉ phép" subtitle="Theo dõi các đơn đang chờ xử lý.">
            <DataTable
              columns={[
                { key: 'MaNghiPhep', label: 'Mã NP' },
                { key: 'MaNhanVien', label: 'Mã NV' },
                { key: 'HoTen', label: 'Họ tên' },
                { key: 'TuNgay', label: 'Từ ngày', render: (row) => formatDateTime(row.TuNgay) },
                { key: 'DenNgay', label: 'Đến ngày', render: (row) => formatDateTime(row.DenNgay) },
                { key: 'LyDo', label: 'Lý do' },
                { key: 'TrangThai', label: 'Trạng thái', render: (row) => <StatusPill status={row.TrangThai} /> },
              ]}
              rows={leaves}
            />
          </Panel>

          <Panel title="Duyệt / Từ chối đơn nghỉ" subtitle="Cập nhật trạng thái theo mã đơn nghỉ phép.">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Mã nhân viên"><Input value={leaveForm.maNhanVien} onChange={(event) => setLeaveForm({ ...leaveForm, maNhanVien: event.target.value })} /></Field>
                <Field label="Lý do"><Input value={leaveForm.lyDo} onChange={(event) => setLeaveForm({ ...leaveForm, lyDo: event.target.value })} /></Field>
                <Field label="Từ ngày"><Input type="date" value={leaveForm.tuNgay} onChange={(event) => setLeaveForm({ ...leaveForm, tuNgay: event.target.value })} /></Field>
                <Field label="Đến ngày"><Input type="date" value={leaveForm.denNgay} onChange={(event) => setLeaveForm({ ...leaveForm, denNgay: event.target.value })} /></Field>
              </div>
              <Button
                variant="accent"
                loading={submittingKey === 'leave-request'}
                onClick={() => runAction('leave-request', () => nodeApi.createLeave(leaveForm), (result) =>
                  setLeaveApprovalForm((previous) => ({ ...previous, maNghiPhep: String(result.maNghiPhep || '') })),
                )}
              >
                Gửi đơn nghỉ phép
              </Button>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Mã nghỉ phép"><Input value={leaveApprovalForm.maNghiPhep} onChange={(event) => setLeaveApprovalForm({ ...leaveApprovalForm, maNghiPhep: event.target.value })} /></Field>
                <Field label="Trạng thái">
                  <Select value={leaveApprovalForm.trangThai} onChange={(event) => setLeaveApprovalForm({ ...leaveApprovalForm, trangThai: event.target.value })}>
                    <option value="DA_DUYET">DA_DUYET</option>
                    <option value="TU_CHOI">TU_CHOI</option>
                  </Select>
                </Field>
              </div>
              <Button
                variant="secondary"
                loading={submittingKey === 'leave-approval'}
                onClick={() => runAction('leave-approval', () => nodeApi.approveLeave(leaveApprovalForm.maNghiPhep, {
                  trangThai: leaveApprovalForm.trangThai,
                }))}
              >
                Duyệt / từ chối đơn
              </Button>
            </div>
          </Panel>

          <Panel title="Tính lương" subtitle="Tạo bảng lương theo kỳ đã chọn.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mã nhân viên"><Input value={salaryForm.maNhanVien} onChange={(event) => setSalaryForm({ ...salaryForm, maNhanVien: event.target.value })} /></Field>
              <Field label="Tháng"><Input type="number" value={salaryForm.thang} onChange={(event) => setSalaryForm({ ...salaryForm, thang: Number(event.target.value) })} /></Field>
              <Field label="Năm"><Input type="number" value={salaryForm.nam} onChange={(event) => setSalaryForm({ ...salaryForm, nam: Number(event.target.value) })} /></Field>
              <Field label="Phụ cấp"><Input type="number" value={salaryForm.phuCap} onChange={(event) => setSalaryForm({ ...salaryForm, phuCap: event.target.value })} /></Field>
              <Field label="Thưởng"><Input type="number" value={salaryForm.thuong} onChange={(event) => setSalaryForm({ ...salaryForm, thuong: event.target.value })} /></Field>
              <Field label="Khấu trừ"><Input type="number" value={salaryForm.khauTru} onChange={(event) => setSalaryForm({ ...salaryForm, khauTru: event.target.value })} /></Field>
            </div>
            <Button
              variant="accent"
              className="mt-4"
              loading={submittingKey === 'salary'}
              onClick={() => runAction('salary', () => nodeApi.generateSalary({
                maNhanVien: salaryForm.maNhanVien,
                thang: Number(salaryForm.thang),
                nam: Number(salaryForm.nam),
                phuCap: salaryForm.phuCap ? Number(salaryForm.phuCap) : 0,
                thuong: salaryForm.thuong ? Number(salaryForm.thuong) : 0,
                khauTru: salaryForm.khauTru ? Number(salaryForm.khauTru) : 0,
              }))}
            >
              <BadgeDollarSign className="h-4 w-4" />
              Tính lương
            </Button>
          </Panel>

          <Panel title="Lương theo nhân viên" subtitle="Biểu đồ tổng lương trong kỳ hiện tại.">
            {payrollChartData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollChartData}>
                    <CartesianGrid stroke="#e7d8ca" strokeDasharray="4 4" />
                    <XAxis dataKey="name" stroke="#8a7768" />
                    <YAxis stroke="#8a7768" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="salary" fill="#b55233" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-[var(--hr-muted)]">Chưa có dữ liệu lương trong kỳ lọc hiện tại.</p>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
