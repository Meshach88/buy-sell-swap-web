import React from 'react';

export function Tabs({ tabs = [], active, onChange, variant = 'underline' }) {
  if (variant === 'segmented') {
    return (
      <div style={{ display: 'inline-flex', padding: 4, gap: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-sans)' }}>
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button key={t.id} type="button" onClick={() => onChange && onChange(t.id)}
              style={{ height: 34, padding: '0 16px', border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontSize: 13, fontWeight: 'var(--weight-semibold)', transition: 'var(--transition-control)', background: on ? 'var(--surface-card)' : 'transparent', color: on ? 'var(--text-strong)' : 'var(--text-muted)', boxShadow: on ? 'var(--shadow-xs)' : 'none' }}>{t.label}</button>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-sans)' }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} type="button" onClick={() => onChange && onChange(t.id)}
            style={{ position: 'relative', padding: '0 0 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)', color: on ? 'var(--text-strong)' : 'var(--text-muted)' }}>
            {t.label}{t.count != null ? <span style={{ marginLeft: 6, color: 'var(--text-faint)', fontSize: 12 }}>{t.count}</span> : null}
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, borderRadius: 3, background: on ? 'var(--brand-primary)' : 'transparent' }} />
          </button>
        );
      })}
    </div>
  );
}
