import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api.js';
import { useAuth } from './auth.jsx';

export function useAddresses() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['addresses'], queryFn: () => api('/addresses'), enabled: !!user });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api('/addresses', { method: 'POST', body: payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useCreateCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api('/checkout', { method: 'POST', body: payload }),
    // The backend clears the cart as part of checkout — reflect that immediately everywhere the badge/cart page read it from.
    onSuccess: () => queryClient.setQueryData(['cart'], { items: [], subtotal_kobo: 0, subtotal_label: '₦0' }),
  });
}

export function usePayOrder() {
  return useMutation({
    mutationFn: (orderId) => api(`/orders/${orderId}/pay`, { method: 'POST' }),
  });
}
