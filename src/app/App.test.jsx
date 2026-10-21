import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App.jsx';
import { AuthProvider } from '../lib/auth.jsx';
import { ToastProvider } from '../lib/toast.jsx';

function renderAt(path) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <ToastProvider><AuthProvider><App /></AuthProvider></ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function jsonResponse(body) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn((url) => {
      if (url.includes('/categories')) return jsonResponse({ data: [] });
      if (url.includes('/listings')) return jsonResponse({ data: [], meta: { total: 0 } });
      return jsonResponse({});
    });
  });

  it('shows the marketplace home page', async () => {
    renderAt('/');
    expect(await screen.findByText('Fresh in Kaduna')).toBeInTheDocument();
    expect(screen.getAllByText('BuySellSwap').length).toBeGreaterThan(0);
    // Appears twice by design: the header CTA and the seller-conversion section.
    expect(screen.getAllByRole('button', { name: /start selling/i }).length).toBeGreaterThan(0);
  });

  it('renders the design system page', () => {
    renderAt('/design');
    expect(screen.getByRole('heading', { name: 'Design system' })).toBeInTheDocument();
  });

  it('shows a placeholder for pages that are not built yet', () => {
    renderAt('/safety');
    expect(screen.getByText('Not built yet')).toBeInTheDocument();
  });
});
