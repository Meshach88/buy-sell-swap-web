import { render, screen } from '@testing-library/react';
import { ConditionBadge } from './ConditionBadge.jsx';

describe('ConditionBadge', () => {
  it.each([
    ['brand_new', 'Brand new'],
    ['uk_used', 'UK used'],
    ['ng_used', 'Nigerian used'],
    ['for_parts', 'For parts'],
    ['open-swap', 'Open to swap'],
  ])('labels %s as %s', (condition, label) => {
    render(<ConditionBadge condition={condition} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
