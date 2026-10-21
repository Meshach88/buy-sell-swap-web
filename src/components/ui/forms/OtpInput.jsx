import React from 'react';

/** Six boxes acting as one code. Auto-advances, handles backspace and paste. */
export function OtpInput({ length = 6, value, onChange, error, disabled = false, id }) {
  const refs = React.useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  function setAt(i, char) {
    const next = digits.slice();
    next[i] = char;
    onChange(next.join(''));
  }

  function handleChange(i, raw) {
    const char = raw.replace(/\D/g, '').slice(-1);
    setAt(i, char);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
      setAt(i - 1, '');
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div>
      <div id={id} role="group" aria-label="Verification code" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        {digits.map((d, i) => {
          const filled = d !== '';
          const active = i === digits.findIndex((x) => x === '');
          return (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text" inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1}
              value={d} disabled={disabled}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${i + 1}`}
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700, color: 'var(--text-strong)',
                background: '#fff', borderRadius: 'var(--radius-input)', outline: 'none', fontFamily: 'var(--font-sans)',
                border: `1px solid ${error ? 'var(--red-500)' : filled || active ? 'var(--border-focus)' : 'var(--border-strong)'}`,
                boxShadow: active ? 'var(--focus-ring)' : 'none',
                transition: 'var(--transition-control)',
                animation: filled ? 'fade-scale var(--dur-fast) var(--ease-spring) both' : 'none',
              }}
            />
          );
        })}
      </div>
      {error ? <p className="anim-shake" style={{ marginTop: 10, fontSize: 'var(--text-sm)', color: 'var(--red-500)' }}>{error}</p> : null}
    </div>
  );
}
