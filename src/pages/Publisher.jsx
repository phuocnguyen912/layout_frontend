import { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import PermissionGuard from '../components/layout/PermissionGuard';
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import BranchFormPanel from '../components/ui/publisher/BranchFormPanel';
import PositionFormPanel from '../components/ui/publisher/PositionFormPanel';
import ContractTypeFormPanel from '../components/ui/publisher/ContractTypeFormPanel';
import AccountFormPanel from '../components/ui/publisher/AccountFormPanel';
import PublisherDataOverview from '../components/ui/publisher/PublisherDataOverview';

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

      <PermissionGuard
        hasPermission={isPublisher}
        title="Không dùng profile Publisher"
        subtitle="Trang này cần đăng nhập profile Publisher để thao tác dữ liệu dùng chung."
        description="Đăng nhập lại với publisher_admin để sử dụng đầy đủ module này."
      >
        <ResponsiveGrid>
          <BranchFormPanel 
            form={branchForm}
            setForm={setBranchForm}
            submitting={submittingKey === 'create-branch'}
            onSubmit={() => runAction('create-branch', () => publisherApi.createBranch(branchForm), () => setBranchForm(defaultBranchForm))}
          />

          <PositionFormPanel 
            form={positionForm}
            setForm={setPositionForm}
            submitting={submittingKey === 'create-position'}
            onSubmit={() => runAction('create-position', () => publisherApi.createPosition({
              ...positionForm,
              heSoLuong: positionForm.heSoLuong ? Number(positionForm.heSoLuong) : undefined,
            }), () => setPositionForm(defaultPositionForm))}
          />

          <ContractTypeFormPanel 
            form={contractTypeForm}
            setForm={setContractTypeForm}
            submitting={submittingKey === 'create-contract-type'}
            onSubmit={() => runAction('create-contract-type', () => publisherApi.createContractType({
              ...contractTypeForm,
              thoiHanThang: contractTypeForm.thoiHanThang ? Number(contractTypeForm.thoiHanThang) : undefined,
            }), () => setContractTypeForm(defaultContractTypeForm))}
          />

          <AccountFormPanel 
            form={accountForm}
            setForm={setAccountForm}
            submitting={submittingKey === 'create-account'}
            branches={publisherData?.branches || []}
            onSubmit={() => runAction('create-account', () => publisherApi.createAccount(accountForm), () => setAccountForm(defaultAccountForm))}
          />
        </ResponsiveGrid>

        <PublisherDataOverview
          branches={publisherData?.branches || []}
          positions={publisherData?.positions || []}
        />
      </PermissionGuard>
    </>
  );
}
