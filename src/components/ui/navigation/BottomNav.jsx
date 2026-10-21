import React from 'react';

export function BottomNav({ items = [], active, onChange }) {
  return (
    <nav style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '1fr', alignItems: 'stretch', background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', paddingBottom: 6, fontFamily: 'var(--font-sans)' }}>
      {items.map((it) => {
        const on = it.id === active;
        if (it.primary) {
          return (
            <button key={it.id} type="button" onClick={() => onChange && onChange(it.id)}
              style={{ display: 'grid', placeItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 0 2px' }}>
              <span style={{ width: 46, height: 34, display: 'grid', placeItems: 'center', background: 'var(--brand-primary)', color: '#fff', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-brand)' }}>{it.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 'var(--weight-semibold)', color: 'var(--brand-primary)' }}>{it.label}</span>
            </button>
          );
        }
        return (
          <button key={it.id} type="button" onClick={() => onChange && onChange(it.id)}
            style={{ position: 'relative', display: 'grid', placeItems: 'center', gap: 4, minHeight: 'var(--tap-min)', border: 'none', background: 'transparent', cursor: 'pointer', padding: '10px 0 4px', color: on ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
            {it.icon}
            <span style={{ fontSize: 10, fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)' }}>{it.label}</span>
            {it.badge ? <span style={{ position: 'absolute', top: 6, right: '50%', marginRight: -18, minWidth: 16, height: 16, padding: '0 4px', display: 'grid', placeItems: 'center', background: 'var(--lemon-400)', color: 'var(--ink-950)', borderRadius: 'var(--radius-pill)', fontSize: 10, fontWeight: 'var(--weight-bold)' }}>{it.badge}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
