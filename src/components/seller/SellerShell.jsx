import React from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth.jsx';
import { useToast } from '../../lib/toast.jsx';
import { Icon } from '../ui/core/Icon.jsx';
import './SellerShell.css';

const NAV = [
  { key: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { key: 'inventory', label: 'Inventory', icon: 'boxes' },
  { key: 'orders', label: 'Orders', icon: 'package', to: '/sell/orders' },
  { key: 'earnings', label: 'Earnings', icon: 'wallet' },
  { key: 'reviews', label: 'Reviews', icon: 'star' },
  { key: 'verification', label: 'Verification', icon: 'shield-check' },
  { key: 'store', label: 'Store profile', icon: 'store' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export function SellerShell() {
  const { user, isLoading } = useAuth();
  const toast = useToast();
  const isSeller = user?.roles?.includes('seller');

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isSeller) return <Navigate to="/signup/seller" replace />;

  return (
    <div className="seller-shell">
      <aside className="seller-aside">
        <div className="seller-brand">
          <span>BuySellSwap</span>
          <span className="seller-badge">SELLER</span>
        </div>
        <nav>
          {NAV.map((item) => (
            item.to ? (
              <NavLink key={item.key} to={item.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <button key={item.key} type="button" onClick={() => toast.show(`${item.label} is coming soon.`)}>
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            )
          ))}
        </nav>
      </aside>
      <main className="seller-main"><Outlet /></main>
    </div>
  );
}
