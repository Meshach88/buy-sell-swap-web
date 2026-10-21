import React from 'react';

export function CategoryPill({ label, count, icon, active = false, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', height: 40, padding: '0 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 'var(--weight-semibold)', transition: 'var(--transition-control)', whiteSpace: 'nowrap', background: active ? 'var(--brand-primary)' : hov ? 'var(--blue-50)' : 'var(--surface-card)', color: active ? 'var(--white)' : 'var(--text-body)', border: active ? '1px solid transparent' : '1px solid var(--border-subtle)' }}>
      {icon}{label}
      {count != null ? <span style={{ fontSize: 12, fontWeight: 'var(--weight-medium)', color: active ? 'rgba(255,255,255,.72)' : 'var(--text-faint)' }}>{count}</span> : null}
    </button>
  );
}
