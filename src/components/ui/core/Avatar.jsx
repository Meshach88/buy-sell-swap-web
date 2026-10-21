import React from 'react';

const SIZE = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };

export function Avatar({ name = '', src, size = 'md', verified = false }) {
  const px = SIZE[size];
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: px, height: px, flex: '0 0 auto' }}>
      <span style={{ width: px, height: px, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-pill)', overflow: 'hidden', background: 'var(--blue-100)', color: 'var(--blue-700)', fontWeight: 'var(--weight-bold)', fontSize: Math.round(px * 0.38), letterSpacing: '-0.01em' }}>
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </span>
      {verified ? (
        <span title="Verified" style={{ position: 'absolute', right: -1, bottom: -1, width: Math.max(12, px * 0.3), height: Math.max(12, px * 0.3), borderRadius: 'var(--radius-pill)', background: 'var(--green-500)', border: '2px solid var(--surface-card)' }} />
      ) : null}
    </span>
  );
}
