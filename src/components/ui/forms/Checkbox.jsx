import React from 'react';

export function Checkbox({ label, description, checked = false, onChange, disabled = false }) {
  return (
    <label style={{ display: 'flex', gap: 'var(--space-3)', alignItems: description ? 'flex-start' : 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
      <span style={{ flex: '0 0 auto', width: 22, height: 22, marginTop: description ? 2 : 0, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-xs)', background: checked ? 'var(--brand-primary)' : 'var(--surface-card)', border: checked ? '1px solid var(--brand-primary)' : '1px solid var(--border-strong)', transition: 'var(--transition-control)' }}>
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        {checked ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"><path d="m5 13 4 4 10-10" /></svg> : null}
      </span>
      <span style={{ display: 'grid', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-strong)' }}>{label}</span>
        {description ? <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{description}</span> : null}
      </span>
    </label>
  );
}
