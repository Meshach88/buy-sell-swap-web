import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api.js';
import { useAuth } from './auth.jsx';

/** Shared cart hooks — every page that touches the cart uses the same
 * ['cart'] query key, so adding/removing an item anywhere (a listing card,
 * the listing detail buy box, the cart page itself) keeps every other view
 * (the header badge, the cart page) in sync via React Query's cache. */
export function useCart() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => api('/cart'),
    enabled: !!user,
    staleTime: 10_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, quantity = 1 }) => api('/cart/items', { method: 'POST', body: { listing_id: listingId, quantity } }),
    onSuccess: (body) => queryClient.setQueryData(['cart'], body),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }) => api(`/cart/items/${cartItemId}`, { method: 'PATCH', body: { quantity } }),
    onSuccess: (body) => queryClient.setQueryData(['cart'], body),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId) => api(`/cart/items/${cartItemId}`, { method: 'DELETE' }),
    onSuccess: (body) => queryClient.setQueryData(['cart'], body),
  });
}
