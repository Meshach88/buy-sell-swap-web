import React from 'react';

export function EmptyState({ title, body, action, icon, tone = 'default' }) {
  const inverse = tone === 'inverse';
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--space-3)', textAlign: 'center', padding: 'var(--space-9) var(--space-6)', background: inverse ? 'var(--surface-inverse)' : 'var(--surface-sunken)', border: inverse ? 'none' : '1px dashed var(--border-strong)', borderRadius: 'var(--radius-card)', fontFamily: 'var(--font-sans)' }}>
      {icon ? <span style={{ width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-pill)', background: inverse ? 'rgba(255,255,255,.08)' : 'var(--surface-card)', color: inverse ? 'var(--lemon-300)' : 'var(--brand-primary)' }}>{icon}</span> : null}
      <h3 style={{ margin: 0, fontSize: 'var(--text-h4)', fontWeight: 'var(--weight-bold)', letterSpacing: '-0.015em', color: inverse ? 'var(--white)' : 'var(--text-strong)' }}>{title}</h3>
      {body ? <p style={{ margin: 0, maxWidth: 380, fontSize: 'var(--text-sm)', color: inverse ? 'rgba(255,255,255,.7)' : 'var(--text-muted)' }}>{body}</p> : null}
      {action}
    </div>
  );
}
