import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../lib/cart.js';
import { useToast } from '../lib/toast.jsx';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { Avatar } from '../components/ui/core/Avatar.jsx';
import { ConditionBadge } from '../components/ui/marketplace/ConditionBadge.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import '../pages/Home.css';
import './CartPage.css';

function QuantityStepper({ quantity, max, onChange }) {
  return (
    <div className="cart-stepper">
      <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => onChange(quantity - 1)}>
        <Icon name="minus" size={14} />
      </button>
      <span>{quantity}</span>
      <button type="button" aria-label="Increase quantity" disabled={quantity >= max} onClick={() => onChange(quantity + 1)}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

function CartItemRow({ item, onChangeQuantity, onRemove, busy }) {
  const listing = item.listing;
  return (
    <div className="cart-item-row" style={{ opacity: item.available ? 1 : 0.55 }}>
      {listing.primary_image_url ? (
        <img src={listing.primary_image_url} alt="" />
      ) : (
        <div className="cart-item-noimage"><Icon name="smartphone" size={28} color="var(--text-faint)" /></div>
      )}
      <div className="cart-item-info">
        <span className="cart-item-title">{listing.title}</span>
        <div>
          {item.available ? <ConditionBadge condition={listing.condition} size="sm" /> : (
            <span className="cart-item-unavailable">No longer available</span>
          )}
        </div>
      </div>
      {item.available ? (
        <QuantityStepper quantity={item.quantity} max={item.max_quantity} onChange={(q) => onChangeQuantity(item.id, q)} />
      ) : <span />}
      <div className="cart-item-price">
        <span>{item.line_total_label}</span>
        <button type="button" aria-label="Remove" disabled={busy} onClick={() => onRemove(item.id)}>
          <Icon name="trash-2" size={18} color="var(--text-faint)" />
        </button>
      </div>
    </div>
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { data: body, isPending } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const items = body?.items ?? [];
  const groupsMap = new Map();
  for (const item of items) {
    const seller = item.listing.seller;
    const key = seller?.id ?? 'unknown';
    if (!groupsMap.has(key)) groupsMap.set(key, { seller, items: [] });
    groupsMap.get(key).items.push(item);
  }
  const groups = [...groupsMap.values()];

  const allAvailable = items.length > 0 && items.every((i) => i.available);

  if (!user) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="shopping-cart" size={24} />} title="Log in to see your cart"
          body="Your cart is tied to your account." action={<Button onClick={() => navigate('/login')}>Log in</Button>} />
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

  if (items.length === 0) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="shopping-cart" size={24} />} title="Your cart is empty"
          body="Find something good in Fresh in Kaduna or search for what you need." action={<Button onClick={() => navigate('/search')}>Start browsing</Button>} />
      </div>
    );
  }

  return (
    <>
      <div className="home-container" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="cart-breadcrumb">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>Cart</span>
        </div>

        <h1 className="cart-title">Cart <span>{items.length} item{items.length === 1 ? '' : 's'} from {groups.length} seller{groups.length === 1 ? '' : 's'}</span></h1>

        <div className="cart-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {groups.map(({ seller, items: groupItems }) => (
              <div key={seller?.id ?? 'unknown'} className="cart-seller-card">
                <div className="cart-seller-header">
                  <Avatar name={seller?.shop_name ?? '?'} size="sm" verified={seller?.verified} />
                  <span className="cart-seller-name">{seller?.shop_name ?? 'Unknown seller'}</span>
                  <span className="cart-seller-area">{seller?.area ? `${seller.area}, Kaduna` : 'Kaduna'}</span>
                </div>
                {groupItems.map((item) => (
                  <CartItemRow key={item.id} item={item}
                    busy={updateItem.isPending || removeItem.isPending}
                    onChangeQuantity={(id, q) => updateItem.mutate({ cartItemId: id, quantity: q })}
                    onRemove={(id) => removeItem.mutate(id)} />
                ))}
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order summary</h3>
            <div className="cart-promo">
              <div className="cart-promo-input">
                <Icon name="ticket" size={18} color="var(--text-muted)" />
                <input type="text" placeholder="Promo code" aria-label="Promo code" />
              </div>
              <Button variant="secondary" onClick={() => toast.show('Promo codes aren\'t available yet.')}>Apply</Button>
            </div>
            <div className="cart-summary-lines">
              <div><span>Subtotal · {items.length} item{items.length === 1 ? '' : 's'}</span><span>{body.subtotal_label}</span></div>
              <div><span>Delivery</span><span>Calculated at checkout</span></div>
            </div>
            <div className="cart-divider" />
            <div className="cart-total">
              <span>Estimated total</span>
              <span className="cart-total-amount">{body.subtotal_label}</span>
            </div>
            <Button fullWidth size="lg" disabled={!allAvailable} onClick={() => navigate('/checkout')}>Checkout</Button>
            {!allAvailable ? (
              <p className="cart-warning">Remove unavailable items to continue.</p>
            ) : null}
            <div className="cart-trust">
              <span className="cart-trust-icon"><Icon name="shield-check" size={14} color="var(--brand-primary)" /></span>
              <span>Your payment is held until you confirm delivery.</span>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </>
  );
}
