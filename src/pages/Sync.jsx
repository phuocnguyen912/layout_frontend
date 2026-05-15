import SectionHeader from '../components/ui/SectionHeader';
import Panel from '../components/ui/Panel';
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import NodeHealthInfo from '../components/ui/common/NodeHealthInfo';
import SyncStatusTable from '../components/ui/common/SyncStatusTable';
import SyncActionButtons from '../components/ui/common/SyncActionButtons';
import SyncRunResult from '../components/ui/common/SyncRunResult';
import SyncNodeRequiredAlert from '../components/ui/common/SyncNodeRequiredAlert';

export default function Sync({ isPublisher, isNode, nodeApi, nodeData, setNodeData, publisherData, runAction, submittingKey, session }) {
  return (
    <>
      <SectionHeader
        eyebrow="Đồng bộ"
        title="Đồng bộ hai chiều"
        description="Theo dõi và chạy đồng bộ dữ liệu giữa chi nhánh và trung tâm."
      />

      <ResponsiveGrid variant="sync">
        <Panel title="Trạng thái đồng bộ">
          {isPublisher ? (
            <SyncStatusTable data={publisherData.sync || []} />
          ) : (
            <NodeHealthInfo health={nodeData.health} />
          )}
        </Panel>

        <Panel title="Tác vụ đồng bộ" subtitle="Chạy đồng bộ khi đang ở môi trường chi nhánh.">
          {isNode ? (
            <SyncActionButtons 
              submittingKey={submittingKey}
              onSyncUp={() =>
                runAction('sync-up', () => nodeApi.syncToPublisher(), (result) =>
                  setNodeData((previous) => ({ ...previous, sync: result })),
                )
              }
              onSyncDown={() =>
                runAction('sync-down', () => nodeApi.syncFromPublisher(), (result) =>
                  setNodeData((previous) => ({ ...previous, sync: result })),
                )
              }
            />
          ) : (
            <SyncNodeRequiredAlert />
          )}

          <SyncRunResult result={nodeData.sync} />
        </Panel>
      </ResponsiveGrid>
    </>
  );
}
