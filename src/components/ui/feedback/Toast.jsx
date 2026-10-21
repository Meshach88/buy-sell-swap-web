import React from 'react';

const TONES = {
  neutral: { bg: 'var(--surface-inverse)', fg: 'var(--white)', accent: 'var(--lemon-400)' },
  success: { bg: 'var(--surface-inverse)', fg: 'var(--white)', accent: 'var(--green-500)' },
  error: { bg: 'var(--surface-inverse)', fg: 'var(--white)', accent: 'var(--red-500)' },
};

export function Toast({ message, tone = 'neutral', action, onDismiss }) {
  const t = TONES[tone];
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', maxWidth: 440, padding: '12px 14px', background: t.bg, color: t.fg, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
      <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: t.accent, flex: '0 0 auto' }} />
      <span style={{ flex: 1 }}>{message}</span>
      {action ? <span style={{ fontWeight: 'var(--weight-semibold)', color: t.accent, cursor: 'pointer' }} onClick={action.onClick}>{action.label}</span> : null}
      {onDismiss ? <button type="button" aria-label="Dismiss" onClick={onDismiss} style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button> : null}
    </div>
  );
}
