import React from 'react';

export function TopBar({ title, left, right, subtitle, tone = 'light', sticky = true }) {
  const dark = tone === 'brand' || tone === 'inverse';
  return (
    <header style={{ position: sticky ? 'sticky' : 'static', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 60, padding: '0 var(--gutter-mobile)', fontFamily: 'var(--font-sans)', background: tone === 'brand' ? 'var(--surface-brand)' : tone === 'inverse' ? 'var(--surface-inverse)' : 'var(--surface-card)', color: dark ? 'var(--white)' : 'var(--text-strong)', borderBottom: dark ? '1px solid rgba(255,255,255,.1)' : '1px solid var(--border-subtle)' }}>
      {left}
      <div style={{ flex: 1, minWidth: 0, display: 'grid' }}>
        {title ? <span style={{ fontSize: 17, fontWeight: 'var(--weight-bold)', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span> : null}
        {subtitle ? <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,.7)' : 'var(--text-muted)' }}>{subtitle}</span> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>{right}</div>
    </header>
  );
}
