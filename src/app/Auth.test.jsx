import { render, screen, fireEvent, within } from '@testing-library/react';
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

function jsonResponse(status, body) {
  return Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });
}

/** Home is always mounted behind the auth modal, so every test needs its
 * background fetches (categories/listings) handled alongside whatever
 * auth endpoint that test cares about. */
function mockFetch(handlers) {
  globalThis.fetch = vi.fn((url) => {
    for (const [match, respond] of handlers) {
      if (url.endsWith(match)) return respond;
    }
    if (url.includes('/categories')) return jsonResponse(200, { data: [] });
    if (url.includes('/listings')) return jsonResponse(200, { data: [], meta: { total: 0 } });
    return jsonResponse(404, {});
  });
}

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch([]);
  });

  it('lets a buyer pick a role and see the matching signup form', async () => {
    renderAt('/signup');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

    fireEvent.click(screen.getByText('I want to buy'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByText('Your details')).toBeInTheDocument();
  });

  it('registers a buyer, verifies the code and lands signed in on Home', async () => {
    mockFetch([
      ['/auth/register', jsonResponse(201, { message: 'ok', phone: '08011112222', debug_code: '123456' })],
      ['/auth/otp/verify', jsonResponse(200, {
        token: 'test-token',
        user: { id: 1, name: 'Amina Bello', phone: '08011112222', roles: ['customer'], seller: null },
      })],
    ]);

    renderAt('/signup/buyer');

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Amina Bello' } });
    fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: '8011112222' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Enter the code')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();

    '123456'.split('').forEach((digit, i) => {
      fireEvent.change(screen.getByLabelText(`Digit ${i + 1}`), { target: { value: digit } });
    });

    expect(await screen.findByText(/Hi, Amina/)).toBeInTheDocument();
    expect(localStorage.getItem('bss.token')).toBe('test-token');
  });

  it('shows a validation error on login when the API rejects the credentials', async () => {
    mockFetch([
      ['/auth/login', jsonResponse(422, { message: "Those details don't match an account.", errors: { phone: ["Those details don't match an account."] } })],
    ]);

    renderAt('/login');
    const dialog = within(screen.getByRole('dialog'));

    fireEvent.change(dialog.getByLabelText(/Phone number/), { target: { value: '8000000000' } });
    fireEvent.change(dialog.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(dialog.getByRole('button', { name: 'Log in' }));

    // Shown twice by design: inline next to the field, and as a toast.
    expect((await screen.findAllByText("Those details don't match an account.")).length).toBeGreaterThan(0);
  });
});
