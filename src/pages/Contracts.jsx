import { useEffect, useMemo, useState } from 'react';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import { formatDateTime } from '../utils/format';

const emptyContract = {
  maHopDong: '',
  maNhanVien: '',
  maLoaiHopDong: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: 'Hieu luc',
};

const emptyType = {
  maLoaiHopDong: '',
  tenLoaiHopDong: '',
  thoiHanThang: '',
};

export default function Contracts({
  isPublisher,
  publisherApi,
  nodeApi,
  publisherData,
  nodeData,
  runAction,
  submittingKey,
}) {
  const [contractForm, setContractForm] = useState(emptyContract);
  const [typeForm, setTypeForm] = useState(emptyType);
  const [contracts, setContracts] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [filters, setFilters] = useState({ maNhanVien: '', trangThai: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const employees = nodeData?.report?.employees || [];
  const typeRows = useMemo(
    () => (isPublisher ? publisherData.contractTypes || [] : contractTypes),
    [contractTypes, isPublisher, publisherData.contractTypes],
  );

  async function loadNodeContracts() {
    if (!nodeApi) return;
    setLoading(true);
    setError('');
    try {
      const [contractResult, typeResult] = await Promise.all([
        nodeApi.listContracts({
          maNhanVien: filters.maNhanVien.trim(),
          trangThai: filters.trangThai,
        }),
        nodeApi.listContractTypes(),
      ]);
      setContracts(contractResult || []);
      setContractTypes(typeResult || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isPublisher) loadNodeContracts();
  }, [isPublisher]);

  function validateContract() {
    if (!contractForm.maHopDong.trim()) return 'Mã hợp đồng không được để trống.';
    if (!contractForm.maNhanVien.trim()) return 'Mã nhân viên không được để trống.';
    if (!contractForm.maLoaiHopDong.trim()) return 'Loại hợp đồng không được để trống.';
    if (contractForm.ngayBatDau && contractForm.ngayKetThuc && contractForm.ngayBatDau > contractForm.ngayKetThuc) {
      return 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.';
    }
    return '';
  }

  function createContract(event) {
    event.preventDefault();
    const message = validateContract();
    if (message) {
      setError(message);
      return;
    }

    setError('');
    runAction('create-contract', () => nodeApi.createContract(contractForm), () => {
      setContractForm(emptyContract);
      loadNodeContracts();
    });
  }

  function createContractType(event) {
    event.preventDefault();
    if (!typeForm.maLoaiHopDong.trim() || !typeForm.tenLoaiHopDong.trim()) {
      setError('Mã và tên loại hợp đồng không được để trống.');
      return;
    }
    setError('');
    runAction('create-contract-type', () => publisherApi.createContractType({
      ...typeForm,
      thoiHanThang: typeForm.thoiHanThang ? Number(typeForm.thoiHanThang) : undefined,
    }), () => setTypeForm(emptyType));
  }

  return (
    <>
      <SectionHeader
        eyebrow="Hợp đồng"
        title={isPublisher ? 'Loại hợp đồng dùng chung' : 'Quản lý hợp đồng lao động'}
        description={isPublisher ? 'Publisher quản lý danh mục loại hợp đồng.' : 'Chi nhánh tạo hợp đồng cho nhân viên local và xem danh sách đã lập.'}
      />

      {error && <div className="rounded-2xl bg-[#f3d9d2] px-4 py-3 text-sm text-[#8a3828]">{error}</div>}

      {isPublisher ? (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Panel title="Tạo loại hợp đồng" subtitle="Dữ liệu này sẽ đồng bộ xuống các chi nhánh.">
            <form className="grid gap-4" onSubmit={createContractType}>
              <Field label="Mã loại hợp đồng">
                <Input value={typeForm.maLoaiHopDong} onChange={(event) => setTypeForm({ ...typeForm, maLoaiHopDong: event.target.value })} required />
              </Field>
              <Field label="Tên loại hợp đồng">
                <Input value={typeForm.tenLoaiHopDong} onChange={(event) => setTypeForm({ ...typeForm, tenLoaiHopDong: event.target.value })} required />
              </Field>
              <Field label="Thời hạn (tháng)">
                <Input type="number" min="0" value={typeForm.thoiHanThang} onChange={(event) => setTypeForm({ ...typeForm, thoiHanThang: event.target.value })} />
              </Field>
              <Button type="submit" variant="accent" loading={submittingKey === 'create-contract-type'}>
                <Plus className="h-4 w-4" />
                Tạo loại hợp đồng
              </Button>
            </form>
          </Panel>
          <Panel title="Danh sách loại hợp đồng" subtitle={`${typeRows.length} loại`}>
            <DataTable
              columns={[
                { key: 'MaLoaiHopDong', label: 'Mã' },
                { key: 'TenLoaiHopDong', label: 'Tên loại' },
                { key: 'ThoiHanThang', label: 'Thời hạn' },
              ]}
              rows={typeRows}
            />
          </Panel>
        </div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Tạo hợp đồng" subtitle="POST /node/contracts">
              <form className="grid gap-4 md:grid-cols-2" onSubmit={createContract}>
                <Field label="Mã hợp đồng">
                  <Input value={contractForm.maHopDong} onChange={(event) => setContractForm({ ...contractForm, maHopDong: event.target.value })} required />
                </Field>
                <Field label="Nhân viên">
                  <Select value={contractForm.maNhanVien} onChange={(event) => setContractForm({ ...contractForm, maNhanVien: event.target.value })} required>
                    <option value="">-- Chọn nhân viên --</option>
                    {employees.map((employee) => (
                      <option key={employee.MaNhanVien} value={employee.MaNhanVien}>
                        {employee.MaNhanVien} - {employee.HoTen}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Loại hợp đồng">
                  <Select value={contractForm.maLoaiHopDong} onChange={(event) => setContractForm({ ...contractForm, maLoaiHopDong: event.target.value })} required>
                    <option value="">-- Chọn loại hợp đồng --</option>
                    {typeRows.map((type) => (
                      <option key={type.MaLoaiHopDong} value={type.MaLoaiHopDong}>
                        {type.MaLoaiHopDong} - {type.TenLoaiHopDong}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Trạng thái">
                  <Input value={contractForm.trangThai} onChange={(event) => setContractForm({ ...contractForm, trangThai: event.target.value })} />
                </Field>
                <Field label="Ngày bắt đầu">
                  <Input type="date" value={contractForm.ngayBatDau} onChange={(event) => setContractForm({ ...contractForm, ngayBatDau: event.target.value })} />
                </Field>
                <Field label="Ngày kết thúc">
                  <Input type="date" value={contractForm.ngayKetThuc} onChange={(event) => setContractForm({ ...contractForm, ngayKetThuc: event.target.value })} />
                </Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-contract'} className="md:col-span-2">
                  <FileText className="h-4 w-4" />
                  Tạo hợp đồng
                </Button>
              </form>
            </Panel>

            <Panel
              title="Bộ lọc hợp đồng"
              subtitle="Tra cứu hợp đồng theo nhân viên hoặc trạng thái."
              action={(
                <Button variant="secondary" loading={loading} onClick={loadNodeContracts}>
                  <RefreshCw className="h-4 w-4" />
                  Tải lại
                </Button>
              )}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Mã nhân viên">
                  <Input value={filters.maNhanVien} onChange={(event) => setFilters({ ...filters, maNhanVien: event.target.value })} />
                </Field>
                <Field label="Trạng thái">
                  <Select value={filters.trangThai} onChange={(event) => setFilters({ ...filters, trangThai: event.target.value })}>
                    <option value="">Tất cả</option>
                    <option value="Hieu luc">Hieu luc</option>
                    <option value="Het hieu luc">Het hieu luc</option>
                  </Select>
                </Field>
              </div>
            </Panel>
          </div>

          <Panel title="Danh sách hợp đồng" subtitle={`${contracts.length} hợp đồng`}>
            <DataTable
              columns={[
                { key: 'MaHopDong', label: 'Mã HĐ' },
                { key: 'MaNhanVien', label: 'Mã NV' },
                { key: 'HoTen', label: 'Nhân viên' },
                { key: 'TenLoaiHopDong', label: 'Loại' },
                { key: 'NgayBatDau', label: 'Bắt đầu', render: (row) => formatDateTime(row.NgayBatDau) },
                { key: 'NgayKetThuc', label: 'Kết thúc', render: (row) => formatDateTime(row.NgayKetThuc) },
                { key: 'TrangThai', label: 'Trạng thái', render: (row) => <StatusPill status={row.TrangThai} /> },
              ]}
              rows={contracts}
            />
          </Panel>
        </>
      )}
    </>
  );
}
