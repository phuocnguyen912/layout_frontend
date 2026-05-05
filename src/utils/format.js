export function cardClass() {
  return 'rounded-[28px] border border-[var(--hr-border)] bg-[var(--hr-panel)] p-6 shadow-[0_24px_80px_rgba(71,52,40,0.10)] backdrop-blur';
}

export function labelFromStatus(status) {
  const text = String(status || '').toLowerCase();

  if (text.includes('hoat dong') || text.includes('healthy') || text.includes('checked') || text.includes('du gio')) {
    return 'success';
  }

  if (text.includes('mat') || text.includes('warning') || text.includes('late') || text.includes('deferred')) {
    return 'warning';
  }

  if (text.includes('tu_choi') || text.includes('error') || text.includes('invalid')) {
    return 'danger';
  }

  return 'neutral';
}

export function statusClasses(type) {
  if (type === 'success') return 'bg-[#dfe7d2] text-[#566142]';
  if (type === 'warning') return 'bg-[#f2dfc0] text-[#9b6a28]';
  if (type === 'danger') return 'bg-[#f2d6cf] text-[#9b4331]';
  return 'bg-[#ebe1d7] text-[#6d6258]';
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDateTime(value) {
  if (!value) return 'Chua co';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function getInitials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
