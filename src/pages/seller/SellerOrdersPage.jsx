import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast.jsx';
import { Icon } from '../../components/ui/core/Icon.jsx';
import { Button } from '../../components/ui/core/Button.jsx';
import { EmptyState } from '../../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../../components/ui/feedback/Spinner.jsx';
import './SellerOrdersPage.css';

const TABS = [
  { key: 'new', label: 'New', match: (s) => s.status === 'new' },
  { key: 'to_ship', label: 'To ship', match: (s) => ['accepted', 'packed'].includes(s.status) },
  { key: 'shipped', label: 'Shipped', match: (s) => s.status === 'with_rider' },
  { key: 'completed', label: 'Completed', match: (s) => s.status === 'delivered' },
];

const ACTION = {
  accepted: { label: 'Accept', path: 'accept' },
  packed: { label: 'Mark as packed', path: 'pack' },
  with_rider: { label: 'Hand to rider', path: 'hand-to-rider' },
  delivered: { label: 'Mark delivered', path: 'mark-delivered' },
};

export function SellerOrdersPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = React.useState('new');

  const { data: body, isPending } = useQuery({ queryKey: ['seller-orders'], queryFn: () => api('/seller/orders') });
  const advance = useMutation({
    mutationFn: ({ id, path }) => api(`/seller/orders/${id}/${path}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller-orders'] }),
    onError: (err) => toast.error(err.message ?? 'Could not update that order.'),
  });

  const sellerOrders = body?.data ?? [];
  const counts = Object.fromEntries(TABS.map((t) => [t.key, sellerOrders.filter(t.match).length]));
  const shown = sellerOrders.filter(TABS.find((t) => t.key === tab).match);

  return (
    <div className="so-page">
      <div className="so-header">
        <div>
          <h1>Orders</h1>
          <span>{counts.new} new · {counts.to_ship} to ship</span>
        </div>
      </div>

      <div className="so-tabs">
        {TABS.map((t) => (
          <button key={t.key} type="button" className={tab === t.key ? 'is-active' : ''} onClick={() => setTab(t.key)}>
            {t.label}<span>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {isPending ? (
        <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}><Spinner size={24} color="var(--brand-primary)" /></div>
      ) : shown.length === 0 ? (
        <EmptyState icon={<Icon name="package" size={24} />} title={`No ${TABS.find((t) => t.key === tab).label.toLowerCase()} orders`}
          body="Orders will show up here as buyers check out." />
      ) : (
        <div className="so-list">
          {shown.map((so) => {
            const action = ACTION[so.next_status];
            return (
              <div key={so.id} className="so-card">
                <div className="so-card-top">
                  <div>
                    <span className="so-number">#{so.order_number}</span>
                    <span className="so-buyer">{so.buyer_name} · {so.delivery_area}</span>
                  </div>
                  <div className="so-pills">
                    <span className="so-pill so-pill-held">{so.escrow_status === 'released' ? 'Released' : 'Payment held'}</span>
                    <span className="so-pill so-pill-status">{so.status_label}</span>
                  </div>
                </div>
                <div className="so-items">
                  {(so.items ?? []).map((item) => (
                    <div key={item.id} className="so-item">
                      {item.image_url ? <img src={item.image_url} alt="" /> : <div className="so-item-noimage"><Icon name="smartphone" size={18} color="var(--text-faint)" /></div>}
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
                <div className="so-card-bottom">
                  <span className="so-total">{so.subtotal_label}</span>
                  <div className="so-actions">
                    <Button variant="ghost" onClick={() => navigate(`/sell/orders/${so.id}`)}>View</Button>
                    {action ? (
                      <Button loading={advance.isPending && advance.variables?.id === so.id}
                        onClick={() => advance.mutate({ id: so.id, path: action.path })}>
                        {action.label}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
