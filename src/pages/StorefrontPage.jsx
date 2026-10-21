import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useToast } from '../lib/toast.jsx';
import { listingCardProps } from '../lib/listing.js';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Button } from '../components/ui/core/Button.jsx';
import { Avatar } from '../components/ui/core/Avatar.jsx';
import { Tabs } from '../components/ui/navigation/Tabs.jsx';
import { ListingCard } from '../components/ui/marketplace/ListingCard.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import { ReviewCard } from '../components/marketplace/ReviewCard.jsx';
import '../pages/Home.css';
import '../pages/SearchPage.css';
import './StorefrontPage.css';

function StatPill({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 22px', borderRadius: 20, background: 'rgba(255,255,255,.1)', textAlign: 'center' }}>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>{value}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{label}</span>
    </div>
  );
}

function VerifiedChecklistRow({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={18} color="var(--green-500)" />
      <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{label}</span>
    </div>
  );
}

export function StorefrontPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = React.useState('listings');
  const [page, setPage] = React.useState(1);

  const { data: body, isPending, isError } = useQuery({
    queryKey: ['storefront', slug, page],
    queryFn: () => api(`/sellers/${slug}${page > 1 ? `?page=${page}` : ''}`),
    retry: false,
  });
  const seller = body?.seller;
  const listings = body?.listings?.data ?? [];
  const meta = body?.listings?.meta;
  const recentReview = body?.recent_review;

  function notYet(label) {
    toast.show(`${label} is coming soon.`);
  }

  if (isPending) {
    return (
      <div className="home-container" style={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}>
        <Spinner size={28} color="var(--brand-primary)" />
      </div>
    );
  }

  if (isError || !seller) {
    return (
      <div className="home-container" style={{ padding: '56px 0' }}>
        <EmptyState icon={<Icon name="search-x" size={24} />} title="Shop not found"
          body="This seller may no longer be active." action={<Button onClick={() => navigate('/')}>Back to home</Button>} />
      </div>
    );
  }

  const joined = seller.joined_at
    ? new Date(seller.joined_at).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })
    : null;

  return (
    <>
      <section className="anim-fade-in" style={{ background: 'var(--surface-brand)', padding: '40px 0' }}>
        <div className="home-container sf-banner-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Avatar name={seller.shop_name} src={seller.logo_url} size="xl" verified={seller.verified} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', letterSpacing: '-0.035em', color: '#fff' }}>{seller.shop_name}</h1>
                {seller.verified ? (
                  <span style={{ height: 22, padding: '0 10px', display: 'inline-flex', alignItems: 'center', background: 'var(--brand-accent)', color: 'var(--ink-950)', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '.04em' }}>VERIFIED</span>
                ) : null}
              </div>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }}>
                {seller.area ? `${seller.area}, Kaduna` : 'Kaduna'}{joined ? ` · Joined ${joined}` : ''}
              </span>
            </div>
          </div>
          <div className="sf-stats-row">
            <StatPill value={seller.rating_count ? `★ ${seller.rating_avg}` : '—'} label="Rating" />
            <StatPill value={seller.deals_count ?? 0} label="Deals" />
            <StatPill value={meta?.total ?? listings.length} label="Listings" />
          </div>
        </div>
      </section>

      <div className="home-container sf-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Tabs tabs={[
            { id: 'listings', label: 'Listings', count: meta?.total ?? listings.length },
            { id: 'reviews', label: 'Reviews', count: seller.rating_count },
            { id: 'about', label: 'About' },
          ]} active={tab} onChange={setTab} />

          {tab === 'listings' ? (
            listings.length ? (
              <>
                <div className="sp-grid">
                  {listings.map((l) => (
                    <ListingCard key={l.id} {...listingCardProps(l)} onClick={() => navigate(`/listings/${l.id}`)} onSave={() => notYet('Saving listings')} />
                  ))}
                </div>
                {meta && meta.last_page > 1 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', paddingTop: 8 }}>
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                      <button key={n} type="button" onClick={() => setPage(n)}
                        style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: n === meta.current_page ? 'var(--brand-primary)' : '#fff', color: n === meta.current_page ? '#fff' : 'var(--text-body)', border: n === meta.current_page ? '1px solid transparent' : '1px solid var(--border-subtle)' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState icon={<Icon name="store" size={24} />} title="No live listings" body="This seller doesn't have anything live right now — check back soon." />
            )
          ) : tab === 'reviews' ? (
            recentReview ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#fff', borderRadius: 20, padding: 24, border: '1px solid var(--border-subtle)' }}>
                <ReviewCard review={recentReview} />
              </div>
            ) : (
              <EmptyState icon={<Icon name="star" size={24} />} title="No reviews yet" body="Reviews show up here once buyers start confirming orders from this seller." />
            )
          ) : (
            seller.description ? (
              <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.6 }}>{seller.description}</p>
            ) : (
              <EmptyState icon={<Icon name="info" size={24} />} title="No shop description yet" body="This seller hasn't added one." />
            )
          )}
        </div>

        <div className="sf-sidebar">
          {seller.verified ? (
            <div style={{ borderRadius: 20, padding: 24, background: '#fff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 16 }}>Verified by BuySellSwap</h3>
                <VerifiedChecklistRow icon="id-card" label="Seller ID checked (NIN)" />
                <VerifiedChecklistRow icon="warehouse" label="Business address confirmed" />
                <VerifiedChecklistRow icon="landmark" label="Bank account verified" />
              </div>
            </div>
          ) : null}

          {recentReview ? (
            <div style={{ borderRadius: 20, padding: 24, background: '#fff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 16 }}>Recent review</h3>
                <ReviewCard review={recentReview} compact />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <MarketplaceFooter />
    </>
  );
}
