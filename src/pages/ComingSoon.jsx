import React from 'react';
import { useLocation } from 'react-router-dom';
import { EmptyState } from '../components/ui/feedback/EmptyState.jsx';
import { Icon } from '../components/ui/core/Icon.jsx';

export function ComingSoon() {
  const { pathname } = useLocation();
  return (
    <div className="page">
      <EmptyState icon={<Icon name="hammer" size={22} />} title="Not built yet" body={`${pathname} arrives in a later phase of the build.`} />
    </div>
  );
}
