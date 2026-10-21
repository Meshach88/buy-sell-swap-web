import React from 'react';
import { Toast } from '../components/ui/feedback/Toast.jsx';

const ToastContext = React.createContext(null);
let seq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = React.useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 220);
  }, []);

  const push = React.useCallback((message, { tone = 'neutral', duration = 4000, action } = {}) => {
    const id = ++seq;
    setToasts((list) => [...list, { id, message, tone, action }]);
    if (duration) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const api = React.useMemo(() => ({
    show: push,
    success: (message, opts) => push(message, { ...opts, tone: 'success' }),
    error: (message, opts) => push(message, { ...opts, tone: 'error' }),
    dismiss,
  }), [push, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" style={{ position: 'fixed', top: 'max(16px, env(safe-area-inset-top))', right: 16, left: 16, zIndex: 1000, display: 'grid', gap: 10, justifyItems: 'end', pointerEvents: 'none' }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ width: '100%', maxWidth: 440, pointerEvents: 'auto', animation: `${t.leaving ? 'slide-out-right' : 'slide-in-right'} var(--dur-base) var(--ease-spring) both` }}>
            <Toast message={t.message} tone={t.tone} action={t.action} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
