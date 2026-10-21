import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/feedback/Modal.jsx';
import { OtpInput } from '../../components/ui/forms/OtpInput.jsx';
import { Button } from '../../components/ui/core/Button.jsx';
import { Icon } from '../../components/ui/core/Icon.jsx';
import { useAuth } from '../../lib/auth.jsx';
import { useToast } from '../../lib/toast.jsx';
import { ApiError } from '../../lib/api.js';

const RESEND_SECONDS = 60;

function formatCountdown(s) {
  return `0:${String(s).padStart(2, '0')}`;
}

export function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  const toast = useToast();
  const phone = location.state?.phone;
  const debugCode = location.state?.debugCode;
  const purpose = location.state?.purpose ?? 'register';

  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(RESEND_SECONDS);

  React.useEffect(() => {
    if (!phone) navigate('/', { replace: true });
  }, [phone, navigate]);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  React.useEffect(() => {
    if (code.length === 6 && !busy) verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function verify() {
    setBusy(true);
    setError('');
    try {
      const body = await verifyOtp({ phone, code, purpose });
      toast.success(`Welcome, ${body.user.name.split(' ')[0]}! You're all set.`);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? (err.errors?.code?.[0] ?? err.message) : 'Something went wrong.';
      setError(message);
      setCode('');
    } finally {
      setBusy(false);
    }
  }

  async function onResend() {
    setError('');
    setResending(true);
    try {
      await resendOtp({ phone, purpose });
      setCountdown(RESEND_SECONDS);
      toast.success('A new code is on its way.');
    } catch (err) {
      toast.error(err.message || 'Could not resend the code.');
    } finally {
      setResending(false);
    }
  }

  if (!phone) return null;

  return (
    <Modal onClose={() => navigate('/')} maxWidth={440}>
      <div className="anim-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', padding: 32 }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="anim-fade-up" style={{ '--stagger-i': 0, all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
          <Icon name="arrow-left" size={15} /> Back
        </button>

        <div className="anim-fade-up" style={{ '--stagger-i': 1, display: 'grid', gap: 'var(--space-2)' }}>
          <h1 style={{ fontSize: 24, letterSpacing: '-0.03em' }}>Enter the code</h1>
          <p style={{ fontSize: 14, color: 'var(--text-body)' }}>We sent a 6-digit code to <b style={{ color: 'var(--text-strong)' }}>{phone}</b>.</p>
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 2 }}>
          <OtpInput value={code} onChange={setCode} error={error} disabled={busy} />
        </div>

        {debugCode ? (
          <p className="anim-fade-up" style={{ '--stagger-i': 3, fontSize: 13, color: 'var(--text-muted)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: 12 }}>
            Development mode (no SMS provider yet): your code is <strong>{debugCode}</strong>.
          </p>
        ) : null}

        <div className="anim-fade-up" style={{ '--stagger-i': 4 }}>
          {countdown > 0 ? (
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Resend code in {formatCountdown(countdown)}</span>
          ) : (
            <button type="button" onClick={onResend} disabled={resending}
              style={{ all: 'unset', cursor: resending ? 'default' : 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text-link)' }}>
              {resending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </div>

        <div className="anim-fade-up" style={{ '--stagger-i': 5 }}>
          <Button fullWidth size="lg" loading={busy} disabled={code.length < 6} onClick={verify}>
            {busy ? 'Verifying…' : 'Verify'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
