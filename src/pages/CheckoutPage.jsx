import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { useCart } from '../lib/cart.js';
import { useAddresses, useCreateAddress, useCreateCheckout, usePayOrder } from '../lib/checkout.js';
import { useToast } from '../lib/toast.jsx';
import { formatNaira } from '../lib/money.js';
import { KADUNA_AREAS } from '../lib/areas.js';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { Input } from '../components/ui/forms/Input.jsx';
import { Select } from '../components/ui/forms/Select.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import '../pages/Home.css';
import './CheckoutPage.css';

function StepHeading({ n, title }) {
  return (
    <div className="co-step-heading">
      <span className="co-step-number">{n}</span>
      <h3>{title}</h3>
    </div>
  );
}

function RadioRow({ selected, title, body, trailing, onClick, disabled }) {
  return (
    <div className={`co-radio-row ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`} onClick={disabled ? undefined : onClick}>
      <span className="co-radio-dot">{selected ? <span /> : null}</span>
      <div className="co-radio-text">
        <span className="co-radio-title">{title}</span>
        <span className="co-radio-body">{body}</span>
      </div>
      {trailing ? <span className="co-radio-trailing">{trailing}</span> : null}
    </div>
  );
}

function NewAddressForm({ onCancel, onCreated }) {
  const createAddress = useCreateAddress();
  const toast = useToast();
  const [form, setForm] = React.useState({ recipient_name: '', phone: '', street: '', area: KADUNA_AREAS[0] });

  async function submit(e) {
    e.preventDefault();
    try {
      const body = await createAddress.mutateAsync(form);
      onCreated(body.data);
    } catch (err) {
      toast.error(err.message ?? 'Could not save that address.');
    }
  }

  return (
    <form className="co-new-address" onSubmit={submit}>
      <Input label="Recipient name" value={form.recipient_name} onChange={(v) => setForm((f) => ({ ...f, recipient_name: v }))} />
      <Input label="Phone number" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
      <Input label="Street address" value={form.street} onChange={(v) => setForm((f) => ({ ...f, street: v }))} />
      <Select label="Area" value={form.area} onChange={(v) => setForm((f) => ({ ...f, area: v }))} options={KADUNA_AREAS} />
      <div className="co-new-address-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={createAddress.isPending}>Save address</Button>
      </div>
    </form>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { data: cartBody, isPending: cartPending } = useCart();
  const { data: addressesBody, isPending: addressesPending } = useAddresses();
  const createCheckout = useCreateCheckout();
  const payOrder = usePayOrder();

  const [selectedAddressId, setSelectedAddressId] = React.useState(null);
  const [addingAddress, setAddingAddress] = React.useState(false);
  const [deliveryMethod, setDeliveryMethod] = React.useState('delivery');
  const [pendingOrderId, setPendingOrderId] = React.useState(null);
  const [paymentError, setPaymentError] = React.useState(null);

  const addresses = addressesBody?.data ?? [];
  const cartItems = cartBody?.items ?? [];

  // No address picked yet (including on first load, before the user has clicked a radio) falls
  // back to the account's default — derived at render time rather than synced via an effect.
  const effectiveAddressId = selectedAddressId ?? (addresses.find((a) => a.is_default) ?? addresses[0])?.id;
  const selectedAddress = addresses.find((a) => a.id === effectiveAddressId);
  const canDeliver = !!selectedAddress?.delivery_zone;
  const effectiveDeliveryMethod = canDeliver ? deliveryMethod : 'pickup';

  const deliveryFeeKobo = effectiveDeliveryMethod === 'delivery' ? (selectedAddress?.delivery_zone?.fee_kobo ?? 0) : 0;
  const subtotalKobo = cartBody?.subtotal_kobo ?? 0;
  const totalKobo = subtotalKobo + deliveryFeeKobo;

  async function placeOrder() {
    setPaymentError(null);
    try {
      let orderId = pendingOrderId;
      if (!orderId) {
        const body = await createCheckout.mutateAsync({ address_id: effectiveAddressId, delivery_method: effectiveDeliveryMethod });
        orderId = body.data.id;
        setPendingOrderId(orderId);
      }
      const payBody = await payOrder.mutateAsync(orderId);
      window.location.href = payBody.authorization_url;
    } catch (err) {
      if (pendingOrderId) {
        setPaymentError(err.message ?? 'Payment could not be started. Please try again.');
      } else {
        toast.error(err.errors?.cart?.[0] ?? err.errors?.address_id?.[0] ?? err.message ?? 'Could not start checkout.');
      }
    }
  }

  if (!user) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="lock" size={24} />} title="Log in to checkout"
          action={<Button onClick={() => navigate('/login')}>Log in</Button>} />
      </div>
    );
  }

  if (cartPending || addressesPending) {
    return (
      <div className="home-container" style={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}>
        <Spinner size={28} color="var(--brand-primary)" />
      </div>
    );
  }

  if (cartItems.length === 0 && !pendingOrderId) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="shopping-cart" size={24} />} title="Your cart is empty"
          body="Add something to your cart before checking out." action={<Button onClick={() => navigate('/search')}>Start browsing</Button>} />
      </div>
    );
  }

  const busy = createCheckout.isPending || payOrder.isPending;

  return (
    <>
      <div className="home-container" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="cart-breadcrumb">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>Cart</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>Checkout</span>
        </div>
        <h1 className="cart-title" style={{ fontSize: 28 }}>Checkout</h1>

        <div className="co-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="co-card">
              <StepHeading n={1} title="Delivery address" />
              {addresses.length === 0 && !addingAddress ? (
                <p className="co-muted">You don't have a saved address yet.</p>
              ) : null}
              {addresses.map((a) => (
                <RadioRow key={a.id} selected={a.id === effectiveAddressId} onClick={() => setSelectedAddressId(a.id)}
                  title={`${a.recipient_name} · ${a.phone}`} body={`${a.street}, ${a.area}, Kaduna`} />
              ))}
              {addingAddress ? (
                <NewAddressForm onCancel={() => setAddingAddress(false)}
                  onCreated={(address) => { setSelectedAddressId(address.id); setAddingAddress(false); }} />
              ) : (
                <div>
                  <Button variant="ghost" icon={<Icon name="plus" size={16} />} onClick={() => setAddingAddress(true)}>Add a new address</Button>
                </div>
              )}
            </div>

            <div className="co-card">
              <StepHeading n={2} title="Delivery" />
              <RadioRow selected={effectiveDeliveryMethod === 'delivery'} disabled={!canDeliver} onClick={() => setDeliveryMethod('delivery')}
                title="Home delivery"
                body={canDeliver ? `${selectedAddress.delivery_zone.name} · ${selectedAddress.delivery_zone.eta_label ?? 'Standard delivery'}` : "We don't deliver to this area yet"}
                trailing={canDeliver ? formatNaira(selectedAddress.delivery_zone.fee_kobo) : null} />
              <RadioRow selected={effectiveDeliveryMethod === 'pickup'} onClick={() => setDeliveryMethod('pickup')}
                title="Pick up from seller" body="Arrange pickup directly with the seller" trailing="Free" />
            </div>

            <div className="co-card">
              <StepHeading n={3} title="Payment" />
              <div className="co-payment-note">
                <Icon name="shield-check" size={18} color="var(--brand-primary)" />
                <span>You'll choose how to pay — bank transfer, card or USSD — on the next screen, handled securely by Paystack.</span>
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="co-summary-item">
                {item.listing.primary_image_url ? <img src={item.listing.primary_image_url} alt="" /> : <div className="co-summary-noimage"><Icon name="smartphone" size={18} color="var(--text-faint)" /></div>}
                <div>
                  <span className="co-summary-title">{item.listing.title}</span>
                  <span className="co-summary-seller">{item.listing.seller?.shop_name}</span>
                </div>
                <span className="co-summary-price">{item.line_total_label}</span>
              </div>
            ))}
            <div className="cart-divider" />
            <div className="cart-summary-lines">
              <div><span>Items ({cartItems.length})</span><span>{formatNaira(subtotalKobo)}</span></div>
              <div><span>Delivery</span><span>{formatNaira(deliveryFeeKobo)}</span></div>
            </div>
            <div className="cart-divider" />
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-amount">{formatNaira(totalKobo)}</span>
            </div>
            {paymentError ? <p className="co-error">{paymentError}</p> : null}
            <Button fullWidth size="lg" loading={busy} disabled={!effectiveAddressId} onClick={placeOrder}>
              {pendingOrderId ? 'Try payment again' : `Pay ${formatNaira(totalKobo)}`}
            </Button>
            <div className="cart-trust">
              <span className="cart-trust-icon"><Icon name="shield-check" size={14} color="var(--brand-primary)" /></span>
              <span>Held by BuySellSwap until you confirm delivery.</span>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </>
  );
}
