import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/feedback/Modal.jsx';
import { Icon } from '../../components/ui/core/Icon.jsx';
import { Button } from '../../components/ui/core/Button.jsx';

const ROLES = [
  { key: 'buyer', icon: 'shopping-bag', title: 'I want to buy', body: 'Browse verified gadgets, pay safely and track delivery to your door.', to: '/signup/buyer' },
  { key: 'seller', icon: 'store', title: 'I want to sell', body: 'List your gadgets, get orders and be paid every week.', to: '/signup/seller', note: 'We check your ID before you can list.' },
];

export function SignupRole() {
  const navigate = useNavigate();
  const [picked, setPicked] = React.useState(null);
  const close = () => navigate('/');

  return (
    <Modal onClose={close} maxWidth={480}>
      <div className="anim-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', padding: '32px' }}>
        <div className="anim-fade-up" style={{ '--stagger-i': 0, display: 'grid', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--brand-primary)' }}>BuySellSwap</span>
          <h1 style={{ fontSize: 24, letterSpacing: '-0.03em' }}>How will you use BuySellSwap?</h1>
          <p style={{ fontSize: 14, color: 'var(--text-body)' }}>Pick one for now. You can add the other later from Account.</p>
        </div>

        {ROLES.map((role, i) => {
          const active = picked === role.key;
          return (
            <button key={role.key} type="button" onClick={() => setPicked(role.key)}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              className="anim-fade-up" style={{ '--stagger-i': i + 1,
                all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
                padding: 18, borderRadius: 'var(--radius-lg)',
                background: active ? 'var(--surface-brand-soft)' : 'var(--surface-card)',
                border: `1.5px solid ${active ? 'var(--border-brand)' : 'var(--border-subtle)'}`,
                boxShadow: active ? '0 0 0 3px rgba(27,63,234,.08)' : 'var(--shadow-xs)',
                transform: active ? 'translateY(-1px)' : 'none',
                transition: 'var(--transition-control), transform var(--dur-base) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 44, height: 44, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: '999px', background: active ? '#fff' : 'var(--surface-sunken)', transition: 'var(--transition-control)' }}>
                  <Icon name={role.icon} size={20} color="var(--brand-primary)" />
                </span>
                <span style={{ flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{role.title}</span>
                <span style={{
                  width: 22, height: 22, flex: '0 0 auto', borderRadius: '999px', display: 'grid', placeItems: 'center',
                  border: `2px solid ${active ? 'var(--brand-primary)' : 'var(--border-strong)'}`, background: '#fff',
                  transition: 'var(--transition-control)',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '999px', background: 'var(--brand-primary)', transform: active ? 'scale(1)' : 'scale(0)', transition: 'transform var(--dur-fast) var(--ease-spring)' }} />
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-body)', textAlign: 'left' }}>{role.body}</p>
              {role.note ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Icon name="id-card" size={14} />{role.note}
                </div>
              ) : null}
            </button>
          );
        })}

        <div className="anim-fade-up" style={{ '--stagger-i': 3, display: 'grid', gap: 'var(--space-3)' }}>
          <Button fullWidth size="lg" disabled={!picked} onClick={() => navigate(ROLES.find((r) => r.key === picked).to)}>
            Continue
          </Button>
          <span style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ fontWeight: 600 }}>Log in</a>
          </span>
        </div>
      </div>
    </Modal>
  );
}
