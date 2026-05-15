import React from 'react';
import DataTable from '../DataTable';
import StatusPill from '../StatusPill';
import { formatDateTime } from '../../../utils/format';

export default function SyncStatusTable({ data }) {
  return (
    <DataTable
      columns={[
        { key: 'Node', label: 'Node' },
        { 
          key: 'LastSyncTime', 
          label: 'Lần cuối', 
          render: (row) => formatDateTime(row.LastSyncTime) 
        },
        { 
          key: 'TrangThai', 
          label: 'Trạng thái', 
          render: (row) => <StatusPill status={row.TrangThai} /> 
        },
      ]}
      rows={data}
    />
  );
}
