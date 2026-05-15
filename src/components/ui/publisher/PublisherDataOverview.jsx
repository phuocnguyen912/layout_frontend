import DataTable from '../DataTable';
import SectionHeader from '../SectionHeader';
import ResponsiveGrid from '../../layout/ResponsiveGrid';

function DataSection({ title, rows, columns }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#4f433b]">{title}</h3>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
}

export default function PublisherDataOverview({ branches, positions }) {
  return (
    <div className="mt-8">
      <SectionHeader title="Dữ liệu hiện tại" eyebrow="Danh sách" />
      <ResponsiveGrid className="mt-4">
        <DataSection
          title="Chi nhánh"
          rows={branches}
          columns={[
            { key: 'MaChiNhanh', label: 'Mã' },
            { key: 'TenChiNhanh', label: 'Tên' },
            { key: 'DiaChi', label: 'Địa chỉ' },
          ]}
        />
        <DataSection
          title="Chức vụ"
          rows={positions}
          columns={[
            { key: 'MaChucVu', label: 'Mã' },
            { key: 'TenChucVu', label: 'Tên' },
            { key: 'HeSoLuong', label: 'Hệ số' },
          ]}
        />
      </ResponsiveGrid>
    </div>
  );
}
