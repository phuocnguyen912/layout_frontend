import { ArrowRightLeft, ShieldCheck } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import StatusPill from '../components/ui/StatusPill';
import { formatDateTime } from '../utils/format';

export default function Sync({ isPublisher, isNode, nodeApi, session, publisherData, nodeData, setNodeData, syncStatus, runAction, submittingKey }) {
 

  return (
    <>
      <SectionHeader
        eyebrow="Đồng bộ"
        title="Đồng bộ hai chiều"
        description="Theo dõi và chạy đồng bộ dữ liệu giữa chi nhánh và trung tâm."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Trạng thái đồng bộ">
          {isPublisher ? (
            <DataTable
              columns={[
                { key: 'Node', label: 'Node' },
                { key: 'LastSyncTime', label: 'Lần cuối', render: (row) => formatDateTime(row.LastSyncTime) },
                { key: 'TrangThai', label: 'Trạng thái', render: (row) => <StatusPill status={row.TrangThai} /> },
              ]}
              rows={publisherData.sync}
            />
          ) : (
            <div className="space-y-4">
             
              <div className="rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
                <p className="font-semibold text-[var(--hr-ink)]">Tình trạng kết nối</p>
                <p className="mt-2 text-sm text-[var(--hr-muted)]">Chế độ: {nodeData.health?.mode || 'node'}</p>
                <p className="mt-1 text-sm text-[var(--hr-muted)]">Thời gian: {formatDateTime(nodeData.health?.timestamp)}</p>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Tác vụ đồng bộ">
          <div className="space-y-3">
            {isNode ? (
              <>
                <Button
                  variant="accent"
                  className="w-full"
                  loading={submittingKey === 'sync-up'}
                  onClick={() =>
                    runAction('sync-up', () => nodeApi.syncToPublisher(), (result) =>
                      setNodeData((previous) => ({ ...previous, sync: result })),
                    )
                  }
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Node → Publisher (Đẩy dữ liệu lên)
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  loading={submittingKey === 'sync-down'}
                  onClick={() =>
                    runAction('sync-down', () => nodeApi.syncFromPublisher(), (result) =>
                      setNodeData((previous) => ({ ...previous, sync: result })),
                    )
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  Publisher → Node (Kéo dữ liệu về)
                </Button>
              </>
            ) : (
              <div className="rounded-[20px] border border-[#e5d0b8] bg-[#fdf3e8] p-4 text-sm text-[#9b6a28]">
                <p className="font-semibold">Cần môi trường chi nhánh</p>
                <p className="mt-1">Chuyển sang Node HCM hoặc Node HN để chạy đồng bộ dữ liệu.</p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-[24px] border border-[#e0d0c1] bg-[#fbf5ee] p-4">
            <p className="font-semibold text-[var(--hr-ink)]">Kết quả lần chạy gần nhất</p>
            {nodeData.sync ? (
              <div className="mt-3 space-y-2 text-sm text-[#5f534b]">
                <p>Tổng: {nodeData.sync.total ?? 0}</p>
                <p>Đã sync: {nodeData.sync.synced ?? 0}</p>
                <p>Xung đột: {nodeData.sync.conflicts ?? 0}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--hr-muted)]">Chưa chạy sync từ giao diện.</p>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
