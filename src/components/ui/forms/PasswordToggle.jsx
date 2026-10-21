import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** The eye/eye-off suffix button that toggles a password Input's visibility. */
export function PasswordToggle({ shown, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={shown ? 'Hide password' : 'Show password'}
      style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', color: 'var(--text-muted)', transition: 'var(--transition-control)' }}>
      <Icon name={shown ? 'eye-off' : 'eye'} size={18} />
    </button>
  );
}
