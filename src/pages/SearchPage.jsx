import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { useToast } from '../lib/toast.jsx';
import { listingCardProps } from '../lib/listing.js';
import { nairaToKobo } from '../lib/money.js';
import { KADUNA_AREAS } from '../lib/areas.js';
import { Icon } from '../components/ui/core/Icon.jsx';
import { SearchBar } from '../components/ui/forms/SearchBar.jsx';
import { Input } from '../components/ui/forms/Input.jsx';
import { Select } from '../components/ui/forms/Select.jsx';
import { Checkbox } from '../components/ui/forms/Checkbox.jsx';
import { Switch } from '../components/ui/forms/Switch.jsx';
import { ListingCard } from '../components/ui/marketplace/ListingCard.jsx';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Spinner } from '../components/ui/feedback/Spinner.jsx';
import { MarketplaceFooter } from '../components/marketplace/MarketplaceFooter.jsx';
import '../pages/Home.css';
import './SearchPage.css';

const CONDITIONS = [
  ['brand_new', 'Brand new'],
  ['uk_used', 'UK used'],
  ['ng_used', 'Nigerian used'],
  ['for_parts', 'For parts'],
];

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

function SidebarGroup({ title, children }) {
  return (
    <div className="sp-group">
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>{title}</span>
      {children}
    </div>
  );
}

function Chip({ children, onRemove }) {
  return (
    <button type="button" onClick={onRemove}
      style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 8px 0 14px', fontSize: 13, fontWeight: 500, borderRadius: 999, whiteSpace: 'nowrap', background: 'var(--surface-inverse)', color: '#fff' }}>
      {children}
      <span style={{ width: 18, height: 18, display: 'grid', placeItems: 'center', borderRadius: 999, background: 'rgba(255,255,255,.2)', fontSize: 12, lineHeight: 1 }}>×</span>
    </button>
  );
}

