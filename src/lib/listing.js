import { formatRelativeTime } from './time.js';

/** Maps an API listing object to the props ListingCard expects. */
export function listingCardProps(l) {
  return {
    title: l.title,
    priceKobo: l.price_kobo,
    wasKobo: l.was_price_kobo,
    condition: l.condition,
    image: l.primary_image_url,
    location: l.seller?.area,
    postedAt: formatRelativeTime(l.published_at),
    openToSwap: l.open_to_swap,
  };
}
