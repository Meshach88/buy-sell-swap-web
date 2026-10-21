import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/feedback/Modal.jsx';
import { Input } from '../../components/ui/forms/Input.jsx';
import { Select } from '../../components/ui/forms/Select.jsx';
import { Checkbox } from '../../components/ui/forms/Checkbox.jsx';
import { PasswordToggle } from '../../components/ui/forms/PasswordToggle.jsx';
import { Badge } from '../../components/ui/core/Badge.jsx';
import { Button } from '../../components/ui/core/Button.jsx';
import { Icon } from '../../components/ui/core/Icon.jsx';
import { useAuth } from '../../lib/auth.jsx';
import { useToast } from '../../lib/toast.jsx';
import { ApiError } from '../../lib/api.js';
import { KADUNA_AREAS } from '../../lib/areas.js';

const AREAS = KADUNA_AREAS.map((a) => `${a}, Kaduna`);

export function SignupBuyer() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = React.useState({ name: '', phone: '', area: AREAS[0], password: '' });
  const [errors, setErrors] = React.useState({});
  const [agreed, setAgreed] = React.useState(false);
  const [agreedError, setAgreedError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!agreed) {
      setAgreedError(true);
      setTimeout(() => setAgreedError(false), 500);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const phone = `+234${form.phone.replace(/\D/g, '')}`;
      const res = await register({ name: form.name, phone, area: form.area, password: form.password, role: 'customer' });
      toast.success('Account created — verify your number to continue.');
      navigate('/verify', { state: { phone, debugCode: res.debug_code } });
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(err.errors);
        toast.error('Check the highlighted fields.');
      } else {
        toast.error(err.message || 'Something went wrong. Try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={() => navigate('/')} maxWidth={480}>
      <form onSubmit={onSubmit} className="anim-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 32 }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="anim-fade-up" style={{ '--stagger-i': 0, all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
          <Icon name="arrow-left" size={15} /> Back
        </button>

        <div className="anim-fade-up" style={{ '--stagger-i': 1, display: 'grid', gap: 'var(--space-2)' }}>
          <div><Badge tone="brand" icon={<Icon name="shopping-bag" size={12} />} size="sm">Buyer account</Badge></div>
          <h1 style={{ fontSize: 24, letterSpacing: '-0.03em' }}>Your details</h1>
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 2 }}><Input label="Full name" value={form.name} onChange={set('name')} error={errors.name?.[0]} /></div>

        <div className="anim-fade-up" style={{ '--stagger-i': 3, display: 'grid', gap: 'var(--space-2)' }}>
          <Input label="Phone number" type="tel" prefix="+234" value={form.phone} onChange={set('phone')} error={errors.phone?.[0]} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>We text you a 6-digit code to confirm it.</span>
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 4 }}>
          <Select label="Delivery area" value={form.area} onChange={set('area')} options={AREAS} />
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 5, display: 'grid', gap: 'var(--space-2)' }}>
          <Input label="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')}
            error={errors.password?.[0]} suffix={<PasswordToggle shown={showPassword} onClick={() => setShowPassword((s) => !s)} />} />
          {!errors.password ? <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>At least 8 characters.</span> : null}
        </div>

        <div className={`anim-fade-up${agreedError ? ' anim-shake' : ''}`} style={{ '--stagger-i': 6 }}>
          <Checkbox label="I agree to the Terms and Privacy Policy" checked={agreed} onChange={setAgreed} />
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 7 }}>
          <Button type="submit" fullWidth size="lg" loading={busy}>{busy ? 'Creating account…' : 'Create account'}</Button>
        </div>
      </form>
    </Modal>
  );
}
