import React from 'react';

const TONES = {
  brand: { background: 'var(--surface-brand-soft)', color: 'var(--blue-700)' },
  accent: { background: 'var(--surface-accent)', color: 'var(--text-on-accent)' },
  neutral: { background: 'var(--ink-100)', color: 'var(--ink-700)' },
  verified: { background: 'var(--status-verified-bg)', color: 'var(--status-verified-fg)' },
  pending: { background: 'var(--status-pending-bg)', color: 'var(--status-pending-fg)' },
  danger: { background: 'var(--status-danger-bg)', color: 'var(--status-danger-fg)' },
  inverse: { background: 'var(--surface-inverse)', color: 'var(--white)' },
};

export function Badge({ children, tone = 'neutral', icon, size = 'md' }) {
  const h = size === 'sm' ? 22 : 28;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: size === 'sm' ? '0 8px' : '0 12px', fontSize: size === 'sm' ? 11 : 12, fontWeight: 'var(--weight-semibold)', letterSpacing: '0.01em', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', ...TONES[tone] }}>
      {icon}{children}
    </span>
  );
}
