import React from 'react';

const MAP = {
  'brand-new': { label: 'Brand new', bg: 'var(--status-verified-bg)', fg: 'var(--status-verified-fg)' },
  'uk-used': { label: 'UK used', bg: 'var(--surface-brand-soft)', fg: 'var(--blue-700)' },
  'ng-used': { label: 'Nigerian used', bg: 'var(--ink-100)', fg: 'var(--ink-700)' },
  'for-parts': { label: 'For parts', bg: 'var(--status-pending-bg)', fg: 'var(--status-pending-fg)' },
  'swap-only': { label: 'Swap only', bg: 'var(--surface-accent)', fg: 'var(--text-on-accent)' },
  'open-swap': { label: 'Open to swap', bg: 'var(--surface-accent)', fg: 'var(--text-on-accent)' },
};

export function ConditionBadge({ condition = 'uk-used', size = 'md' }) {
  const c = MAP[String(condition).replace(/_/g, '-')] || MAP['ng-used'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: size === 'sm' ? 22 : 26, padding: '0 10px', borderRadius: 'var(--radius-xs)', background: c.bg, color: c.fg, fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 11 : 12, fontWeight: 'var(--weight-semibold)', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>{c.label}</span>
  );
}
