import { formatNaira, nairaToKobo } from './money.js';

describe('money', () => {
  it('formats whole naira without decimals', () => {
    expect(formatNaira(41_500_000)).toBe('₦415,000');
  });

  it('shows kobo only when there are kobo', () => {
    expect(formatNaira(150_050)).toBe('₦1,500.50');
  });

  it('converts naira to whole kobo', () => {
    expect(nairaToKobo(415000)).toBe(41_500_000);
    expect(nairaToKobo('1500.5')).toBe(150_050);
  });
});
