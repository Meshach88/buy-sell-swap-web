import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth.jsx';
import { useToast } from '../../lib/toast.jsx';
import { Icon } from '../ui/core/Icon.jsx';
import { Avatar } from '../ui/core/Avatar.jsx';
import './AccountSidebar.css';

const NAV = [
  { key: 'orders', label: 'Orders', icon: 'package', to: '/orders' },
  { key: 'saved', label: 'Saved', icon: 'heart' },
  { key: 'addresses', label: 'Addresses', icon: 'map-pin' },
  { key: 'notifications', label: 'Notifications', icon: 'bell' },
  { key: 'help', label: 'Help and support', icon: 'circle-help' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export function AccountSidebar({ active = 'orders' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="acct-sidebar">
      <div className="acct-sidebar-profile">
        <Avatar name={user?.name ?? '?'} size="lg" verified={user?.phone_verified} />
        <div>
          <span className="acct-sidebar-name">{user?.name}</span>
          <span className="acct-sidebar-area">{user?.area ? `${user.area}, Kaduna` : 'Kaduna'}</span>
        </div>
      </div>
      <nav>
        {NAV.map((item) => (
          <button key={item.key} type="button" className={item.key === active ? 'is-active' : ''}
            onClick={() => (item.to ? navigate(item.to) : toast.show(`${item.label} is coming soon.`))}>
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
