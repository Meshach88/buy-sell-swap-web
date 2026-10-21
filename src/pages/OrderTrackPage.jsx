import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { usePayOrder } from '../lib/checkout.js';
import { useToast } from '../lib/toast.jsx';
import { AccountSidebar } from '../components/account/AccountSidebar.jsx';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import '../pages/Home.css';
import './OrderTrackPage.css';

const STEPS = [
  { key: 'placed', label: 'Order placed', done: (o) => !!o.placed_at, at: (o) => o.placed_at },
  { key: 'paid', label: 'Payment held', done: (o) => !!o.paid_at, at: (o) => o.paid_at },
  { key: 'packed', label: 'Packed by seller', done: (_o, so) => !!so.packed_at, at: (_o, so) => so.packed_at },
  { key: 'with_rider', label: 'Out for delivery', done: (_o, so) => !!so.handed_over_at, at: (_o, so) => so.handed_over_at, current: (_o, so) => so.status === 'with_rider' },
  { key: 'delivered', label: 'Delivered', done: (_o, so) => !!so.delivered_at, at: (_o, so) => so.delivered_at },
];

function fmt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return { date: d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }), time: d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' }) };
}

function StepTracker({ order, sellerOrder }) {
  const doneFlags = STEPS.map((s) => s.done(order, sellerOrder));
  const currentIndex = doneFlags.lastIndexOf(true);
  return (
    <div className="track-steps">
      {STEPS.map((s, i) => {
        const done = doneFlags[i];
        const isCurrent = !done && i === currentIndex + 1;
        return (
          <div key={s.key} className="track-step">
            {i > 0 ? <span className={`track-step-line ${doneFlags[i - 1] ? 'is-done' : ''}`} /> : null}
            <span className={`track-step-dot ${done ? 'is-done' : isCurrent ? 'is-current' : ''}`}>
              {done ? <Icon name="check" size={13} color="#fff" /> : isCurrent ? <span className="track-step-pulse" /> : null}
            </span>
            <span className="track-step-label">{s.label}</span>
            {done ? (
              <span className="track-step-time">
                <span>{fmt(s.at(order, sellerOrder)).date}</span>
                <span>{fmt(s.at(order, sellerOrder)).time}</span>
              </span>
            ) : (
              <span className="track-step-time">{isCurrent ? <span>In progress</span> : null}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SellerOrderCard({ order, sellerOrder, onConfirm, confirming }) {
  const canConfirm = sellerOrder.status === 'delivered' && sellerOrder.escrow_status === 'held';
  const toast = useToast();
  return (
    <div className="track-card">
      <div className="track-card-header">
        <span className="track-seller-name">{sellerOrder.seller?.shop_name}</span>
        <span className={`op-pill op-pill-${canConfirm ? 'warning' : 'brand'}`}>{sellerOrder.status_label}</span>
      </div>
      <StepTracker order={order} sellerOrder={sellerOrder} />
      <div className="track-items">
        {(sellerOrder.items ?? []).map((item) => (
          <div key={item.id} className="track-item">
            {item.image_url ? <img src={item.image_url} alt="" /> : <div className="track-item-noimage"><Icon name="smartphone" size={20} color="var(--text-faint)" /></div>}
            <div>
              <span>{item.title}</span>
              <span className="track-item-sub">{sellerOrder.seller?.shop_name} · {item.unit_price_label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="track-confirm">
        <Button fullWidth size="lg" disabled={!canConfirm} loading={confirming} onClick={() => onConfirm(sellerOrder.id)}>
          Confirm receipt
        </Button>
        <Button fullWidth size="lg" variant="secondary" onClick={() => toast.show('Reporting a problem is coming soon.')}>Report a problem</Button>
      </div>
    </div>
  );
}

export function OrderTrackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const payOrder = usePayOrder();
  const [confirmingId, setConfirmingId] = React.useState(null);

  const { data: body, isPending, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api(`/orders/${id}`),
    enabled: !!user,
    retry: false,
  });
  const order = body?.data;

  async function confirmDelivery(sellerOrderId) {
    setConfirmingId(sellerOrderId);
    try {
      const result = await api(`/orders/${id}/seller-orders/${sellerOrderId}/confirm-delivery`, { method: 'POST' });
      queryClient.setQueryData(['order', id], result);
      toast.success('Delivery confirmed. Thanks!');
    } catch (err) {
      toast.error(err.message ?? 'Could not confirm delivery.');
    } finally {
      setConfirmingId(null);
    }
  }

  async function retryPayment() {
    try {
      const result = await payOrder.mutateAsync(order.id);
      window.location.href = result.authorization_url;
    } catch (err) {
      toast.error(err.message ?? 'Could not start payment.');
    }
  }

  if (!user) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="lock" size={24} />} title="Log in to view this order"
          action={<Button onClick={() => navigate('/login')}>Log in</Button>} />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="home-container" style={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}>
        <Spinner size={28} color="var(--brand-primary)" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="search-x" size={24} />} title="Order not found"
          action={<Button onClick={() => navigate('/orders')}>Back to orders</Button>} />
      </div>
    );
  }

  return (
    <>
      <div className="home-container" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="cart-breadcrumb">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>Orders</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>#{order.number}</span>
        </div>

        <div className="track-title-row">
          <h1>Order #{order.number}</h1>
          <span className="op-pill op-pill-brand">{order.status_label}</span>
        </div>

        <div className="op-layout">
          <AccountSidebar active="orders" />

          <div className="co-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {order.status === 'pending_payment' ? (
                <div className="track-payment-banner">
                  <div>
                    <span>Payment wasn't completed</span>
                    <span>Finish paying to confirm this order with the seller.</span>
                  </div>
                  <Button loading={payOrder.isPending} onClick={retryPayment}>Pay now</Button>
                </div>
              ) : null}

              {(order.seller_orders ?? []).map((so) => (
                <SellerOrderCard key={so.id} order={order} sellerOrder={so}
                  onConfirm={confirmDelivery} confirming={confirmingId === so.id} />
              ))}
            </div>

            <div className="cart-summary">
              <h3>Delivery address</h3>
              <p className="track-address">{order.delivery_name} · {order.delivery_phone}<br />{order.delivery_street}, {order.delivery_area}, Kaduna</p>
              <div className="cart-divider" />
              <h3>Payment</h3>
              <div className="cart-summary-lines">
                <div><span>Items</span><span>{order.subtotal_label}</span></div>
                <div><span>Delivery</span><span>{order.delivery_fee_label}</span></div>
              </div>
              <div className="cart-divider" />
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-amount">{order.total_label}</span>
              </div>
              <div className="cart-trust">
                <span className="cart-trust-icon"><Icon name="shield-check" size={14} color="var(--brand-primary)" /></span>
                <span>{order.status === 'completed' ? 'Released to sellers.' : `${order.total_label} is held until you confirm delivery.`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </>
  );
}
