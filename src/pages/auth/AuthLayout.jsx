import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui/core/Icon.jsx';

/** Full-screen auth chrome: no header/bottom nav, a narrow centred card on desktop. */
export function AuthLayout({ children, onBack, title, subtitle }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-page)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: 'var(--space-6) var(--gutter-mobile)', display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
        {onBack ? (
          <button type="button" onClick={() => (onBack === true ? navigate(-1) : onBack())}
            style={{ justifySelf: 'start', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '999px', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', cursor: 'pointer' }}>
            <Icon name="arrow-left" size={18} />
          </button>
        ) : null}

        {title ? (
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--ls-heading)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-strong)' }}>{title}</h1>
            {subtitle ? <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{subtitle}</p> : null}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
