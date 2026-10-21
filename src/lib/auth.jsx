import React from 'react';
import { api, tokenStore } from './api.js';

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!tokenStore.get()) {
      setIsLoading(false);
      return;
    }
    api('/me')
      .then((body) => setUser(body.data))
      .catch(() => tokenStore.clear())
      .finally(() => setIsLoading(false));
  }, []);

  const value = React.useMemo(() => ({
    user,
    isLoading,
    register: (payload) => api('/auth/register', { method: 'POST', body: payload }),
    verifyOtp: async (payload) => {
      const body = await api('/auth/otp/verify', { method: 'POST', body: payload });
      tokenStore.set(body.token);
      setUser(body.user);
      return body;
    },
    resendOtp: (payload) => api('/auth/otp/resend', { method: 'POST', body: payload }),
    login: async (payload) => {
      const body = await api('/auth/login', { method: 'POST', body: payload });
      tokenStore.set(body.token);
      setUser(body.user);
      return body;
    },
    logout: async () => {
      try {
        await api('/auth/logout', { method: 'POST' });
      } catch {
        /* token may already be invalid; clear locally regardless */
      }
      tokenStore.clear();
      setUser(null);
    },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
