export async function syncNodeUp(nodeApi) {
  if (!nodeApi?.syncToPublisher) {
    throw new Error('Sync up API khong san sang');
  }

  return nodeApi.syncToPublisher();
}

export async function syncNodeDown(nodeApi) {
  if (!nodeApi?.syncFromPublisher) {
    throw new Error('Sync down API khong san sang');
  }

  return nodeApi.syncFromPublisher();
}

export function normalizeSyncResult(direction, result) {
  const total = Number(result?.total ?? 0);
  const synced = Number(result?.synced ?? 0);
  const conflicts = Number(result?.conflicts ?? 0);

  let status = 'success';
  if (conflicts > 0) status = 'partial_conflict';
  if (total === 0 && synced === 0 && conflicts === 0) status = 'idle';

  return {
    direction,
    total,
    synced,
    conflicts,
    status,
    message:
      status === 'partial_conflict'
        ? 'Dong bo hoan tat nhung co xung dot'
        : status === 'idle'
          ? 'Khong co ban ghi can dong bo'
          : 'Dong bo thanh cong',
  };
}

export function normalizeSyncError(error) {
  const message = error instanceof Error ? error.message : 'Dong bo that bai';
  const lowered = String(message).toLowerCase();

  return {
    message,
    retryable: lowered.includes('timeout') || lowered.includes('network') || lowered.includes('failed') || lowered.includes('offline'),
  };
}
