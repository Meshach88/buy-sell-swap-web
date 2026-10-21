import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { useAddToCart } from '../lib/cart.js';
import { useToast } from '../lib/toast.jsx';
import { formatRelativeTime } from '../lib/time.js';
import { formatNaira } from '../lib/money.js';
import { listingCardProps } from '../lib/listing.js';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { Avatar } from '../components/ui/core/Avatar.jsx';
import { ConditionBadge } from '../components/ui/marketplace/ConditionBadge.jsx';
import { PriceTag } from '../components/ui/marketplace/PriceTag.jsx';
import { ListingCard } from '../components/ui/marketplace/ListingCard.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import '../pages/Home.css';
import './ListingDetail.css';

const VARIANT_LABELS = { storage: 'Storage', colour: 'Colour', color: 'Colour', ram: 'RAM', edition: 'Edition' };

function Card({ children, style }) {
  return (
    <div style={{ borderRadius: 20, padding: 24, background: '#fff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', ...style }}>
      {children}
    </div>
  );
}

function TrustRow({ icon, title, body, tone = 'brand' }) {
  const bg = tone === 'brand' ? 'var(--surface-brand-soft)' : 'var(--green-100)';
  const fg = tone === 'brand' ? 'var(--brand-primary)' : 'var(--green-500)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 36, height: 36, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: 999, background: bg }}>
        <Icon name={icon} size={16} color={fg} />
      </span>
      <div style={{ display: 'grid' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{title}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{body}</span>
      </div>
    </div>
  );
}

export function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const addToCart = useAddToCart();
  const [activeImage, setActiveImage] = React.useState(0);

  const { data: body, isPending, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api(`/listings/${id}`),
    retry: false,
  });
  const listing = body?.data;

  const { data: zonesBody } = useQuery({ queryKey: ['delivery-zones'], queryFn: () => api('/delivery-zones') });
  const cheapestZone = zonesBody?.data?.[0];

  const { data: moreBody } = useQuery({
    queryKey: ['seller-listings', listing?.seller?.id],
    queryFn: () => api(`/listings?seller_profile_id=${listing.seller.id}`),
    enabled: !!listing?.seller?.id,
  });
  const moreFromSeller = (moreBody?.data ?? []).filter((l) => l.id !== listing?.id).slice(0, 4);

  function notYet(label) {
    toast.show(`${label} is coming soon.`);
  }

  async function handleAddToCart() {
    if (!user) return navigate('/login');
    try {
      await addToCart.mutateAsync({ listingId: listing.id, quantity: 1 });
      toast.success('Added to cart.');
    } catch (err) {
      toast.error(err.message ?? 'Could not add that to your cart.');
    }
  }

  async function handleBuyNow() {
    if (!user) return navigate('/login');
    try {
      await addToCart.mutateAsync({ listingId: listing.id, quantity: 1 });
      navigate('/checkout');
    } catch (err) {
      toast.error(err.message ?? 'Could not start checkout.');
    }
  }

  if (isPending) {
    return (
      <div className="home-container" style={{ padding: '48px 0' }}>
        <div style={{ height: 480, borderRadius: 28, background: 'var(--surface-sunken)' }} />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="search-x" size={24} />} title="Listing not found"
          body="It may have sold or been taken down." action={<Button onClick={() => navigate('/')}>Back to home</Button>} />
      </div>
    );
  }

  const images = listing.images ?? [];
  const mainImage = images[activeImage]?.url ?? listing.primary_image_url;
  const specs = [
    ...Object.entries(listing.variant ?? {}).map(([key, value]) => [VARIANT_LABELS[key] ?? (key[0].toUpperCase() + key.slice(1)), value]),
    ...(listing.battery_health != null ? [['Battery health', `${listing.battery_health}%`]] : []),
    ['Warranty', listing.warranty_months ? `${listing.warranty_months} months` : (listing.warranty_note || 'None')],
  ];
  const category = listing.product_model?.category;

  return (
    <>
      <div className="home-container" style={{ paddingTop: 24, paddingBottom: 0 }}>
        {/* Breadcrumb */}
        <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', paddingBottom: 8, flexWrap: 'wrap' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Home</a>
          {category ? <><Icon name="chevron-right" size={14} color="var(--text-faint)" /><span>{category.name}</span></> : null}
          {listing.product_model?.brand ? <><Icon name="chevron-right" size={14} color="var(--text-faint)" /><span>{listing.product_model.brand}</span></> : null}
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{listing.title}</span>
        </div>

        {/* Gallery + buy box */}
        <div className="ld-grid anim-stagger" style={{ paddingTop: 8 }}>
          <div className="anim-fade-up" style={{ '--stagger-i': 0 }}>
            <div className="ld-gallery-main">
              {mainImage ? <img src={mainImage} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              {listing.open_to_swap ? (
                <span style={{ position: 'absolute', top: 16, left: 16, height: 28, padding: '0 12px', display: 'inline-flex', alignItems: 'center', background: 'var(--brand-accent)', color: 'var(--ink-950)', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '.02em' }}>OPEN TO SWAP</span>
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="ld-thumbs">
                {images.map((img, i) => (
                  <button key={img.id} type="button" onClick={() => setActiveImage(i)} className="ld-thumb"
                    style={{ border: 'none', padding: 0, outline: i === activeImage ? '3px solid var(--brand-primary)' : 'none', outlineOffset: -3 }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="anim-fade-up" style={{ '--stagger-i': 1 }}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <ConditionBadge condition={listing.condition} />
                  {listing.open_to_swap ? <ConditionBadge condition="open-swap" /> : null}
                  {listing.grade ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', fontSize: 11, fontWeight: 600, borderRadius: 999, background: 'var(--green-100)', color: 'var(--status-verified-fg)' }}>
                      <Icon name="shield-check" size={12} /> Grade {listing.grade}
                    </span>
                  ) : null}
                </div>

                <h1 style={{ fontSize: 28, letterSpacing: '-0.03em', lineHeight: 1.15 }}>{listing.title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-muted)' }}>
                  <Icon name="map-pin" size={15} />
                  {listing.seller?.area ? `${listing.seller.area}, Kaduna` : 'Kaduna'} · Posted {formatRelativeTime(listing.published_at)}
                </div>

                <PriceTag kobo={listing.price_kobo} wasKobo={listing.was_price_kobo} size="xl" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Button fullWidth size="lg" loading={addToCart.isPending} onClick={handleBuyNow}>Buy now</Button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <Button fullWidth size="lg" variant="secondary" icon={<Icon name="shopping-bag" size={18} />} loading={addToCart.isPending} onClick={handleAddToCart}>Add to cart</Button>
                    </div>
                    <button type="button" aria-label="Save" onClick={() => notYet('Saving listings')}
                      style={{ width: 48, height: 48, flex: '0 0 auto', display: 'inline-grid', placeItems: 'center', borderRadius: 999, background: '#fff', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-body)' }}>
                      <Icon name="heart" size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--border-subtle)' }} />

                <TrustRow icon="truck" tone="verified"
                  title={cheapestZone ? `Delivery across Kaduna` : 'Delivery across Kaduna'}
                  body={cheapestZone ? `From ${formatNaira(cheapestZone.fee_kobo)} · ${cheapestZone.eta_label}` : 'Fee shown at checkout'} />
                <TrustRow icon="shield-check" tone="verified" title="Payment held until you confirm" body="Sellers are paid after delivery" />
                <TrustRow icon="rotate-ccw" tone="verified" title="Something wrong?" body="You can report it after you receive the order" />
              </div>
            </Card>
          </div>
        </div>

        {/* Specs / verification / sidebar */}
        <div className="ld-grid" style={{ paddingTop: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 19 }}>Specifications</h3>
                <div className="ld-specs-grid">
                  {specs.map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{value}</span>
                    </div>
                  ))}
                </div>
                {listing.description ? (
                  <>
                    <div style={{ height: 1, background: 'var(--border-subtle)' }} />
                    <p style={{ fontSize: 15, color: 'var(--text-body)' }}>{listing.description}</p>
                  </>
                ) : null}
              </div>
            </Card>

            {listing.verification_status === 'verified' ? (
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{ fontSize: 19 }}>Verified device</h3>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', fontSize: 12, fontWeight: 600, borderRadius: 999, background: 'var(--green-100)', color: 'var(--status-verified-fg)' }}>
                      <Icon name="shield-check" size={14} /> Inspection passed
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                    {listing.seller?.verified ? <TrustRow icon="id-card" tone="verified" title="Seller ID" body="ID verified" /> : null}
                    {listing.grade ? <TrustRow icon="file-text" tone="verified" title="Condition report" body={`Grade ${listing.grade}`} /> : null}
                  </div>
                </div>
              </Card>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {listing.seller ? (
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={listing.seller.shop_name} size="lg" verified={listing.seller.verified} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.seller.shop_name}</span>
                        {listing.seller.verified ? (
                          <span style={{ height: 20, padding: '0 8px', display: 'inline-flex', alignItems: 'center', background: 'var(--green-100)', color: 'var(--status-verified-fg)', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '.04em' }}>VERIFIED</span>
                        ) : null}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
                        {listing.seller.rating_count ? <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>★ {listing.seller.rating_avg}</span> : null}
                        {listing.seller.deals_count ? <span>{listing.seller.deals_count} deals</span> : null}
                        <span>{listing.seller.area}, Kaduna</span>
                        {listing.seller.joined_at ? <span>Joined {new Date(listing.seller.joined_at).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}</span> : null}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
                    <Button variant="secondary" onClick={() => navigate(`/sellers/${listing.seller.slug}`)}>View shop</Button>
                    <Button variant="ghost" onClick={() => notYet('Following sellers')}>Follow</Button>
                  </div>
                </div>
              </Card>
            ) : null}

            {listing.open_to_swap ? (
              <Card style={{ background: 'var(--surface-sunken)', border: '1px solid transparent' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ width: 40, height: 40, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: 999, background: 'var(--brand-accent)' }}>
                    <Icon name="repeat-2" size={18} color="var(--ink-950)" />
                  </span>
                  <div style={{ display: 'grid', gap: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>Open to swap</span>
                    <span style={{ fontSize: 13, color: 'var(--text-body)' }}>This seller will consider a trade. Swap requests open in a later release. You can buy it outright now.</span>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>

        {/* More from this seller */}
        {moreFromSeller.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '56px 0 72px' }}>
            <h2 style={{ fontSize: 28, letterSpacing: '-0.03em' }}>More from {listing.seller.shop_name}</h2>
            <div className="home-listings-grid">
              {moreFromSeller.map((l) => (
                <ListingCard key={l.id} {...listingCardProps(l)} onClick={() => navigate(`/listings/${l.id}`)} onSave={() => notYet('Saving listings')} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <MarketplaceFooter />
    </>
  );
}