export function SearchPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();

  const categoryId = params.get('category_id');
  const conditions = (params.get('condition') || '').split(',').filter(Boolean);
  const area = params.get('area') || '';
  const verified = params.get('verified') === '1';
  const swap = params.get('swap') === '1';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || '1');
  const [search, setSearch] = React.useState(q);
  const [minPrice, setMinPrice] = React.useState(params.get('min_price') || '');
  const [maxPrice, setMaxPrice] = React.useState(params.get('max_price') || '');

  function update(patch, resetPage = true) {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === '' || value === false) next.delete(key);
      else next.set(key, value === true ? '1' : value);
    });
    if (resetPage) next.delete('page');
    setParams(next);
  }

  function toggleCondition(key) {
    const next = conditions.includes(key) ? conditions.filter((c) => c !== key) : [...conditions, key];
    update({ condition: next.join(',') });
  }

  const { data: categoriesBody } = useQuery({ queryKey: ['categories'], queryFn: () => api('/categories') });
  const categories = categoriesBody?.data ?? [];
  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  const apiQuery = React.useMemo(() => {
    const p = new URLSearchParams();
    if (categoryId) p.set('category_id', categoryId);
    if (conditions.length) p.set('condition', conditions.join(','));
    if (area) p.set('area', area);
    if (verified) p.set('verified', '1');
    if (swap) p.set('open_to_swap', '1');
    if (q) p.set('q', q);
    if (sort !== 'newest') p.set('sort', sort);
    if (page > 1) p.set('page', String(page));
    const min = params.get('min_price');
    const max = params.get('max_price');
    if (min) p.set('min_price_kobo', String(nairaToKobo(min)));
    if (max) p.set('max_price_kobo', String(nairaToKobo(max)));
    return p.toString();
    // Every value read above is derived from `params`, so that's the only real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const { data: listingsBody, isPending } = useQuery({
    queryKey: ['search-listings', apiQuery],
    queryFn: () => api(`/listings?${apiQuery}`),
  });
  const listings = listingsBody?.data ?? [];
  const meta = listingsBody?.meta;

  function notYet(label) {
    toast.show(`${label} is coming soon.`);
  }

  const title = activeCategory ? `${activeCategory.name} in Kaduna` : q ? `Results for "${q}"` : 'All gadgets in Kaduna';

  return (
    <>
      <div className="home-container" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Home</a>
          <Icon name="chevron-right" size={14} color="var(--text-faint)" />
          <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{activeCategory?.name ?? 'Search'}</span>
        </div>

        <div className="sp-top-row">
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', letterSpacing: '-0.03em' }}>{title}</h1>
          <div className="sp-search-bar">
            <SearchBar value={search} onChange={setSearch} showButton={false}
              onSubmit={(term) => update({ q: term })} />
          </div>
        </div>

        <div className="sp-layout">
          {/* Sidebar */}
          <div className="sp-sidebar" style={{ borderRadius: 20, padding: 20, background: '#fff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
            <SidebarGroup title="Category">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categories.map((c) => (
                  <Checkbox key={c.id} label={`${c.name} · ${c.listings_count ?? 0}`}
                    checked={String(c.id) === categoryId}
                    onChange={() => update({ category_id: String(c.id) === categoryId ? null : String(c.id) })} />
                ))}
              </div>
            </SidebarGroup>

            <SidebarGroup title="Condition">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CONDITIONS.map(([key, label]) => (
                  <Checkbox key={key} label={label} checked={conditions.includes(key)} onChange={() => toggleCondition(key)} />
                ))}
              </div>
            </SidebarGroup>

            <SidebarGroup title="Price">
              <div style={{ display: 'grid', gap: 10 }}>
                <Input prefix="₦" placeholder="Min" value={minPrice} onChange={setMinPrice} onBlur={() => update({ min_price: minPrice })} />
                <Input prefix="₦" placeholder="Max" value={maxPrice} onChange={setMaxPrice} onBlur={() => update({ max_price: maxPrice })} />
              </div>
            </SidebarGroup>

            <SidebarGroup title="Area in Kaduna">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {KADUNA_AREAS.map((a) => {
                  const active = area === a;
                  return (
                    <button key={a} type="button" onClick={() => update({ area: active ? null : a })}
                      style={{ all: 'unset', cursor: 'pointer', height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500, borderRadius: 999, whiteSpace: 'nowrap', background: active ? 'var(--surface-inverse)' : '#fff', color: active ? '#fff' : 'var(--text-body)', border: active ? '1px solid transparent' : '1px solid var(--border-subtle)' }}>
                      {a}
                    </button>
                  );
                })}
              </div>
            </SidebarGroup>

            <div className="sp-group" style={{ borderBottom: 'none', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-strong)' }}>Verified devices only</span>
                <Switch checked={verified} onChange={(v) => update({ verified: v })} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-strong)' }}>Open to swap</span>
                <Switch checked={swap} onChange={(v) => update({ swap: v })} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {activeCategory ? <Chip onRemove={() => update({ category_id: null })}>{activeCategory.name}</Chip> : null}
                {conditions.map((key) => (
                  <Chip key={key} onRemove={() => toggleCondition(key)}>{CONDITIONS.find(([k]) => k === key)?.[1]}</Chip>
                ))}
                {area ? <Chip onRemove={() => update({ area: null })}>{area}</Chip> : null}
                {verified ? <Chip onRemove={() => update({ verified: null })}>Verified devices</Chip> : null}
                {swap ? <Chip onRemove={() => update({ swap: null })}>Open to swap</Chip> : null}
                {q ? <Chip onRemove={() => { setSearch(''); update({ q: null }); }}>"{q}"</Chip> : null}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {isPending ? <><Spinner size={13} color="var(--text-muted)" /> Loading…</> : `${meta.total} result${meta.total === 1 ? '' : 's'}`}
                </span>
                <div style={{ width: 190 }}>
                  <Select value={sort} onChange={(v) => update({ sort: v })} options={SORTS.map((s) => ({ value: s.value, label: s.label }))} />
                </div>
              </div>
            </div>

            {isPending ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-muted)' }}>
                  <Spinner size={18} color="var(--brand-primary)" />
                  Loading listings…
                </div>
                <div className="sp-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 3.3', borderRadius: 20, background: 'var(--surface-sunken)' }} />
                  ))}
                </div>
              </div>
            ) : listings.length ? (
              <div className="sp-grid">
                {listings.map((l) => (
                  <ListingCard key={l.id} {...listingCardProps(l)} onClick={() => navigate(`/listings/${l.id}`)} onSave={() => notYet('Saving listings')} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<Icon name="search-x" size={24} />} title="No listings match" body="Try removing a filter or widening your price range." />
            )}

            {meta && meta.last_page > 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', paddingTop: 8 }}>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button" onClick={() => update({ page: String(n) }, false)}
                    style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: n === meta.current_page ? 'var(--brand-primary)' : '#fff', color: n === meta.current_page ? '#fff' : 'var(--text-body)', border: n === meta.current_page ? '1px solid transparent' : '1px solid var(--border-subtle)' }}>
                    {n}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </>
  );
}
