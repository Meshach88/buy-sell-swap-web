import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast.jsx';
import { Icon } from '../../components/ui/core/Icon.jsx';
import { Button } from '../../components/ui/core/Button.jsx';
import { EmptyState } from '../../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../../components/ui/feedback/Spinner.jsx';
import './SellerOrderDetailPage.css';

const ACTION = {
  accepted: { label: 'Accept order', path: 'accept' },
  packed: { label: 'Mark as packed', path: 'pack' },
  with_rider: { label: 'Hand to rider', path: 'hand-to-rider' },
  delivered: { label: 'Mark delivered', path: 'mark-delivered' },
};

function fmt(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) + ', ' + new Date(iso).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' });
}

function Timeline({ so }) {
  const steps = [
    { label: 'Order received', sub: `Payment held by BuySellSwap · ${fmt(so.order_placed_at)}`, done: true },
    { label: 'You accepted', sub: so.accepted_at ? fmt(so.accepted_at) : 'Accept the order to continue', done: !!so.accepted_at },
    { label: 'Pack the item', sub: so.packed_at ? fmt(so.packed_at) : 'Include the charger and box', done: !!so.packed_at },
    { label: 'Rider collects', sub: so.handed_over_at ? `Picked up · ${fmt(so.handed_over_at)}` : 'Give the rider the handover code', done: !!so.handed_over_at },
    { label: 'Buyer confirms delivery', sub: so.buyer_confirmed_at ? `Confirmed · ${fmt(so.buyer_confirmed_at)}` : 'You are paid after this', done: !!so.buyer_confirmed_at },
  ];
  const currentIndex = steps.map((s) => s.done).lastIndexOf(true) + 1;

  return (
    <div className="sod-timeline">
      {steps.map((s, i) => {
        const isCurrent = !s.done && i === currentIndex;
        return (
          <div key={s.label} className="sod-timeline-row">
            <div className="sod-timeline-rail">
              <span className={`sod-timeline-dot ${s.done ? 'is-done' : isCurrent ? 'is-current' : ''}`}>
                {s.done ? <Icon name="check" size={13} color="#fff" /> : isCurrent ? <span className="sod-timeline-pulse" /> : null}
              </span>
              {i < steps.length - 1 ? <span className={`sod-timeline-line ${s.done ? 'is-done' : ''}`} /> : null}
            </div>
            <div className="sod-timeline-text">
              <span className={s.done || isCurrent ? 'is-strong' : ''}>{s.label}</span>
              <span>{s.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SellerOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: body, isPending, isError } = useQuery({
    queryKey: ['seller-order', id],
    queryFn: () => api(`/seller/orders/${id}`),
    retry: false,
  });
  const advance = useMutation({
    mutationFn: (path) => api(`/seller/orders/${id}/${path}`, { method: 'POST' }),
    onSuccess: (result) => {
      queryClient.setQueryData(['seller-order', id], result);
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
    },
    onError: (err) => toast.error(err.message ?? 'Could not update that order.'),
  });

  if (isPending) {
    return <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}><Spinner size={24} color="var(--brand-primary)" /></div>;
  }
  if (isError || !body?.data) {
    return <EmptyState icon={<Icon name="search-x" size={24} />} title="Order not found" action={<Button onClick={() => navigate('/sell/orders')}>Back to orders</Button>} />;
  }

  const so = body.data;
  const item = (so.items ?? [])[0];
  const action = ACTION[so.next_status];
  const code = so.handover_code ?? '';

  return (
    <div className="sod-page">
      <div className="sod-header">
        <div>
          <h1>Order #{so.order_number}</h1>
          <span>Placed {fmt(so.order_placed_at)}</span>
        </div>
        <span className="sod-pill">{so.status_label}</span>
      </div>

      <div className="sod-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="sod-card">
            <h3>Item</h3>
            {item ? (
              <div className="sod-item">
                {item.image_url ? <img src={item.image_url} alt="" /> : <div className="sod-item-noimage"><Icon name="smartphone" size={24} color="var(--text-faint)" /></div>}
                <span className="sod-item-title">{item.title}</span>
                <span className="sod-item-price">{item.unit_price_label}</span>
              </div>
            ) : null}
          </div>

          <div className="sod-card">
            <h3>Progress</h3>
            <Timeline so={so} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {code ? (
            <div className="sod-code-card">
              <span>RIDER HANDOVER CODE</span>
              <div className="sod-code-digits">
                {code.split('').slice(0, 4).map((c, i) => <span key={i}>{c}</span>)}
              </div>
              <p>Give this code to the rider when they collect the parcel.</p>
            </div>
          ) : null}

          <div className="sod-card">
            <h3>Buyer and delivery</h3>
            <div className="sod-kv"><span>Buyer</span><span>{so.buyer_name}</span></div>
            <div className="sod-kv"><span>Area</span><span>{so.delivery_area}, Kaduna</span></div>
            <div className="sod-kv"><span>Delivery</span><span>{so.delivery_method === 'pickup' ? 'Buyer picks up' : 'Delivery to buyer'}</span></div>
            <p className="sod-note">Buyer contact details stay private. Use BuySellSwap support for questions.</p>
          </div>

          <div className="sod-card">
            <h3>Payout</h3>
            <div className="sod-kv"><span>Sale price</span><span>{so.subtotal_label}</span></div>
            <div className="sod-kv"><span>Commission</span><span>−{so.commission_label}</span></div>
            <div className="sod-divider" />
            <div className="sod-kv sod-kv-strong"><span>You receive</span><span>{so.net_label}</span></div>
          </div>

          {action ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button fullWidth size="lg" loading={advance.isPending} onClick={() => advance.mutate(action.path)}>{action.label}</Button>
              <Button fullWidth size="lg" variant="ghost" onClick={() => toast.show('Cancelling an order is coming soon.')}>Cancel order</Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
