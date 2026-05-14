/**
 * A11 — API integration test
 * Test API service layer (axios) với mock.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => {
  const mockInstance = {
    interceptors: {
      response: { use: vi.fn() },
      request: { use: vi.fn() },
    },
  };

  const mockCreate = vi.fn(() => {
    const callable = vi.fn((config) => {
      return callable._handler ? callable._handler(config) : Promise.resolve({ data: {} });
    });
    callable.interceptors = mockInstance.interceptors;
    callable._setHandler = (fn) => { callable._handler = fn; };
    return callable;
  });

  return {
    default: {
      create: mockCreate,
    },
  };
});

// We test the API_PROFILES and utility functions independently
// since the actual request function relies on import.meta.env
describe('API Service Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API_PROFILES', () => {
    it('should have publisher, node_hcm, node_hn profiles', async () => {
      const { API_PROFILES } = await import('../lib/api.js');
      expect(API_PROFILES.publisher).toBeDefined();
      expect(API_PROFILES.node_hcm).toBeDefined();
      expect(API_PROFILES.node_hn).toBeDefined();
    });

    it('publisher should be in publisher mode', async () => {
      const { API_PROFILES } = await import('../lib/api.js');
      expect(API_PROFILES.publisher.mode).toBe('publisher');
    });

    it('node profiles should be in node mode', async () => {
      const { API_PROFILES } = await import('../lib/api.js');
      expect(API_PROFILES.node_hcm.mode).toBe('node');
      expect(API_PROFILES.node_hn.mode).toBe('node');
    });

    it('each profile should have required fields', async () => {
      const { API_PROFILES } = await import('../lib/api.js');
      for (const key of Object.keys(API_PROFILES)) {
        const profile = API_PROFILES[key];
        expect(profile.key).toBeTruthy();
        expect(profile.label).toBeTruthy();
        expect(profile.description).toBeTruthy();
        expect(profile.baseUrl).toBeTruthy();
        expect(profile.mode).toBeTruthy();
      }
    });
  });

  describe('Session Management', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('saveSession should persist to localStorage', async () => {
      const { saveSession } = await import('../lib/api.js');
      const session = { profileKey: 'publisher', token: 'test-token' };
      saveSession(session);
      expect(localStorage.getItem('ddb-hrm-session')).toBe(JSON.stringify(session));
    });

    it('loadSession should retrieve from localStorage', async () => {
      const { saveSession, loadSession } = await import('../lib/api.js');
      const session = { profileKey: 'node_hcm', token: 'abc' };
      saveSession(session);
      const loaded = loadSession();
      expect(loaded).toEqual(session);
    });

    it('loadSession should return null when empty', async () => {
      const { loadSession } = await import('../lib/api.js');
      expect(loadSession()).toBeNull();
    });

    it('loadSession should handle corrupted data', async () => {
      const { loadSession } = await import('../lib/api.js');
      localStorage.setItem('ddb-hrm-session', 'invalid-json{{{');
      expect(loadSession()).toBeNull();
      expect(localStorage.getItem('ddb-hrm-session')).toBeNull();
    });

    it('clearSession should remove from localStorage', async () => {
      const { saveSession, clearSession, loadSession } = await import('../lib/api.js');
      saveSession({ token: 'x' });
      clearSession();
      expect(loadSession()).toBeNull();
    });
  });

  describe('Publisher API factory', () => {
    it('should return all expected methods', async () => {
      const { createPublisherApi } = await import('../lib/api.js');
      const api = createPublisherApi('publisher', 'fake-token');

      expect(typeof api.listBranches).toBe('function');
      expect(typeof api.listPositions).toBe('function');
      expect(typeof api.listContractTypes).toBe('function');
      expect(typeof api.listEmployees).toBe('function');
      expect(typeof api.summary).toBe('function');
      expect(typeof api.syncMonitor).toBe('function');
      expect(typeof api.createBranch).toBe('function');
      expect(typeof api.createPosition).toBe('function');
      expect(typeof api.createContractType).toBe('function');
      expect(typeof api.createAccount).toBe('function');
    });
  });

  describe('Node API factory', () => {
    it('should return all expected methods', async () => {
      const { createNodeApi } = await import('../lib/api.js');
      const api = createNodeApi('node_hcm', 'fake-token');

      expect(typeof api.localReport).toBe('function');
      expect(typeof api.listEmployees).toBe('function');
      expect(typeof api.listLeaves).toBe('function');
      expect(typeof api.getAttendance).toBe('function');
      expect(typeof api.syncStatus).toBe('function');
      expect(typeof api.createEmployee).toBe('function');
      expect(typeof api.updateEmployee).toBe('function');
      expect(typeof api.deleteEmployee).toBe('function');
      expect(typeof api.createContract).toBe('function');
      expect(typeof api.checkIn).toBe('function');
      expect(typeof api.checkOut).toBe('function');
      expect(typeof api.createLeave).toBe('function');
      expect(typeof api.approveLeave).toBe('function');
      expect(typeof api.generateSalary).toBe('function');
      expect(typeof api.syncToPublisher).toBe('function');
      expect(typeof api.syncFromPublisher).toBe('function');
    });
  });
});

describe('Format Utilities', () => {
  it('labelFromStatus should classify statuses correctly', async () => {
    const { labelFromStatus } = await import('../utils/format.js');
    expect(labelFromStatus('Hoat dong')).toBe('success');
    expect(labelFromStatus('Mat viec')).toBe('warning');
    expect(labelFromStatus('TU_CHOI')).toBe('danger');
    expect(labelFromStatus('Unknown')).toBe('neutral');
    expect(labelFromStatus(null)).toBe('neutral');
  });

  it('formatCurrency should format VND', async () => {
    const { formatCurrency } = await import('../utils/format.js');
    const result = formatCurrency(15000000);
    expect(result).toContain('15.000.000');
  });

  it('getInitials should extract initials', async () => {
    const { getInitials } = await import('../utils/format.js');
    expect(getInitials('Nguyễn Văn An')).toBe('NV');
    expect(getInitials('Trần Bích')).toBe('TB');
    expect(getInitials('')).toBe('');
    expect(getInitials(null)).toBe('');
  });

  it('formatDateTime should handle valid dates', async () => {
    const { formatDateTime } = await import('../utils/format.js');
    const result = formatDateTime('2024-01-15T10:30:00');
    expect(result).toBeTruthy();
    expect(result).not.toBe('Chua co');
  });

  it('formatDateTime should handle null/empty', async () => {
    const { formatDateTime } = await import('../utils/format.js');
    expect(formatDateTime(null)).toBe('Chua co');
    expect(formatDateTime('')).toBe('Chua co');
  });
});
