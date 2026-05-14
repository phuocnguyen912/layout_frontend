import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';

export default function Salary() {
  return (
    <>
      <SectionHeader
        eyebrow="Salary"
        title="Quản lý lương"
        description="Trang tổng hợp và xử lý lương. Hiện đang là khung route để hoàn thiện dần."
      />
      <Panel title="Lương" subtitle="TODO: Bổ sung nghiệp vụ bảng lương theo kỳ và theo nhân viên.">
        <p className="text-sm text-[var(--hr-muted)]">Module `salary` đã sẵn sàng route `/salary`.</p>
      </Panel>
    </>
  );
}

