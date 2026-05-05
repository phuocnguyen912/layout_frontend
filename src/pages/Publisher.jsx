import { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Field from '../components/ui/Field';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';

const defaultBranchForm = {
  maChiNhanh: '',
  tenChiNhanh: '',
  diaChi: '',
  trangThai: true,
};

const defaultPositionForm = {
  maChucVu: '',
  tenChucVu: '',
  heSoLuong: '',
};

const defaultContractTypeForm = {
  maLoaiHopDong: '',
  tenLoaiHopDong: '',
  thoiHanThang: '',
};

const defaultAccountForm = {
  username: '',
  password: '',
  maRole: 'publisher_admin',
  maChiNhanh: '',
};

export default function Publisher({ isPublisher, publisherApi, publisherData, runAction, submittingKey }) {
  const [branchForm, setBranchForm] = useState(defaultBranchForm);
  const [positionForm, setPositionForm] = useState(defaultPositionForm);
  const [contractTypeForm, setContractTypeForm] = useState(defaultContractTypeForm);
  const [accountForm, setAccountForm] = useState(defaultAccountForm);

  return (
    <>
      <SectionHeader
        eyebrow="Publisher"
        title="Dữ liệu dùng chung và tài khoản"
        description="Quản lý chi nhánh, chức vụ, loại hợp đồng và tài khoản. Sync được thực hiện tại mỗi Node chi nhánh."
      />

      {!isPublisher ? (
        <Panel title="Không dùng profile Publisher" subtitle="Trang này cần đăng nhập profile Publisher để thao tác dữ liệu dùng chung.">
          <p className="text-sm text-[var(--hr-muted)]">Đăng nhập lại với `publisher_admin` để sử dụng đầy đủ module này.</p>
        </Panel>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Tạo chi nhánh" subtitle="POST `/publisher/branches`">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction('create-branch', () => publisherApi.createBranch({
                    ...branchForm,
                  }), () => setBranchForm(defaultBranchForm));
                }}
              >
                <Field label="Mã chi nhánh">
                  <Input value={branchForm.maChiNhanh} onChange={(event) => setBranchForm({ ...branchForm, maChiNhanh: event.target.value })} required />
                </Field>
                <Field label="Tên chi nhánh">
                  <Input value={branchForm.tenChiNhanh} onChange={(event) => setBranchForm({ ...branchForm, tenChiNhanh: event.target.value })} required />
                </Field>
                <Field label="Địa chỉ" >
                  <Input value={branchForm.diaChi} onChange={(event) => setBranchForm({ ...branchForm, diaChi: event.target.value })} className="md:col-span-2" />
                </Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-branch'} className="md:col-span-2">Tạo chi nhánh</Button>
              </form>
            </Panel>

            <Panel title="Tạo chức vụ" subtitle="POST `/publisher/positions`">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction('create-position', () => publisherApi.createPosition({
                    ...positionForm,
                    heSoLuong: positionForm.heSoLuong ? Number(positionForm.heSoLuong) : undefined,
                  }), () => setPositionForm(defaultPositionForm));
                }}
              >
                <Field label="Mã chức vụ">
                  <Input value={positionForm.maChucVu} onChange={(event) => setPositionForm({ ...positionForm, maChucVu: event.target.value })} required />
                </Field>
                <Field label="Tên chức vụ">
                  <Input value={positionForm.tenChucVu} onChange={(event) => setPositionForm({ ...positionForm, tenChucVu: event.target.value })} required />
                </Field>
                <Field label="Hệ số lương">
                  <Input type="number" step="0.1" value={positionForm.heSoLuong} onChange={(event) => setPositionForm({ ...positionForm, heSoLuong: event.target.value })} className="md:col-span-2" />
                </Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-position'} className="md:col-span-2">Tạo chức vụ</Button>
              </form>
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Tạo loại hợp đồng" subtitle="POST `/publisher/contract-types`">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction('create-contract-type', () => publisherApi.createContractType({
                    ...contractTypeForm,
                    thoiHanThang: contractTypeForm.thoiHanThang ? Number(contractTypeForm.thoiHanThang) : undefined,
                  }), () => setContractTypeForm(defaultContractTypeForm));
                }}
              >
                <Field label="Mã loại hợp đồng">
                  <Input value={contractTypeForm.maLoaiHopDong} onChange={(event) => setContractTypeForm({ ...contractTypeForm, maLoaiHopDong: event.target.value })} required />
                </Field>
                <Field label="Tên loại hợp đồng">
                  <Input value={contractTypeForm.tenLoaiHopDong} onChange={(event) => setContractTypeForm({ ...contractTypeForm, tenLoaiHopDong: event.target.value })} required />
                </Field>
                <Field label="Thời hạn (tháng)">
                  <Input type="number" value={contractTypeForm.thoiHanThang} onChange={(event) => setContractTypeForm({ ...contractTypeForm, thoiHanThang: event.target.value })} className="md:col-span-2" />
                </Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-contract-type'} className="md:col-span-2">Tạo loại hợp đồng</Button>
              </form>
            </Panel>

            <Panel title="Tạo tài khoản" subtitle="POST `/publisher/accounts`">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction('create-account', () => publisherApi.createAccount(accountForm), () => setAccountForm(defaultAccountForm));
                }}
              >
                <Field label="Tên đăng nhập">
                  <Input value={accountForm.username} onChange={(event) => setAccountForm({ ...accountForm, username: event.target.value })} required />
                </Field>
                <Field label="Mật khẩu">
                  <Input type="password" value={accountForm.password} onChange={(event) => setAccountForm({ ...accountForm, password: event.target.value })} required />
                </Field>
                <Field label="Vai trò">
                  <Select value={accountForm.maRole} onChange={(event) => setAccountForm({ ...accountForm, maRole: event.target.value })}>
                    <option value="publisher_admin">publisher_admin</option>
                    <option value="hr_manager">hr_manager</option>
                    <option value="viewer">viewer</option>
                    <option value="node_admin">node_admin</option>
                  </Select>
                </Field>
                <Field label="Mã chi nhánh">
                  <Input value={accountForm.maChiNhanh} onChange={(event) => setAccountForm({ ...accountForm, maChiNhanh: event.target.value })} />
                </Field>
                <Button type="submit" variant="accent" loading={submittingKey === 'create-account'} className="md:col-span-2">Tạo tài khoản</Button>
              </form>
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Danh sách chi nhánh">
              <DataTable columns={[{ key: 'MaChiNhanh', label: 'Mã' }, { key: 'TenChiNhanh', label: 'Tên' }, { key: 'DiaChi', label: 'Địa chỉ' }]} rows={publisherData.branches} />
            </Panel>
            <Panel title="Danh sách chức vụ">
              <DataTable columns={[{ key: 'MaChucVu', label: 'Mã' }, { key: 'TenChucVu', label: 'Tên' }, { key: 'HeSoLuong', label: 'Hệ số lương' }]} rows={publisherData.positions} />
            </Panel>
            <Panel title="Loại hợp đồng">
              <DataTable columns={[{ key: 'MaLoaiHopDong', label: 'Mã' }, { key: 'TenLoaiHopDong', label: 'Tên' }, { key: 'ThoiHanThang', label: 'Thời hạn' }]} rows={publisherData.contractTypes} />
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
