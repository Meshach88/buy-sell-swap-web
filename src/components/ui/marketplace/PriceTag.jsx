import React from 'react';
import { formatNaira } from '../../../lib/money.js';

/** Prices arrive from the API as whole kobo. */
export function PriceTag({ kobo, wasKobo, size = 'md', note }) {
  const sizes = { sm: 16, md: 20, lg: 28, xl: 36 };
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 'var(--space-2)', rowGap: 2, fontFamily: 'var(--font-sans)' }}>
      <span style={{ fontSize: sizes[size], fontWeight: 'var(--weight-extrabold)', letterSpacing: 'var(--ls-price)', color: 'var(--text-strong)' }}>{formatNaira(kobo)}</span>
      {wasKobo ? <span style={{ fontSize: Math.max(12, sizes[size] * 0.62), color: 'var(--text-faint)', textDecoration: 'line-through' }}>{formatNaira(wasKobo)}</span> : null}
      {note ? <span style={{ fontSize: Math.max(11, sizes[size] * 0.55), fontWeight: 'var(--weight-semibold)', color: 'var(--lemon-700)' }}>{note}</span> : null}
    </span>
  );
}
