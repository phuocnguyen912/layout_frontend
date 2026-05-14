import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';

export default function Contracts() {
  return (
    <>
      <SectionHeader
        eyebrow="Contracts"
        title="Quản lý hợp đồng"
        description="Trang quản lý hợp đồng lao động. Hiện đang là khung route để mở rộng."
      />
      <Panel title="Hợp đồng" subtitle="TODO: Tách đầy đủ CRUD hợp đồng cho route `/contracts`.">
        <p className="text-sm text-[var(--hr-muted)]">Module `contracts` đã sẵn sàng về điều hướng.</p>
      </Panel>
    </>
  );
}

