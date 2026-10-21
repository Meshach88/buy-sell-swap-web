import React from 'react';

export function SearchBar({ placeholder = 'Search phones, laptops, consoles…', value, onChange, onSubmit, size = 'md', showButton = true }) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'lg' ? 56 : 48;
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: h, padding: showButton ? '0 6px 0 var(--space-4)' : '0 var(--space-4)', background: 'var(--surface-card)', border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-pill)', boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-xs)', transition: 'var(--transition-control)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color: 'var(--text-muted)', flex: '0 0 auto' }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', color: 'var(--text-strong)' }} />
      {showButton ? (
        <button type="submit" style={{ height: h - 12, padding: '0 18px', background: 'var(--brand-primary)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-pill)', fontSize: 14, fontWeight: 'var(--weight-semibold)', cursor: 'pointer' }}>Search</button>
      ) : null}
    </form>
  );
}
