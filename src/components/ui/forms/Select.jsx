import React from 'react';

export function Select({ label, value, onChange, options = [], hint, disabled = false, id }) {
  const [focus, setFocus] = React.useState(false);
  const selectId = id || `sel-${label || 'field'}`.replace(/\s+/g, '-').toLowerCase();
  return (
    <label htmlFor={selectId} style={{ display: 'grid', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)' }}>
      {label ? <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}</span> : null}
      <span style={{ position: 'relative', display: 'block' }}>
        <select id={selectId} value={value} disabled={disabled} onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: '100%', height: 48, padding: '0 40px 0 var(--space-4)', appearance: 'none', background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)', border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-input)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', color: 'var(--text-strong)', outline: 'none', boxShadow: focus ? 'var(--focus-ring)' : 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ position: 'absolute', right: 14, top: 16, color: 'var(--text-muted)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6" /></svg>
      </span>
      {hint ? <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span> : null}
    </label>
  );
}
