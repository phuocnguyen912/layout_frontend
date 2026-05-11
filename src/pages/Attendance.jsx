import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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

/* ─── helpers ─── */
function today() { return new Date().toISOString().slice(0, 10); }
function firstOfMonth() {
  const d = new Date(); d.setDate(1);
  return d.toISOString().slice(0, 10);
}
function validateMaNV(v) {
  if (!v?.trim()) return 'Mã nhân viên không được để trống.';
  if (v.trim().length > 10) return 'Mã nhân viên tối đa 10 ký tự.';
  return '';
}
function validateTime(v) {
  if (!v?.trim()) return 'Giờ không được để trống.';
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(v.trim())) return 'Định dạng giờ phải là HH:mm hoặc HH:mm:ss.';
  return '';
}
function ensureSeconds(t) {
  return t && t.split(':').length === 2 ? t + ':00' : t;
}

/* ─── Employee selector ─── */
function EmployeeSelect({ value, onChange, employees, label = 'Mã nhân viên' }) {
  if (!employees || employees.length === 0) {
    return (
      <Field label={label}>
        <Input value={value} onChange={onChange} placeholder="Nhập mã nhân viên" />
      </Field>
    );
  }
  return (
    <Field label={label}>
      <Select value={value} onChange={onChange}>
        <option value="">-- Chọn nhân viên --</option>
        {employees.map((e) => (
          <option key={e.MaNhanVien} value={e.MaNhanVien}>
            {e.MaNhanVien} — {e.HoTen}
          </option>
        ))}
      </Select>
    </Field>
  );
}

/* ─── Inline error banner ─── */
function FormError({ msg }) {
  if (!msg) return null;
  return (
    <div className="mb-3 rounded-xl bg-[#f3d9d2] px-3 py-2 text-sm text-[#8a3828]">{msg}</div>
  );
}

