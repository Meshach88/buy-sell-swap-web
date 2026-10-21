import React from 'react';
import { Avatar } from '../core/Avatar.jsx';

export function SellerRow({ name, location, rating, deals, verified = false, since, action, compact = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontFamily: 'var(--font-sans)' }}>
      <Avatar name={name} size={compact ? 'md' : 'lg'} verified={verified} />
      <div style={{ display: 'grid', gap: 2, minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: compact ? 'var(--text-sm)' : 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          {verified ? <span style={{ height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center', background: 'var(--status-verified-bg)', color: 'var(--status-verified-fg)', borderRadius: 'var(--radius-pill)', fontSize: 10, fontWeight: 'var(--weight-bold)', letterSpacing: '0.04em' }}>VERIFIED</span> : null}
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          {rating ? <span style={{ color: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' }}>★ {rating}</span> : null}
          {deals ? <span>{deals} deals</span> : null}
          {location ? <span>{location}</span> : null}
          {since ? <span>Joined {since}</span> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
