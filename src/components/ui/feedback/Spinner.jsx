import React from 'react';

/** A small rotating ring — used inside buttons and for inline "loading" states. */
export function Spinner({ size = 16, color = 'currentColor' }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flex: '0 0 auto',
      border: `2px solid ${color}`, borderTopColor: 'transparent', opacity: 0.9,
      animation: 'spin .6s linear infinite',
    }} />
  );
}
