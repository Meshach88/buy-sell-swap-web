import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import '../pages/Home.css';

/** Fast-path confirmation right after Paystack's hosted checkout redirects the
 * buyer back — calls the same verify endpoint the webhook relies on as the
 * authoritative fallback, so this page is a convenience, not a requirement. */
export function PaystackCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const reference = params.get('reference') ?? params.get('trxref');

  const { data: body, isPending, isError } = useQuery({
    queryKey: ['payment-verify', reference],
    queryFn: () => api(`/payments/${reference}/verify`),
    enabled: !!reference,
    retry: false,
  });
  const confirmed = body?.data?.status === 'success';
  const orderId = body?.data?.order?.id;

  React.useEffect(() => {
    if (confirmed && orderId) navigate(`/orders/${orderId}`, { replace: true });
  }, [confirmed, orderId, navigate]);

  if (!reference || isError) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="triangle-alert" size={24} />} title="Something went wrong"
          body="We couldn't confirm that payment reference." action={<Button onClick={() => navigate('/orders')}>Go to orders</Button>} />
      </div>
    );
  }

  if (isPending || confirmed) {
    return (
      <div className="home-container" style={{ padding: '96px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Spinner size={32} color="var(--brand-primary)" />
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Confirming your payment…</p>
      </div>
    );
  }

  return (
    <div className="home-container" style={{ padding: '56px 0' }}>
      <EmptyState icon={<Icon name="triangle-alert" size={24} />} title="Payment not confirmed yet"
        body="Paystack hasn't confirmed this payment yet. If you completed it, this usually catches up within a minute — check your order."
        action={<Button onClick={() => navigate(orderId ? `/orders/${orderId}` : '/orders')}>View order</Button>} />
    </div>
  );
}
