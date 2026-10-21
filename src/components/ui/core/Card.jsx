import React from 'react';

export function Card({ children, padding = 'md', tone = 'default', interactive = false, style }) {
  const [hov, setHov] = React.useState(false);
  const pads = { none: 0, sm: 'var(--space-3)', md: 'var(--space-5)', lg: 'var(--space-6)' };
  const tones = {
    default: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-body)' },
    brand: { background: 'var(--surface-brand)', border: '1px solid transparent', color: 'var(--white)' },
    accent: { background: 'var(--surface-accent)', border: '1px solid transparent', color: 'var(--text-on-accent)' },
    inverse: { background: 'var(--surface-inverse)', border: '1px solid transparent', color: 'var(--white)' },
    sunken: { background: 'var(--surface-sunken)', border: '1px solid transparent', color: 'var(--text-body)' },
  };
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 'var(--radius-card)', padding: pads[padding], overflow: 'hidden', transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)', boxShadow: interactive && hov ? 'var(--shadow-lg)' : 'var(--shadow-xs)', transform: interactive && hov ? 'translateY(-2px)' : 'none', cursor: interactive ? 'pointer' : 'default', ...tones[tone], ...style }}>
      {children}
    </div>
  );
}
