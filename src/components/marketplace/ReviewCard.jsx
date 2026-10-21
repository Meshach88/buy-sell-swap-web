import React from 'react';
import { Avatar } from '../ui/core/Avatar.jsx';

/** A single review. `compact` (the sidebar "Recent review" card) drops the star
 * row that the full Reviews tab version shows. Every review here is structurally
 * a verified purchase — the schema only lets one exist per completed order item. */
export function ReviewCard({ review, compact = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={review.buyer_name} size="sm" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{review.buyer_name}</span>
          {!compact ? (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} · Verified purchase</span>
          ) : null}
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-body)' }}>{review.body}</p>
    </div>
  );
}
