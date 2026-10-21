import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { AccountSidebar } from '../components/account/AccountSidebar.jsx';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import '../pages/Home.css';
import './OrdersPage.css';

const STATUS_TONE = {
  pending_payment: 'pending', paid: 'brand', processing: 'brand', out_for_delivery: 'brand',
  delivered: 'warning', completed: 'verified', cancelled: 'muted', refunded: 'muted',
};

function StatusPill({ order }) {
  const needsConfirm = (order.seller_orders ?? []).some((so) => so.status === 'delivered' && so.escrow_status === 'held');
  const label = needsConfirm ? 'Delivered, confirm receipt' : order.status_label;
  const tone = needsConfirm ? 'warning' : (STATUS_TONE[order.status] ?? 'brand');
  return <span className={`op-pill op-pill-${tone}`}>{label}</span>;
}

export function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('active');

  const { data: body, isPending } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api('/orders'),
    enabled: !!user,
  });
  const orders = body?.data ?? [];
  const active = orders.filter((o) => !['completed', 'cancelled', 'refunded'].includes(o.status));
  const completed = orders.filter((o) => o.status === 'completed');
  const shown = tab === 'active' ? active : completed;

  if (!user) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="package" size={24} />} title="Log in to see your orders"
          action={<Button onClick={() => navigate('/login')}>Log in</Button>} />
      </div>
    );
  }

  return (
    <>
      <div className="home-container" style={{ paddingTop: 24, paddingBottom: 72 }}>
        <div className="cart-breadcrumb">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>Orders</span>
        </div>

        <div className="op-layout">
          <AccountSidebar active="orders" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1 className="cart-title" style={{ fontSize: 28, paddingBottom: 0 }}>Orders</h1>
            <div className="op-tabs">
              <button type="button" className={tab === 'active' ? 'is-active' : ''} onClick={() => setTab('active')}>
                Active {active.length ? <span>{active.length}</span> : null}
              </button>
              <button type="button" className={tab === 'completed' ? 'is-active' : ''} onClick={() => setTab('completed')}>
                Completed {completed.length ? <span>{completed.length}</span> : null}
              </button>
            </div>

            {isPending ? (
              <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}><Spinner size={24} color="var(--brand-primary)" /></div>
            ) : shown.length === 0 ? (
              <EmptyState icon={<Icon name="package" size={24} />}
                title={tab === 'active' ? 'No active orders' : 'No completed orders yet'}
                body={tab === 'active' ? "Orders you've placed will show up here." : undefined}
                action={tab === 'active' ? <Button onClick={() => navigate('/search')}>Start browsing</Button> : undefined} />
            ) : (
              shown.map((order) => (
                <div key={order.id} className="op-card">
                  <div className="op-card-top">
                    <div>
                      <span className="op-number">#{order.number}</span>
                      <span className="op-date">Placed {new Date(order.placed_at ?? order.id).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <StatusPill order={order} />
                  </div>
                  <div className="op-items">
                    {order.seller_orders.flatMap((so) => (so.items ?? []).map((item) => (
                      <div key={item.id} className="op-item">
                        {item.image_url ? <img src={item.image_url} alt="" /> : <div className="op-item-noimage"><Icon name="smartphone" size={20} color="var(--text-faint)" /></div>}
                        <div>
                          <span>{item.title}</span>
                          <span className="op-item-seller">{so.seller?.shop_name}</span>
                        </div>
                      </div>
                    )))}
                  </div>
                  <div className="op-card-bottom">
                    <div>
                      <span className="op-total-label">Total</span>
                      <span className="op-total-amount">{order.total_label}</span>
                    </div>
                    <Button onClick={() => navigate(`/orders/${order.id}`)}>View order</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </>
  );
}