/* ─── Result badge ─── */
function ResultBox({ children }) {
  return (
    <div className="mt-3 rounded-xl border border-[#c8ddb5] bg-[#edf5e4] px-4 py-3 text-sm text-[#4a6030]">
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════ */
export default function Attendance({
  isNode,
  nodeApi,
  leaves,
  runAction,
  submittingKey,
  payrollChartData,
  localEmployees = [],
}) {
  /* ── Bước 1: Check-in / Check-out ── */
  const [ciForm, setCiForm] = useState({ maNhanVien: '', ngay: today(), gioVao: '08:00:00' });
  const [coForm, setCoForm] = useState({ maNhanVien: '', ngay: today(), gioRa: '17:00:00' });
  const [ciError, setCiError] = useState('');
  const [coError, setCoError] = useState('');
  const [ciResult, setCiResult] = useState(null);
  const [coResult, setCoResult] = useState(null);

  function handleCheckIn() {
    const e = validateMaNV(ciForm.maNhanVien) || (!ciForm.ngay ? 'Ngày không được để trống.' : '') || validateTime(ciForm.gioVao);
    if (e) { setCiError(e); return; }
    setCiError(''); setCiResult(null);
    runAction('checkin',
      () => nodeApi.checkIn({ maNhanVien: ciForm.maNhanVien.trim(), ngay: ciForm.ngay, gioVao: ensureSeconds(ciForm.gioVao) + ' 1/1/1970' }),
      (res) => setCiResult(res)
    );
  }

  function handleCheckOut() {
    const e = validateMaNV(coForm.maNhanVien) || (!coForm.ngay ? 'Ngày không được để trống.' : '') || validateTime(coForm.gioRa);
    if (e) { setCoError(e); return; }
    setCoError(''); setCoResult(null);
    runAction('checkout',
      () => nodeApi.checkOut({ maNhanVien: coForm.maNhanVien.trim(), ngay: coForm.ngay, gioRa: ensureSeconds(coForm.gioRa) + ' 1/1/1970' }),
      (res) => setCoResult(res)
    );
  }

  /* helper: run action với inline error catcher */
  function runLocal(setError, key, action, onOk) {
    setError('');
    runAction(key, action, onOk);
  }

  /* ── Bước 3: Nghỉ phép ── */
  const [leaveForm, setLeaveForm] = useState({ maNhanVien: '', tuNgay: today(), denNgay: today(), lyDo: '' });
  const [leaveError, setLeaveError] = useState('');
  const [leaveCreated, setLeaveCreated] = useState(null);
  const [selectedLeaveId, setSelectedLeaveId] = useState('');
  const [approvalForm, setApprovalForm] = useState({ maNghiPhep: '', trangThai: 'DA_DUYET' });
  const [approvalError, setApprovalError] = useState('');

  function handleCreateLeave() {
    const e = validateMaNV(leaveForm.maNhanVien);
    if (e) { setLeaveError(e); return; }
    if (!leaveForm.lyDo?.trim()) { setLeaveError('Lý do không được để trống.'); return; }
    if (leaveForm.tuNgay > leaveForm.denNgay) { setLeaveError('Từ ngày phải ≤ đến ngày.'); return; }
    setLeaveError(''); setLeaveCreated(null);
    runAction('leave-request', () => nodeApi.createLeave(leaveForm), (res) => {
      setLeaveCreated(res);
      setApprovalForm((p) => ({ ...p, maNghiPhep: String(res?.maNghiPhep || '') }));
    });
  }

  function handleApproveLeave() {
    const id = approvalForm.maNghiPhep?.trim();
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      setApprovalError('Mã nghỉ phép phải là số nguyên dương.'); return;
    }
    setApprovalError('');
    runAction('leave-approval', () => nodeApi.approveLeave(id, { trangThai: approvalForm.trangThai }));
  }

  /* ── Bước 4: Tính lương ── */
  const [salaryForm, setSalaryForm] = useState({
    maNhanVien: '',
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    phuCap: '',
    thuong: '',
    khauTru: '',
  });
  const [salaryError, setSalaryError] = useState('');
  const [salaryResult, setSalaryResult] = useState(null);

  function handleGenerateSalary() {
    const e = validateMaNV(salaryForm.maNhanVien);
    if (e) { setSalaryError(e); return; }
    const thang = Number(salaryForm.thang);
    const nam = Number(salaryForm.nam);
    if (!thang || thang < 1 || thang > 12) { setSalaryError('Tháng phải từ 1 đến 12.'); return; }
    if (!nam || nam < 2000 || nam > 2100) { setSalaryError('Năm không hợp lệ.'); return; }
    setSalaryError(''); setSalaryResult(null);
    runAction('salary', () => nodeApi.generateSalary({
      maNhanVien: salaryForm.maNhanVien.trim(),
      thang,
      nam,
      phuCap: salaryForm.phuCap ? Number(salaryForm.phuCap) : 0,
      thuong: salaryForm.thuong ? Number(salaryForm.thuong) : 0,
      khauTru: salaryForm.khauTru ? Number(salaryForm.khauTru) : 0,
    }), (res) => setSalaryResult(res));
  }

  /* ══ RENDER ══ */
  if (!isNode) {
    return (
      <>
        <SectionHeader eyebrow="Attendance" title="Chấm công, nghỉ phép, tính lương" description="Toàn bộ thao tác nghiệp vụ node được gom vào một khu giao diện để nhập nhanh." />
        <Panel title="Cần profile node" subtitle="Chấm công và tính lương là endpoint của node.">
          <p className="text-sm text-[var(--hr-muted)]">Đăng nhập môi trường chi nhánh để sử dụng module này.</p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <SectionHeader eyebrow="Attendance" title="Chấm công, nghỉ phép, tính lương" description="Toàn bộ thao tác nghiệp vụ node được gom vào một khu giao diện để nhập nhanh." />

      <div className="grid gap-6 xl:grid-cols-2">

        {/* ── Bước 1a: Check-in ── */}
        <Panel title="Chấm công vào" subtitle="POST /node/attendance/check-in">
          <FormError msg={ciError} />
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeeSelect
              value={ciForm.maNhanVien}
              onChange={(e) => setCiForm({ ...ciForm, maNhanVien: e.target.value })}
              employees={localEmployees}
            />
            <Field label="Ngày">
              <Input type="date" value={ciForm.ngay} onChange={(e) => setCiForm({ ...ciForm, ngay: e.target.value })} />
            </Field>
            <Field label="Giờ vào (HH:mm:ss)" className="md:col-span-2">
              <Input value={ciForm.gioVao} onChange={(e) => setCiForm({ ...ciForm, gioVao: e.target.value })} placeholder="08:00:00" />
            </Field>
          </div>
          <Button variant="accent" className="mt-4 w-full" loading={submittingKey === 'checkin'} onClick={handleCheckIn}>
            <CheckCircle2 className="h-4 w-4" />
            Chấm công vào
          </Button>
          {ciResult && (
            <ResultBox>
              ✓ Chấm vào thành công — <strong>{ciResult.maNhanVien}</strong> ngày <strong>{ciResult.ngay}</strong> — Trạng thái: <StatusPill status={ciResult.trangThai} />
            </ResultBox>
          )}
        </Panel>

        {/* ── Bước 1b: Check-out ── */}
        <Panel title="Chấm công ra" subtitle="POST /node/attendance/check-out">
          <FormError msg={coError} />
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeeSelect
              value={coForm.maNhanVien}
              onChange={(e) => setCoForm({ ...coForm, maNhanVien: e.target.value })}
              employees={localEmployees}
            />
            <Field label="Ngày">
              <Input type="date" value={coForm.ngay} onChange={(e) => setCoForm({ ...coForm, ngay: e.target.value })} />
            </Field>
            <Field label="Giờ ra (HH:mm:ss)" className="md:col-span-2">
              <Input value={coForm.gioRa} onChange={(e) => setCoForm({ ...coForm, gioRa: e.target.value })} placeholder="17:00:00" />
            </Field>
          </div>
          <Button variant="secondary" className="mt-4 w-full" loading={submittingKey === 'checkout'} onClick={handleCheckOut}>
            <Clock3 className="h-4 w-4" />
            Chấm công ra
          </Button>
          {coResult && (
            <ResultBox>
              ✓ Chấm ra thành công — <strong>{coResult.maNhanVien}</strong> ngày <strong>{coResult.ngay}</strong>, giờ ra: <strong>{coResult.gioRa.split(' ')[0]}</strong>
            </ResultBox>
          )}
        </Panel>

        {/* Lịch sử chấm công — endpoint chưa được backend hỗ trợ */}
        <Panel title="Lịch sử chấm công" subtitle="Xem tổng hợp tại báo cáo local" className="xl:col-span-2">
          <p className="text-sm text-[var(--hr-muted)]">
            Endpoint tra cứu lịch sử chưa khả dụng. Dữ liệu chấm công tổng hợp có thể xem tại trang <strong>Chi nhánh → Bộ lọc báo cáo local</strong>.
          </p>
        </Panel>

        {/* ── Bước 3a: Gửi đơn nghỉ phép ── */}
        <Panel title="Gửi đơn nghỉ phép" subtitle="POST /node/leaves">
          <FormError msg={leaveError} />
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeeSelect
              value={leaveForm.maNhanVien}
              onChange={(e) => setLeaveForm({ ...leaveForm, maNhanVien: e.target.value })}
              employees={localEmployees}
            />
            <Field label="Lý do">
              <Input value={leaveForm.lyDo} onChange={(e) => setLeaveForm({ ...leaveForm, lyDo: e.target.value })} placeholder="Nhập lý do nghỉ" />
            </Field>
            <Field label="Từ ngày">
              <Input type="date" value={leaveForm.tuNgay} onChange={(e) => setLeaveForm({ ...leaveForm, tuNgay: e.target.value })} />
            </Field>
            <Field label="Đến ngày">
              <Input type="date" value={leaveForm.denNgay} onChange={(e) => setLeaveForm({ ...leaveForm, denNgay: e.target.value })} />
            </Field>
          </div>
          <Button variant="accent" className="mt-4 w-full" loading={submittingKey === 'leave-request'} onClick={handleCreateLeave}>
            Gửi đơn nghỉ phép
          </Button>
          {leaveCreated && (
            <ResultBox>
              ✓ Đơn đã gửi — Mã nghỉ phép: <strong>#{leaveCreated.maNghiPhep}</strong>
              <span className="ml-2 text-xs text-[#6a8042]">(đã tự điền vào form duyệt bên dưới)</span>
            </ResultBox>
          )}
        </Panel>

        {/* ── Bước 3c: Duyệt / Từ chối ── */}
        <Panel title="Duyệt / Từ chối đơn" subtitle="PUT /node/leaves/:id/approval">
          <FormError msg={approvalError} />
          <p className="mb-3 text-xs text-[var(--hr-muted)]">Click vào row trong danh sách bên dưới để tự điền mã, hoặc nhập tay.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Mã nghỉ phép">
              <Input
                value={approvalForm.maNghiPhep}
                onChange={(e) => setApprovalForm({ ...approvalForm, maNghiPhep: e.target.value })}
                placeholder="VD: 1"
              />
            </Field>
            <Field label="Quyết định">
              <Select value={approvalForm.trangThai} onChange={(e) => setApprovalForm({ ...approvalForm, trangThai: e.target.value })}>
                <option value="DA_DUYET">✅ DA_DUYET</option>
                <option value="TU_CHOI">❌ TU_CHOI</option>
              </Select>
            </Field>
          </div>
          <Button variant="secondary" className="mt-4 w-full" loading={submittingKey === 'leave-approval'} onClick={handleApproveLeave}>
            Xác nhận duyệt / từ chối
          </Button>
        </Panel>

        {/* ── Bước 3b: Danh sách đơn nghỉ ── */}
        <Panel
          title="Danh sách đơn nghỉ phép"
          subtitle="Click vào row để điền mã duyệt"
          className="xl:col-span-2"
          action={
            <span className="text-xs text-[var(--hr-muted)]">
              {selectedLeaveId ? `Đang chọn: #${selectedLeaveId}` : 'Chưa chọn'}
            </span>
          }
        >
          <div className="overflow-hidden rounded-[24px] border border-[#dfcfbf]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e8dbce] text-left">
                <thead className="bg-[#f7f0e8]">
                  <tr>
                    {['Mã NP', 'Mã NV', 'Từ ngày', 'Đến ngày', 'Lý do', 'Trạng thái'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7768]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecdfd2] bg-[#fffdf9]">
                  {leaves.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[var(--hr-muted)]">Chưa có đơn nghỉ phép nào.</td></tr>
                  ) : (
                    leaves.map((row, i) => {
                      const isSelected = String(row.MaNghiPhep) === String(selectedLeaveId);
                      return (
                        <tr
                          key={row.MaNghiPhep || i}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#e8f0dc]' : 'hover:bg-[#f8f1e8]'}`}
                          onClick={() => {
                            const id = String(row.MaNghiPhep);
                            setSelectedLeaveId(id);
                            setApprovalForm((p) => ({ ...p, maNghiPhep: id }));
                          }}
                        >
                          <td className="px-4 py-3 text-sm font-semibold text-[#b55233]">#{row.MaNghiPhep}</td>
                          <td className="px-4 py-3 text-sm text-[#4f433b]">{row.MaNhanVien}</td>
                          <td className="px-4 py-3 text-sm text-[#4f433b]">{formatDateTime(row.TuNgay)}</td>
                          <td className="px-4 py-3 text-sm text-[#4f433b]">{formatDateTime(row.DenNgay)}</td>
                          <td className="px-4 py-3 text-sm text-[#4f433b]">{row.LyDo || '—'}</td>
                          <td className="px-4 py-3"><StatusPill status={row.TrangThai} /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        {/* ── Bước 4: Tính lương ── */}
        <Panel title="Tính lương" subtitle="POST /node/salaries/generate">
          <FormError msg={salaryError} />
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeeSelect
              value={salaryForm.maNhanVien}
              onChange={(e) => setSalaryForm({ ...salaryForm, maNhanVien: e.target.value })}
              employees={localEmployees}
            />
            <Field label="Tháng (1–12)">
              <Input type="number" min={1} max={12} value={salaryForm.thang} onChange={(e) => setSalaryForm({ ...salaryForm, thang: e.target.value })} />
            </Field>
            <Field label="Năm">
              <Input type="number" min={2000} max={2100} value={salaryForm.nam} onChange={(e) => setSalaryForm({ ...salaryForm, nam: e.target.value })} />
            </Field>
            <Field label="Phụ cấp (VNĐ)">
              <Input type="number" min={0} value={salaryForm.phuCap} onChange={(e) => setSalaryForm({ ...salaryForm, phuCap: e.target.value })} placeholder="0" />
            </Field>
            <Field label="Thưởng (VNĐ)">
              <Input type="number" min={0} value={salaryForm.thuong} onChange={(e) => setSalaryForm({ ...salaryForm, thuong: e.target.value })} placeholder="0" />
            </Field>
            <Field label="Khấu trừ (VNĐ)">
              <Input type="number" min={0} value={salaryForm.khauTru} onChange={(e) => setSalaryForm({ ...salaryForm, khauTru: e.target.value })} placeholder="0" />
            </Field>
          </div>
          <Button variant="accent" className="mt-4 w-full" loading={submittingKey === 'salary'} onClick={handleGenerateSalary}>
            <BadgeDollarSign className="h-4 w-4" />
            Tính lương
          </Button>
          {salaryResult && (
            <ResultBox>
              <p className="font-semibold text-[#3d5220]">✓ Tính lương thành công</p>
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <span className="text-[var(--hr-muted)]">Mã nhân viên</span>
                <span className="font-medium">{salaryResult.maNhanVien}</span>
                <span className="text-[var(--hr-muted)]">Kỳ lương</span>
                <span className="font-medium">Tháng {salaryResult.thang}/{salaryResult.nam}</span>
                <span className="text-[var(--hr-muted)]">Lương cơ bản</span>
                <span className="font-medium">{formatCurrency(salaryResult.luongCoBan)}</span>
                <span className="text-[var(--hr-muted)]">Phụ cấp</span>
                <span className="font-medium">{formatCurrency(salaryForm.phuCap || 0)}</span>
                <span className="text-[var(--hr-muted)]">Thưởng</span>
                <span className="font-medium">{formatCurrency(salaryForm.thuong || 0)}</span>
                <span className="text-[var(--hr-muted)]">Khấu trừ</span>
                <span className="font-medium text-[#8a3828]">- {formatCurrency(salaryForm.khauTru || 0)}</span>
                <span className="col-span-2 mt-1 border-t border-[#b8d49a] pt-1 font-semibold">
                  Ước tính nhận: {formatCurrency(
                    (salaryResult.luongCoBan || 0) +
                    Number(salaryForm.phuCap || 0) +
                    Number(salaryForm.thuong || 0) -
                    Number(salaryForm.khauTru || 0)
                  )}
                </span>
              </div>
            </ResultBox>
          )}
        </Panel>

        {/* ── Biểu đồ lương ── */}
        <Panel title="Lương theo nhân viên" subtitle="Biểu đồ từ kết quả báo cáo local đang nạp.">
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
            <p className="text-sm text-[var(--hr-muted)]">Chưa có dữ liệu payroll trong kỳ lọc hiện tại.</p>
          )}
        </Panel>

      </div>
    </>
  );
}
