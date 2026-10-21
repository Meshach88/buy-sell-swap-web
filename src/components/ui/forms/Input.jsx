import React from 'react';

export function Input({ label, placeholder, value, onChange, onBlur, type = 'text', hint, error, prefix, suffix, disabled = false, id }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || `in-${label || placeholder || 'field'}`.replace(/\s+/g, '-').toLowerCase();
  const borderColor = error ? 'var(--red-500)' : focus ? 'var(--border-focus)' : 'var(--border-subtle)';
  return (
    <label htmlFor={inputId} style={{ display: 'grid', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)' }}>
      {label ? <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{label}</span> : null}
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: 48, padding: '0 var(--space-4)', background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)', border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-input)', boxShadow: focus ? 'var(--focus-ring)' : 'none', transition: 'var(--transition-control)' }}>
        {prefix ? <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>{prefix}</span> : null}
        <input id={inputId} type={type} value={value} placeholder={placeholder} disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={(e) => { setFocus(false); onBlur?.(e); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--text-md)', color: 'var(--text-strong)' }} />
        {suffix ? <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>{suffix}</span> : null}
      </span>
      {error || hint ? <span style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--red-500)' : 'var(--text-muted)' }}>{error || hint}</span> : null}
    </label>
  );
}
