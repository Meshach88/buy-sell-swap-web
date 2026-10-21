import { render, screen } from '@testing-library/react';
import { PriceTag } from './PriceTag.jsx';

describe('PriceTag', () => {
  it('renders the price and the struck-through previous price in naira', () => {
    render(<PriceTag kobo={41_500_000} wasKobo={47_000_000} />);
    expect(screen.getByText('₦415,000')).toBeInTheDocument();
    expect(screen.getByText('₦470,000')).toHaveStyle({ textDecoration: 'line-through' });
  });
});
