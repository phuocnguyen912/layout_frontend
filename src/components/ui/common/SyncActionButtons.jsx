import React from 'react';
import { ArrowRightLeft, ShieldCheck } from 'lucide-react';
import Button from '../Button';

export default function SyncActionButtons({ 
  onSyncUp, 
  onSyncDown, 
  submittingKey 
}) {
  return (
    <div className="space-y-3">
      <Button
        variant="accent"
        className="w-full"
        loading={submittingKey === 'sync-up'}
        onClick={onSyncUp}
      >
        <ArrowRightLeft className="h-4 w-4" />
        Node → Publisher (Đẩy dữ liệu lên)
      </Button>
      <Button
        variant="secondary"
        className="w-full"
        loading={submittingKey === 'sync-down'}
        onClick={onSyncDown}
      >
        <ShieldCheck className="h-4 w-4" />
        Publisher → Node (Kéo dữ liệu về)
      </Button>
    </div>
  );
}
