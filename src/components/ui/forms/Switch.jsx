import React from 'react';

export function Switch({ label, checked = false, onChange, disabled = false }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
      <span style={{ position: 'relative', width: 46, height: 28, borderRadius: 'var(--radius-pill)', background: checked ? 'var(--brand-primary)' : 'var(--ink-300)', transition: 'background-color var(--dur-base) var(--ease-out)' }}>
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <span style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 22, height: 22, borderRadius: 'var(--radius-pill)', background: 'var(--white)', boxShadow: 'var(--shadow-sm)', transition: 'left var(--dur-base) var(--ease-spring)' }} />
      </span>
      {label ? <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-strong)' }}>{label}</span> : null}
    </label>
  );
}
