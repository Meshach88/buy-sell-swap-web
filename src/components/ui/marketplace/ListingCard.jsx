import React from 'react';
import { ConditionBadge } from './ConditionBadge.jsx';
import { PriceTag } from './PriceTag.jsx';

export function ListingCard({ title, priceKobo, wasKobo, image, condition = 'uk-used', location, postedAt, openToSwap = false, saved = false, onSave, onClick, layout = 'grid' }) {
  const [hov, setHov] = React.useState(false);
  const row = layout === 'row';
  return (
    <article onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: row ? 'grid' : 'block', gridTemplateColumns: row ? '116px 1fr' : undefined, gap: row ? 'var(--space-4)' : undefined, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)', boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-xs)', transform: hov ? 'translateY(-3px)' : 'none', fontFamily: 'var(--font-sans)' }}>
      <div style={{ position: 'relative', aspectRatio: row ? '1 / 1' : '4 / 3', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
        {image ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--dur-slow) var(--ease-out)', transform: hov ? 'scale(1.04)' : 'none' }} /> : null}
        {openToSwap && !row ? (
          <span style={{ position: 'absolute', top: 10, left: 10, height: 24, padding: '0 10px', display: 'inline-flex', alignItems: 'center', background: 'var(--lemon-400)', color: 'var(--ink-950)', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 'var(--weight-bold)', letterSpacing: '0.02em' }}>OPEN TO SWAP</span>
        ) : null}
        {!row ? (
          <button type="button" aria-label={saved ? 'Remove from saved' : 'Save listing'} onClick={(e) => { e.stopPropagation(); onSave?.(); }}
            style={{ position: 'absolute', top: 8, right: 8, width: 34, height: 34, display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.2)', borderRadius: 'var(--radius-pill)', background: 'rgba(7,10,24,.45)', backdropFilter: 'var(--blur-glass)', cursor: 'pointer', color: saved ? 'var(--lemon-300)' : '#fff' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1Z" /></svg>
          </button>
        ) : null}
      </div>
      <div style={{ display: 'grid', gap: 'var(--space-2)', padding: row ? 'var(--space-3) var(--space-4) var(--space-3) 0' : 'var(--space-4)', alignContent: 'start' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <ConditionBadge condition={condition} size="sm" />
          {openToSwap && row ? <ConditionBadge condition="open-swap" size="sm" /> : null}
        </div>
        <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', lineHeight: 1.35, color: 'var(--text-strong)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</h3>
        <PriceTag kobo={priceKobo} wasKobo={wasKobo} size={row ? 'sm' : 'md'} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <span>{location}</span>{postedAt ? <><span aria-hidden="true">·</span><span>{postedAt}</span></> : null}
        </div>
      </div>
    </article>
  );
}
