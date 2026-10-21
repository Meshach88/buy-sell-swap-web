import React from 'react';

export function Tag({ children, selected = false, onRemove, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: onRemove ? '0 8px 0 14px' : '0 14px', fontSize: 13, fontWeight: 'var(--weight-medium)', borderRadius: 'var(--radius-pill)', cursor: onClick ? 'pointer' : 'default', transition: 'var(--transition-control)', background: selected ? 'var(--surface-inverse)' : hov ? 'var(--ink-100)' : 'var(--surface-card)', color: selected ? 'var(--white)' : 'var(--text-body)', border: selected ? '1px solid transparent' : '1px solid var(--border-subtle)' }}>
      {children}
      {onRemove ? (
        <button type="button" aria-label="Remove" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ width: 18, height: 18, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer', background: selected ? 'rgba(255,255,255,.2)' : 'var(--ink-100)', color: 'inherit', fontSize: 12, lineHeight: 1 }}>×</button>
      ) : null}
    </span>
  );
}
