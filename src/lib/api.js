const STORAGE_KEY = 'ddb-hrm-session';

export const API_PROFILES = {
  publisher: {
    key: 'publisher',
    label: 'Publisher',
    description: 'Quản trị dữ liệu toàn công ty và theo dõi đồng bộ.',
    baseUrl: 'http://localhost:3000/api',
    defaultUsername: 'publisher_admin',
    defaultPassword: '123456',
    mode: 'publisher',
  },
  node_hcm: {
    key: 'node_hcm',
    label: 'Chi nhánh HCM',
    description: 'Xử lý nghiệp vụ nhân sự tại chi nhánh TP.HCM.',
    baseUrl: 'http://localhost:3001/api',
    defaultUsername: 'node_hcm_admin',
    defaultPassword: '123456',
    mode: 'node',
  },
  node_hn: {
    key: 'node_hn',
    label: 'Chi nhánh Hà Nội',
    description: 'Xử lý nghiệp vụ nhân sự tại chi nhánh Hà Nội.',
    baseUrl: 'http://localhost:3002/api',
    defaultUsername: 'node_hn_admin',
    defaultPassword: '123456',
    mode: 'node',
  },
};

function buildHeaders(token, extraHeaders = {}) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload?.message
        ? payload.message
        : 'Yeu cau that bai';
    throw new Error(message);
  }

  return payload;
}

async function request(profileKey, path, { method = 'GET', token, body, headers } = {}) {
  const profile = API_PROFILES[profileKey];

  if (!profile) {
    throw new Error('Profile API khong hop le');
  }

  const response = await fetch(`${profile.baseUrl}${path}`, {
    method,
    headers: buildHeaders(token, headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function login(profileKey, credentials) {
  return request(profileKey, '/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export async function fetchHealth(profileKey) {
  return request(profileKey, '/health');
}

export async function fetchPublisherOverview(profileKey, token) {
  const [summary, sync, employees, branches, positions, contractTypes] = await Promise.all([
    request(profileKey, '/publisher/reports/summary', { token }),
    request(profileKey, '/publisher/sync-monitor?thresholdMinutes=30', { token }),
    request(profileKey, '/publisher/company-search', { token }),
    request(profileKey, '/publisher/branches', { token }),
    request(profileKey, '/publisher/positions', { token }),
    request(profileKey, '/publisher/contract-types', { token }),
  ]);

  return { summary, sync, employees, branches, positions, contractTypes };
}

export async function fetchNodeOverview(profileKey, token, params = {}) {
  const query = new URLSearchParams();
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.thang) query.set('thang', String(params.thang));
  if (params.nam) query.set('nam', String(params.nam));

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const [report, sync, health] = await Promise.all([
    request(profileKey, `/node/reports/local${suffix}`, { token }),
    request(profileKey, '/sync/node-to-publisher', { method: 'POST', token }).catch((error) => ({
      error: error.message,
    })),
    fetchHealth(profileKey).catch(() => null),
  ]);

  return { report, sync, health };
}

export function createPublisherApi(profileKey, token) {
  return {
    listBranches: () => request(profileKey, '/publisher/branches', { token }),
    listPositions: () => request(profileKey, '/publisher/positions', { token }),
    listContractTypes: () => request(profileKey, '/publisher/contract-types', { token }),
    listEmployees: (keyword = '') =>
      request(
        profileKey,
        `/publisher/company-search${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`,
        { token },
      ),
    summary: () => request(profileKey, '/publisher/reports/summary', { token }),
    syncMonitor: () => request(profileKey, '/publisher/sync-monitor?thresholdMinutes=30', { token }),
    createBranch: (body) => request(profileKey, '/publisher/branches', { method: 'POST', token, body }),
    createPosition: (body) => request(profileKey, '/publisher/positions', { method: 'POST', token, body }),
    createContractType: (body) =>
      request(profileKey, '/publisher/contract-types', { method: 'POST', token, body }),
    createAccount: (body) => request(profileKey, '/publisher/accounts', { method: 'POST', token, body }),
    triggerNodePull: () => request(profileKey, '/sync/publisher-to-node', { method: 'POST', token }),
    triggerNodePush: () => request(profileKey, '/sync/node-to-publisher', { method: 'POST', token }),
  };
}

export function createNodeApi(profileKey, token) {
  return {
    localReport: (params = {}) => {
      const query = new URLSearchParams();
      if (params.keyword) query.set('keyword', params.keyword);
      if (params.thang) query.set('thang', String(params.thang));
      if (params.nam) query.set('nam', String(params.nam));
      const suffix = query.toString() ? `?${query.toString()}` : '';
      return request(profileKey, `/node/reports/local${suffix}`, { token });
    },
    createEmployee: (body) => request(profileKey, '/node/employees', { method: 'POST', token, body }),
    createContract: (body) => request(profileKey, '/node/contracts', { method: 'POST', token, body }),
    checkIn: (body) => request(profileKey, '/node/attendance/check-in', { method: 'POST', token, body }),
    checkOut: (body) => request(profileKey, '/node/attendance/check-out', { method: 'POST', token, body }),
    createLeave: (body) => request(profileKey, '/node/leaves', { method: 'POST', token, body }),
    approveLeave: (id, body) =>
      request(profileKey, `/node/leaves/${id}/approval`, { method: 'PUT', token, body }),
    generateSalary: (body) => request(profileKey, '/node/salaries/generate', { method: 'POST', token, body }),
    syncToPublisher: () => request(profileKey, '/sync/node-to-publisher', { method: 'POST', token }),
    syncFromPublisher: () => request(profileKey, '/sync/publisher-to-node', { method: 'POST', token }),
  };
}
