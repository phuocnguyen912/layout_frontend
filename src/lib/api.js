const STORAGE_KEY = 'ddb-hrm-session';
const DEFAULT_API_ORIGIN = 'http://localhost';

function resolveApiBaseUrl(envKey, fallbackPort) {
  const value = import.meta.env[envKey];

  if (typeof value === 'string' && value.trim()) {
    return value.trim().replace(/\/+$/, '');
  }

  return `${DEFAULT_API_ORIGIN}:${fallbackPort}/api`;
}

export const API_PROFILES = {
  publisher: {
    key: 'publisher',
    label: 'Publisher',
    description: 'Quản trị dữ liệu toàn công ty và theo dõi đồng bộ.',
    baseUrl: resolveApiBaseUrl('VITE_PUBLISHER_API_URL', 3000),
    defaultUsername: 'publisher_admin',
    defaultPassword: '123456',
    mode: 'publisher',
  },
  node_hcm: {
    key: 'node_hcm',
    label: 'Chi nhánh HCM',
    description: 'Xử lý nghiệp vụ nhân sự tại chi nhánh TP.HCM.',
    baseUrl: resolveApiBaseUrl('VITE_NODE_HCM_API_URL', 3001),
    defaultUsername: 'node_hcm_admin',
    defaultPassword: '123456',
    mode: 'node',
  },
  node_hn: {
    key: 'node_hn',
    label: 'Chi nhánh Hà Nội',
    description: 'Xử lý nghiệp vụ nhân sự tại chi nhánh Hà Nội.',
    baseUrl: resolveApiBaseUrl('VITE_NODE_HN_API_URL', 3002),
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

// Publisher API factory
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
  };
}

// Node API factory - Sync phải được trigger từ Node instance
export function createNodeApi(profileKey, token) {
  return {
    // ---- Báo cáo & Dữ liệu ----
    localReport: (params = {}) => {
      const query = new URLSearchParams();
      if (params.keyword) query.set('keyword', params.keyword);
      if (params.thang) query.set('thang', String(params.thang));
      if (params.nam) query.set('nam', String(params.nam));
      const suffix = query.toString() ? `?${query.toString()}` : '';
      return request(profileKey, `/node/reports/local${suffix}`, { token });
    },

    listEmployees: (keyword = '') =>
      request(
        profileKey,
        `/node/employees${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`,
        { token },
      ),

    listLeaves: (params = {}) => {
      const query = new URLSearchParams();
      if (params.trangThai) query.set('trangThai', params.trangThai);
      if (params.maNhanVien) query.set('maNhanVien', params.maNhanVien);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      return request(profileKey, `/node/leaves${suffix}`, { token });
    },

    getAttendance: (maNhanVien, params = {}) => {
      const query = new URLSearchParams();
      if (params.tuNgay) query.set('tuNgay', params.tuNgay);
      if (params.denNgay) query.set('denNgay', params.denNgay);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      return request(profileKey, `/node/attendance/${maNhanVien}${suffix}`, { token });
    },

    syncStatus: () => request(profileKey, '/node/sync/status', { token }),

    // ---- Nhân viên & Hợp đồng ----
    createEmployee: (body) => request(profileKey, '/node/employees', { method: 'POST', token, body }),
    createContract: (body) => request(profileKey, '/node/contracts', { method: 'POST', token, body }),

    // ---- Chấm công ----
    checkIn: (body) => request(profileKey, '/node/attendance/check-in', { method: 'POST', token, body }),
    checkOut: (body) => request(profileKey, '/node/attendance/check-out', { method: 'POST', token, body }),

    // ---- Nghỉ phép ----
    createLeave: (body) => request(profileKey, '/node/leaves', { method: 'POST', token, body }),
    approveLeave: (id, body) =>
      request(profileKey, `/node/leaves/${id}/approval`, { method: 'PUT', token, body }),

    // ---- Lương ----
    generateSalary: (body) => request(profileKey, '/node/salaries/generate', { method: 'POST', token, body }),

    // ---- Sync (chỉ dùng từ Node instance) ----
    // Node → Publisher: đẩy local pending changes lên Publisher DB
    syncToPublisher: () => request(profileKey, '/sync/node-to-publisher', { method: 'POST', token }),
    // Publisher → Node: kéo dữ liệu mới từ Publisher về local DB
    syncFromPublisher: () => request(profileKey, '/sync/publisher-to-node', { method: 'POST', token }),
  };
}
