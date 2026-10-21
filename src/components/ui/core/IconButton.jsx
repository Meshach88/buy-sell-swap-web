import React from 'react';

const SIZE = { sm: 32, md: 40, lg: 48 };

export function IconButton({ children, label, variant = 'ghost', size = 'md', badge, onClick }) {
  const [hov, setHov] = React.useState(false);
  const skins = {
    ghost: { background: hov ? 'var(--ink-100)' : 'transparent', color: 'var(--text-body)', border: '1px solid transparent' },
    outline: { background: hov ? 'var(--ink-50)' : 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-subtle)' },
    solid: { background: hov ? 'var(--brand-primary-hover)' : 'var(--brand-primary)', color: 'var(--white)', border: '1px solid transparent' },
    glass: { background: hov ? 'rgba(7,10,24,.62)' : 'rgba(7,10,24,.45)', color: 'var(--white)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'var(--blur-glass)' },
  };
  return (
    <button type="button" aria-label={label} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', width: SIZE[size], height: SIZE[size], display: 'inline-grid', placeItems: 'center', borderRadius: 'var(--radius-pill)', cursor: 'pointer', transition: 'var(--transition-control)', ...skins[variant] }}>
      {children}
      {badge ? (
        <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, padding: '0 5px', display: 'grid', placeItems: 'center', background: 'var(--lemon-400)', color: 'var(--ink-950)', fontSize: 11, fontWeight: 'var(--weight-bold)', borderRadius: 'var(--radius-pill)', border: '2px solid var(--surface-card)' }}>{badge}</span>
      ) : null}
    </button>
  );
}
