import React from 'react';
import { Button } from '../components/ui/core/Button.jsx';
import { Badge } from '../components/ui/core/Badge.jsx';
import { Card } from '../components/ui/core/Card.jsx';
import { Tag } from '../components/ui/core/Tag.jsx';
import { Avatar } from '../components/ui/core/Avatar.jsx';
import { Icon } from '../components/ui/core/Icon.jsx';
import { Input } from '../components/ui/forms/Input.jsx';
import { SearchBar } from '../components/ui/forms/SearchBar.jsx';
import { ConditionBadge } from '../components/ui/marketplace/ConditionBadge.jsx';
import { PriceTag } from '../components/ui/marketplace/PriceTag.jsx';
import { ListingCard } from '../components/ui/marketplace/ListingCard.jsx';
import { SellerRow } from '../components/ui/marketplace/SellerRow.jsx';

const SWATCHES = [['Blue 600', 'var(--blue-600)'], ['Lemon 400', 'var(--lemon-400)'], ['Ink 950', 'var(--ink-950)'], ['Green 500', 'var(--green-500)'], ['Amber 500', 'var(--amber-500)'], ['Red 500', 'var(--red-500)']];

const Section = ({ title, children }) => (
  <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
    <h2 style={{ fontSize: 'var(--text-h4)' }}>{title}</h2>
    {children}
  </section>
);

export function DesignSystem() {
  return (
    <div className="page" style={{ display: 'grid', gap: 'var(--space-8)' }}>
      <h1 style={{ fontSize: 'var(--text-h1)' }}>Design system</h1>

      <Section title="Colour">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 'var(--space-3)' }}>
          {SWATCHES.map(([name, bg]) => (
            <div key={name} style={{ display: 'grid', gap: 6 }}>
              <div style={{ height: 64, borderRadius: 'var(--radius-md)', background: bg }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type and price (the ₦ comes from Lexend)">
        <span style={{ fontSize: 'var(--text-display-3)', fontWeight: 800, letterSpacing: 'var(--ls-display)' }}>Buy clean gadgets.</span>
        <PriceTag kobo={41_500_000} wasKobo={47_000_000} size="xl" />
        <PriceTag kobo={150_050} size="md" />
      </Section>

      <Section title="Buttons">
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button>Buy now</Button>
          <Button variant="secondary">Add to cart</Button>
          <Button variant="accent">Start selling</Button>
          <Button variant="ghost">Log in</Button>
          <Button variant="inverse">Confirm</Button>
          <Button variant="danger">Reject</Button>
          <Button size="sm" icon={<Icon name="plus" size={16} color="#fff" />}>Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Badges and tags">
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <ConditionBadge condition="brand_new" />
          <ConditionBadge condition="uk_used" />
          <ConditionBadge condition="ng_used" />
          <ConditionBadge condition="for_parts" />
          <ConditionBadge condition="open-swap" />
          <Badge tone="verified">Verified</Badge>
          <Badge tone="pending">Pending</Badge>
          <Badge tone="danger">Danger</Badge>
          <Tag selected onRemove={() => {}}>UK used</Tag>
          <Tag>Barnawa</Tag>
        </div>
      </Section>

      <Section title="Forms">
        <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
          <SearchBar showButton={false} />
          <Input label="Phone number" prefix="+234" placeholder="803 555 0142" />
        </div>
      </Section>

      <Section title="Marketplace">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 'var(--space-4)' }}>
          <ListingCard title="iPhone 13 Pro 256GB, Sierra Blue" priceKobo={41_500_000} wasKobo={47_000_000} condition="uk_used" location="Barnawa" postedAt="2h ago" />
          <ListingCard title="Samsung Galaxy S24 128GB, cobalt blue" priceKobo={52_000_000} condition="uk_used" location="Sabon Tasha" postedAt="5h ago" openToSwap />
        </div>
        <Card padding="md"><SellerRow name="TechHub Kaduna" rating="4.8" deals={212} verified location="Barnawa" /></Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}><Avatar name="Musa Ibrahim" verified size="lg" /><span>Avatar with verified dot</span></div>
      </Section>
    </div>
  );
}
