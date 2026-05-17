import { useEffect, useMemo, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import StatusPill from '../components/ui/StatusPill';

const defaultContractForm = {
  maHopDong: '',
  maNhanVien: '',
  maLoaiHopDong: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'Hiệu lực',
};

const defaultTypeForm = {
  maLoaiHopDong: '',
  tenLoaiHopDong: '',
  thoiHanThang: '',
};

function formatDate(value) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}

export default function Contracts({
  isPublisher,
  isNode,
  publisherApi,
  nodeApi,
  publisherData,
  runAction,
  submittingKey,
}) {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [contractForm, setContractForm] = useState(defaultContractForm);
  const [typeForm, setTypeForm] = useState(defaultTypeForm);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNode || !nodeApi) return;
    setLoading(true);
    Promise.all([
      nodeApi.listContracts?.().catch(() => []),
      nodeApi.listEmployees?.().catch(() => []),
      nodeApi.listContractTypes?.().catch(() => []),
    ])
      .then(([contractRows, employeeRows, typeRows]) => {
        setContracts(contractRows || []);
        setEmployees(employeeRows || []);
        setContractTypes(typeRows || []);
      })
      .finally(() => setLoading(false));
  }, [isNode, nodeApi, reloadKey]);

  const typeRows = isPublisher ? publisherData?.contractTypes || [] : contractTypes;
  const contractStats = publisherData?.summary?.contractStats || [];

  const activeContracts = contracts.filter((item) => String(item.TrangThai || '').toLowerCase().includes('hieu')).length;
  const expiredContracts = contracts.filter((item) => String(item.TrangThai || '').toLowerCase().includes('het')).length;

  const employeeOptions = useMemo(
    () =>
      employees.map((item) => ({
        id: item.MaNhanVien,
        label: `${item.MaNhanVien} - ${item.HoTen || 'Nhân viên'}`,
      })),
    [employees],
  );

  const submitContract = () => {
    if (!nodeApi?.createContract) return;
    runAction(
      'create-contract',
      () =>
        nodeApi.createContract({
          ...contractForm,
          maHopDong: contractForm.maHopDong.trim(),
          maNhanVien: contractForm.maNhanVien.trim(),
          maLoaiHopDong: contractForm.maLoaiHopDong.trim(),
          ngayBatDau: contractForm.ngayBatDau || undefined,
          ngayKetThuc: contractForm.ngayKetThuc || undefined,
          trangThai: contractForm.trangThai || 'Hiệu lực',
        }),
      () => {
        setContractForm(defaultContractForm);
        setReloadKey((key) => key + 1);
      },
    );
  };

  const submitContractType = () => {
    if (!publisherApi?.createContractType) return;
    runAction(
      'create-contract-type',
      () =>
        publisherApi.createContractType({
          maLoaiHopDong: typeForm.maLoaiHopDong.trim(),
          tenLoaiHopDong: typeForm.tenLoaiHopDong.trim(),
          thoiHanThang: typeForm.thoiHanThang ? Number(typeForm.thoiHanThang) : undefined,
        }),
      () => setTypeForm(defaultTypeForm),
    );
  };

  const contractColumns = [
    { key: 'MaHopDong', label: 'Mã HĐ' },
    {
      key: 'NhanVien',
      label: 'Nhân viên',
      render: (row) => (
        <div>
          <p className="font-semibold text-[var(--hr-ink)]">{row.HoTen || row.MaNhanVien}</p>
          <p className="text-xs text-[var(--hr-muted)]">{row.MaNhanVien}</p>
        </div>
      ),
    },
    {
      key: 'LoaiHopDong',
      label: 'Loại HĐ',
      render: (row) => row.TenLoaiHopDong || row.MaLoaiHopDong,
    },
    { key: 'NgayBatDau', label: 'Bắt đầu', render: (row) => formatDate(row.NgayBatDau) },
    { key: 'NgayKetThuc', label: 'Kết thúc', render: (row) => formatDate(row.NgayKetThuc) },
    { key: 'TrangThai', label: 'Trạng thái', render: (row) => <StatusPill status={row.TrangThai} /> },
  ];

  const typeColumns = [
    { key: 'MaLoaiHopDong', label: 'Mã loại' },
    { key: 'TenLoaiHopDong', label: 'Tên loại' },
    {
      key: 'ThoiHanThang',
      label: 'Thời hạn',
      render: (row) => (row.ThoiHanThang ? `${row.ThoiHanThang} tháng` : 'Vô thời hạn'),
    },
  ];

  return (
    <>
      <SectionHeader
        eyebrow="Contracts"
        title="Quản lý hợp đồng"
        description="Loại hợp đồng được khai báo tại Publisher. Hợp đồng lao động được tạo tại chi nhánh và tự ghi nhận để đồng bộ."
        action={
          isNode ? (
            <Button type="button" variant="secondary" onClick={() => setReloadKey((key) => key + 1)} loading={loading}>
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </Button>
          ) : null
        }
      />

      {isNode ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Tổng hợp đồng" value={contracts.length} hint="Dữ liệu chi nhánh" icon={FileText} tone="slate" />
          <StatCard title="Hiệu lực" value={activeContracts} hint="Theo trạng thái hợp đồng" icon={FileText} tone="emerald" />
          <StatCard title="Hết hạn" value={expiredContracts} hint="Theo trạng thái hợp đồng" icon={FileText} tone="amber" />
        </div>
      ) : null}

      {isNode ? (
        <Panel title="Tạo hợp đồng" subtitle="Lập hợp đồng lao động cho nhân viên tại chi nhánh.">
          <form
            className="grid gap-4 md:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();
              submitContract();
            }}
          >
            <Field label="Mã hợp đồng">
              <Input value={contractForm.maHopDong} onChange={(event) => setContractForm({ ...contractForm, maHopDong: event.target.value })} required />
            </Field>
            <Field label="Nhân viên">
              <Select value={contractForm.maNhanVien} onChange={(event) => setContractForm({ ...contractForm, maNhanVien: event.target.value })} required>
                <option value="">Chọn nhân viên</option>
                {employeeOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Loại hợp đồng">
              <Select value={contractForm.maLoaiHopDong} onChange={(event) => setContractForm({ ...contractForm, maLoaiHopDong: event.target.value })} required>
                <option value="">Chọn loại hợp đồng</option>
                {typeRows.map((item) => (
                  <option key={item.MaLoaiHopDong} value={item.MaLoaiHopDong}>
                    {item.TenLoaiHopDong || item.MaLoaiHopDong}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Ngày bắt đầu">
              <Input type="date" value={contractForm.ngayBatDau} onChange={(event) => setContractForm({ ...contractForm, ngayBatDau: event.target.value })} />
            </Field>
            <Field label="Ngày kết thúc">
              <Input type="date" value={contractForm.ngayKetThuc} onChange={(event) => setContractForm({ ...contractForm, ngayKetThuc: event.target.value })} />
            </Field>
            <Field label="Trạng thái">
              <Input value={contractForm.trangThai} onChange={(event) => setContractForm({ ...contractForm, trangThai: event.target.value })} />
            </Field>
            <Button type="submit" variant="accent" loading={submittingKey === 'create-contract'} className="md:col-span-3">
              <FileText className="h-4 w-4" />
              Tạo hợp đồng
            </Button>
          </form>
        </Panel>
      ) : (
        <Panel title="Tạo loại hợp đồng" subtitle="Khai báo loại hợp đồng dùng chung cho toàn hệ thống.">
          <form
            className="grid gap-4 md:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();
              submitContractType();
            }}
          >
            <Field label="Mã loại HĐ">
              <Input value={typeForm.maLoaiHopDong} onChange={(event) => setTypeForm({ ...typeForm, maLoaiHopDong: event.target.value })} required />
            </Field>
            <Field label="Tên loại HĐ">
              <Input value={typeForm.tenLoaiHopDong} onChange={(event) => setTypeForm({ ...typeForm, tenLoaiHopDong: event.target.value })} required />
            </Field>
            <Field label="Thời hạn tháng">
              <Input type="number" value={typeForm.thoiHanThang} onChange={(event) => setTypeForm({ ...typeForm, thoiHanThang: event.target.value })} placeholder="Bỏ trống nếu vô thời hạn" />
            </Field>
            <Button type="submit" variant="accent" loading={submittingKey === 'create-contract-type'} className="md:col-span-3">
              Tạo loại hợp đồng
            </Button>
          </form>
        </Panel>
      )}

      {isPublisher && contractStats.length ? (
        <Panel title="Thống kê hợp đồng toàn công ty" subtitle="Tổng hợp số lượng hợp đồng theo từng loại.">
          <DataTable
            columns={[
              { key: 'TenLoaiHopDong', label: 'Loại hợp đồng' },
              { key: 'SoHopDong', label: 'Số hợp đồng' },
            ]}
            rows={contractStats.map((item, index) => ({ ...item, id: item.TenLoaiHopDong || index }))}
          />
        </Panel>
      ) : null}

      {isNode ? (
        <Panel title="Danh sách hợp đồng" subtitle="Các hợp đồng đã được lập tại chi nhánh hiện tại.">
          <DataTable columns={contractColumns} rows={contracts.map((item) => ({ ...item, id: item.MaHopDong }))} emptyText="Chưa có hợp đồng" />
        </Panel>
      ) : null}

      <Panel title="Loại hợp đồng" subtitle={isPublisher ? 'Dữ liệu dùng chung trên Publisher.' : 'Loại hợp đồng đã đồng bộ về chi nhánh.'}>
        <DataTable columns={typeColumns} rows={typeRows.map((item) => ({ ...item, id: item.MaLoaiHopDong }))} emptyText="Chưa có loại hợp đồng" />
      </Panel>
    </>
  );
}
