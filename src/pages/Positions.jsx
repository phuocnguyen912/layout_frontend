import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';

export default function Positions() {
  return (
    <>
      <SectionHeader
        eyebrow="Positions"
        title="Danh sách chức vụ"
        description="Trang quản lý chức vụ. Hiện đang là khung route để hoàn thiện module riêng."
      />
      <Panel title="Chức vụ" subtitle="TODO: Kết nối dữ liệu và nghiệp vụ quản lý chức vụ.">
        <p className="text-sm text-[var(--hr-muted)]">Module `positions` đã sẵn sàng route `/positions`.</p>
      </Panel>
    </>
  );
}

