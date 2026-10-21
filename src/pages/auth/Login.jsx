import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/feedback/Modal.jsx';
import { Input } from '../../components/ui/forms/Input.jsx';
import { Checkbox } from '../../components/ui/forms/Checkbox.jsx';
import { PasswordToggle } from '../../components/ui/forms/PasswordToggle.jsx';
import { Button } from '../../components/ui/core/Button.jsx';
import { useAuth } from '../../lib/auth.jsx';
import { useToast } from '../../lib/toast.jsx';
import { ApiError } from '../../lib/api.js';

export function Login() {
  const navigate = useNavigate();
  const { login, resendOtp } = useAuth();
  const toast = useToast();
  const [form, setForm] = React.useState({ phone: '', password: '' });
  const [keepSignedIn, setKeepSignedIn] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [busyCode, setBusyCode] = React.useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const fullPhone = () => `+234${form.phone.replace(/\D/g, '')}`;
  const close = () => navigate('/');

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = await login({ phone: fullPhone(), password: form.password });
      toast.success(`Welcome back, ${body.user.name.split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403 && err.errors == null) {
        toast.show('Verify your number to finish logging in.');
        navigate('/verify', { state: { phone: fullPhone(), purpose: 'login', debugCode: err.body?.debug_code } });
        return;
      }
      const message = err instanceof ApiError ? (err.errors?.phone?.[0] ?? err.message) : 'Something went wrong.';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function sendCodeInstead() {
    if (!form.phone) {
      setError('Enter your phone number first.');
      return;
    }
    setBusyCode(true);
    setError('');
    try {
      const res = await resendOtp({ phone: fullPhone(), purpose: 'login' });
      navigate('/verify', { state: { phone: fullPhone(), purpose: 'login', debugCode: res.debug_code } });
    } catch (err) {
      const message = err instanceof ApiError ? (err.errors?.phone?.[0] ?? err.message) : 'Something went wrong.';
      setError(message);
      toast.error(message);
    } finally {
      setBusyCode(false);
    }
  }

  return (
    <Modal onClose={close} maxWidth={440}>
      <div className="anim-fade-in" style={{ background: 'var(--surface-brand)', padding: '32px 32px 24px', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)' }}>
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>BuySellSwap</span>
        <h1 style={{ marginTop: 14, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', fontWeight: 800 }}>Welcome back</h1>
        <p style={{ marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,.8)' }}>Log in to check your orders, saved gadgets and listings.</p>
      </div>

      <form onSubmit={onSubmit} className="anim-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: '24px 32px 32px' }}>
        <div className="anim-fade-up" style={{ '--stagger-i': 0 }}>
          <Input label="Phone number" type="tel" prefix="+234" value={form.phone} onChange={set('phone')} />
        </div>
        <div className="anim-fade-up" style={{ '--stagger-i': 1 }}>
          <Input label="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')}
            suffix={<PasswordToggle shown={showPassword} onClick={() => setShowPassword((s) => !s)} />} />
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Checkbox label="Keep me signed in" checked={keepSignedIn} onChange={setKeepSignedIn} />
          <button type="button" onClick={sendCodeInstead} disabled={busyCode} style={{ all: 'unset', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-link)' }}>
            Forgot password?
          </button>
        </div>

        {error ? <p className="anim-shake" style={{ color: 'var(--red-500)', fontSize: 'var(--text-sm)' }}>{error}</p> : null}

        <div className="anim-fade-up" style={{ '--stagger-i': 3 }}>
          <Button type="submit" fullWidth size="lg" loading={busy}>{busy ? 'Logging in…' : 'Log in'}</Button>
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 4, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>or</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 5 }}>
          <Button type="button" variant="secondary" fullWidth size="lg" loading={busyCode} onClick={sendCodeInstead}>
            {busyCode ? 'Sending…' : 'Send me a code instead'}
          </Button>
        </div>

        <span className="anim-fade-up" style={{ '--stagger-i': 6, fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
          New to BuySellSwap? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} style={{ fontWeight: 600 }}>Create account</a>
        </span>
      </form>
    </Modal>
  );
}
