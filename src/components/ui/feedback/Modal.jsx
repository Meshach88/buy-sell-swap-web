import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** A centered card over the current page (used for the whole auth flow on web:
 * the marketplace home stays mounted and visible behind it). */
export function Modal({ onClose, maxWidth = 440, children }) {
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="anim-fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: '5vh 16px', background: 'rgba(7,10,24,.55)', backdropFilter: 'blur(3px)',
      }}>
      <div role="dialog" aria-modal="true" className="anim-fade-scale"
        style={{
          width: '100%', maxWidth, background: '#fff', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)', position: 'relative', margin: 'auto 0',
        }}>
        <button type="button" aria-label="Close" onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, zIndex: 1, width: 36, height: 36, display: 'inline-grid', placeItems: 'center', borderRadius: '999px', border: 'none', background: 'var(--ink-100)', color: 'var(--text-body)', cursor: 'pointer', transition: 'var(--transition-control)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink-200)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink-100)'; }}>
          <Icon name="x" size={17} />
        </button>
        {children}
      </div>
    </div>
  );
}
