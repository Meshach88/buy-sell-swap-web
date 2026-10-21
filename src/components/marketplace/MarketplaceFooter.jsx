import React from 'react';

const COLUMNS = [
  ['MARKETPLACE', ['Phones', 'Laptops', 'Consoles', 'Audio', 'Accessories']],
  ['SELLING', ['Start selling', 'Seller guide', 'Fees and payouts', 'Seller verification']],
  ['TRUST', ['Payment protection', 'Verified devices', 'IMEI check', 'Returns and refunds']],
  ['COMPANY', ['About', 'Contact', 'Terms', 'Privacy']],
];

/** The dark footer shared by every marketplace page (Home, listing detail, search, storefront). */
export function MarketplaceFooter() {
  return (
    <footer style={{ background: 'var(--surface-inverse)', color: 'rgba(255,255,255,.72)', padding: '48px 0 32px' }}>
      <div className="home-container home-footer-grid">
        <div className="home-footer-col">
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>BuySellSwap</div>
          <p style={{ fontSize: 13, maxWidth: 240 }}>Kaduna's gadget marketplace. Buy verified devices, sell the one in your drawer, swap when a seller is open to it.</p>
        </div>
        {COLUMNS.map(([heading, links]) => (
          <div key={heading} className="home-footer-col">
            <div style={{ fontSize: 11, letterSpacing: '.14em', fontWeight: 700, color: 'var(--lemon-300)' }}>{heading}</div>
            {links.map((l) => <span key={l} style={{ fontSize: 13 }}>{l}</span>)}
          </div>
        ))}
      </div>
      <div className="home-container" style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
        <span>© {new Date().getFullYear()} BuySellSwap, a SMARTiFy company. Kaduna, Nigeria.</span>
        <span style={{ display: 'flex', gap: 18 }}><span>Terms</span><span>Privacy</span></span>
      </div>
    </footer>
  );
}
