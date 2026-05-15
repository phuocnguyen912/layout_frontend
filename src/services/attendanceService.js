export async function fetchAttendanceReport(nodeApi, filters) {
  if (!nodeApi?.localReport) {
    throw new Error('Attendance API khong san sang');
  }

  return nodeApi.localReport(filters);
}

export async function submitCheckIn(nodeApi, payload) {
  if (!nodeApi?.checkIn) {
    throw new Error('Check-in API khong san sang');
  }

  return nodeApi.checkIn(payload);
}

export async function submitCheckOut(nodeApi, payload) {
  if (!nodeApi?.checkOut) {
    throw new Error('Check-out API khong san sang');
  }

  return nodeApi.checkOut(payload);
}

export async function submitLeaveRequest(nodeApi, payload) {
  if (!nodeApi?.createLeave) {
    throw new Error('Leave API khong san sang');
  }

  return nodeApi.createLeave(payload);
}

export async function submitLeaveApproval(nodeApi, leaveId, payload) {
  if (!nodeApi?.approveLeave) {
    throw new Error('Leave approval API khong san sang');
  }

  return nodeApi.approveLeave(leaveId, payload);
}

export function normalizeAttendanceMutationError(error) {
  const message = error instanceof Error ? error.message : 'Thao tac cham cong that bai';
  const lowered = String(message).toLowerCase();

  return {
    message,
    retryable: lowered.includes('timeout') || lowered.includes('network') || lowered.includes('failed'),
  };
}
