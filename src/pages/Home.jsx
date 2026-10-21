import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { useToast } from '../lib/toast.jsx';
import { listingCardProps } from '../lib/listing.js';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { SearchBar } from '../components/ui/forms/SearchBar.jsx';
import { CategoryPill } from '../components/ui/marketplace/CategoryPill.jsx';
import { ListingCard } from '../components/ui/marketplace/ListingCard.jsx';
import { Tabs } from '../components/ui/navigation/Tabs.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import heroImg from '../assets/phone-in-hand-blue.jpg';
import sellerImg from '../assets/phones-trio-lemon.jpg';
import './Home.css';

const FILTER_TABS = [
  { id: 'newest', label: 'Newest' },
  { id: 'verified', label: 'Verified' },
  { id: 'swap', label: 'Open to swap' },
];

function ProofCard() {
  return (
    <div className="home-hero-proof-card" style={{ background: '#fff', color: 'var(--ink-950)', borderRadius: 20, boxShadow: 'var(--shadow-lg)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: 'var(--status-verified-fg)' }}>
        <Icon name="shield-check" size={15} color="var(--green-500)" /> Seller ID verified
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>iPhone 13 Pro · ₦415,000</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Barnawa, Kaduna · 89% battery</div>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = React.useState('');
  const [activeCategoryId, setActiveCategoryId] = React.useState(null);
  const [filter, setFilter] = React.useState('newest');

  const { data: categoriesBody } = useQuery({ queryKey: ['categories'], queryFn: () => api('/categories') });
  const categories = categoriesBody?.data ?? [];
  const totalListings = categories.reduce((sum, c) => sum + (c.listings_count ?? 0), 0);
  // Defaults to the first category once it loads, but a click can still override it.
  const effectiveCategoryId = activeCategoryId ?? categories[0]?.id ?? null;

  const listingsQuery = React.useMemo(() => {
    const params = new URLSearchParams();
    if (effectiveCategoryId) params.set('category_id', effectiveCategoryId);
    if (filter === 'verified') params.set('verified', '1');
    if (filter === 'swap') params.set('open_to_swap', '1');
    return params.toString();
  }, [effectiveCategoryId, filter]);

  const { data: listingsBody, isPending: listingsPending } = useQuery({
    queryKey: ['home-listings', listingsQuery],
    queryFn: () => api(`/listings?${listingsQuery}`),
    enabled: effectiveCategoryId !== null,
  });
  const listings = listingsBody?.data ?? [];

  const { data: swapBody } = useQuery({ queryKey: ['home-swap-teaser'], queryFn: () => api('/listings?open_to_swap=1') });
  const swapListings = (swapBody?.data ?? []).slice(0, 2);

  // Quick-search chips: the newest distinct product models across the whole
  // catalogue (not just the active category), so every chip is guaranteed to
  // match something — unlike a hardcoded list, this can't drift out of sync.
  const { data: catalogBody } = useQuery({ queryKey: ['home-quick-searches'], queryFn: () => api('/listings') });
  const quickSearches = React.useMemo(() => {
    const seen = new Set();
    const terms = [];
    for (const l of catalogBody?.data ?? []) {
      const pm = l.product_model;
      if (!pm || seen.has(pm.id)) continue;
      seen.add(pm.id);
      terms.push(`${pm.brand} ${pm.name}`);
      if (terms.length === 4) break;
    }
    return terms;
  }, [catalogBody]);

  function onSearchSubmit(term) {
    if (!term?.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }

  function notYet(label) {
    toast.show(`${label} is coming soon.`);
  }

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--surface-brand)', color: '#fff', paddingTop: 32, overflow: 'hidden' }}>
        <div className="home-container home-hero-grid" style={{ paddingBottom: 0 }}>
          <div className="anim-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
            <span className="anim-fade-up" style={{ '--stagger-i': 0, alignSelf: 'flex-start', height: 28, padding: '0 14px', display: 'inline-flex', alignItems: 'center', background: 'var(--brand-accent)', color: 'var(--ink-950)', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '.06em' }}>
              {totalListings} LIVE LISTING{totalListings === 1 ? '' : 'S'} IN KADUNA
            </span>
            <h1 className="anim-fade-up home-heading" style={{ '--stagger-i': 1, lineHeight: 1.02, letterSpacing: '-0.04em', color: '#fff', fontWeight: 800 }}>
              Buy clean gadgets.<br />Sell yours today.<br /><span style={{ color: 'var(--lemon-300)' }}>Swap up anytime.</span>
            </h1>
            <p className="anim-fade-up" style={{ '--stagger-i': 2, fontSize: 17, color: 'rgba(255,255,255,.8)', maxWidth: 470 }}>
              Phones, laptops and consoles from verified sellers in Kaduna. Pay through BuySellSwap and we hold your money until the device is in your hands.
            </p>
            <div className="anim-fade-up" style={{ '--stagger-i': 3, maxWidth: 560, width: '100%' }}>
              <SearchBar size="lg" value={search} onChange={setSearch} onSubmit={onSearchSubmit} />
            </div>
            {quickSearches.length ? (
              <div className="anim-fade-up" style={{ '--stagger-i': 4, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {quickSearches.map((q) => (
                  <button key={q} type="button" onClick={() => onSearchSubmit(q)}
                    style={{ all: 'unset', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.82)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 999, padding: '6px 14px', transition: 'var(--transition-control)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.5)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.22)'; e.currentTarget.style.color = 'rgba(255,255,255,.82)'; }}>
                    {q}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="anim-fade-scale home-hero-image-wrap">
            <img src={heroImg} alt="" className="home-hero-image" />
            <ProofCard />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section style={{ padding: '32px 0' }}>
        <div className="home-container home-cat-row">
          {categories.map((c) => (
            <CategoryPill key={c.id} label={c.name} count={c.listings_count} icon={<Icon name={c.icon} size={16} />}
              active={c.id === effectiveCategoryId} onClick={() => setActiveCategoryId(c.id)} />
          ))}
        </div>
      </section>

      {/* Fresh in Kaduna */}
      <section style={{ padding: '24px 0 64px' }}>
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <h2 style={{ fontSize: 28, letterSpacing: '-0.03em' }}>Fresh in Kaduna</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Every listing shows condition, battery health and whether the device is verified.</p>
            </div>
            <Tabs variant="segmented" tabs={FILTER_TABS} active={filter} onChange={setFilter} />
          </div>

          {listingsPending ? (
            <div className="home-listings-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: '4 / 3.3', borderRadius: 20, background: 'var(--surface-sunken)' }} />
              ))}
            </div>
          ) : listings.length ? (
            <div className="home-listings-grid">
              {listings.slice(0, 8).map((l) => (
                <ListingCard key={l.id} {...listingCardProps(l)} onClick={() => navigate(`/listings/${l.id}`)} onSave={() => notYet('Saving listings')} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Icon name="search-x" size={24} />} title="Nothing here yet" body="No live listings in this category yet — check back soon, or be the first to list one." />
          )}

          <div style={{ alignSelf: 'center' }}>
            <Button variant="secondary" iconRight={<Icon name="arrow-right" size={18} />}
              onClick={() => navigate(`/search${effectiveCategoryId ? `?category_id=${effectiveCategoryId}` : ''}`)}>
              See all {totalListings} listings
            </Button>
          </div>
        </div>
      </section>

      {/* Open to swap */}
      {swapListings.length ? (
        <section style={{ background: 'var(--brand-accent)', color: 'var(--ink-950)', padding: '64px 0' }}>
          <div className="home-container home-swap-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span style={{ fontSize: 12, letterSpacing: '.14em', fontWeight: 700 }}>OPEN TO SWAP</span>
              <h2 className="home-swap-heading" style={{ letterSpacing: '-0.035em', lineHeight: 1.05 }}>Some sellers will take a trade. Look for the swap flag.</h2>
              <p style={{ fontSize: 15, maxWidth: 460 }}>Filter the feed for sellers open to swapping. You can buy the device outright today, and swap requests are coming to BuySellSwap next.</p>
              <div>
                <Button variant="inverse" icon={<Icon name="repeat-2" size={18} />} onClick={() => navigate('/search?swap=1')}>Browse open-to-swap listings</Button>
              </div>
            </div>
            <div className="home-listings-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              {swapListings.map((l) => (
                <ListingCard key={l.id} {...listingCardProps(l)} onClick={() => navigate(`/listings/${l.id}`)} onSave={() => notYet('Saving listings')} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Trust */}
      <section style={{ padding: '72px 0' }}>
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <h2 style={{ fontSize: 28, letterSpacing: '-0.03em' }}>Buying used shouldn't feel risky</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Four things we do on every order, whether the device costs ₦20,000 or ₦2 million.</p>
          </div>
          <div className="home-trust-grid">
            {[
              ['shield-check', 'ID-verified sellers', 'NIN or BVN checked before a seller can list anything.'],
              ['scan-line', 'Verified devices', 'IMEI and condition checked on used and high-value phones.'],
              ['lock', 'Payment held until you confirm', 'We keep your money safe until the device is in your hands.'],
              ['truck', 'Tracked delivery in Kaduna', 'A rider brings it to your door, and failed deliveries are rebooked.'],
            ].map(([icon, title, body]) => (
              <div key={title} style={{ borderRadius: 20, padding: 22, background: '#fff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 999, background: 'var(--surface-brand-soft)' }}>
                    <Icon name={icon} size={20} color="var(--brand-primary)" />
                  </span>
                  <h3 style={{ fontSize: 16 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="home-container">
          <div className="home-seller-cta" style={{ background: 'var(--surface-inverse)', borderRadius: 32, overflow: 'hidden' }}>
            <div className="home-seller-cta-copy" style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
              <span style={{ fontSize: 12, letterSpacing: '.14em', fontWeight: 700, color: 'var(--lemon-300)' }}>FOR SELLERS</span>
              <h2 style={{ fontSize: 30, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>List once. We handle payment and delivery.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Payouts', 'Weekly, to your bank account'], ['Delivery', 'We book the rider for you'], ['Commission', 'Set by seller tier']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.12)', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.66)' }}>{k}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Button variant="accent" onClick={() => navigate(user?.roles?.includes('seller') ? '/' : '/signup/seller')}>Start selling</Button>
                <Button variant="secondary" onClick={() => notYet('The seller guide')}>Seller guide</Button>
              </div>
            </div>
            <div className="home-seller-cta-image">
              <img src={sellerImg} alt="" style={{ width: '100%', height: '100%', minHeight: 320, objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />
    </>
  );
}
