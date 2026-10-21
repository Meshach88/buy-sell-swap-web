import React from 'react';
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { Shell } from './Shell.jsx';
import { SellerShell } from '../components/seller/SellerShell.jsx';
import { SellerOrdersPage } from '../pages/seller/SellerOrdersPage.jsx';
import { SellerOrderDetailPage } from '../pages/seller/SellerOrderDetailPage.jsx';
import { Home } from '../pages/Home.jsx';
import { ListingDetail } from '../pages/ListingDetail.jsx';
import { SearchPage } from '../pages/SearchPage.jsx';
import { StorefrontPage } from '../pages/StorefrontPage.jsx';
import { CartPage } from '../pages/CartPage.jsx';
import { CheckoutPage } from '../pages/CheckoutPage.jsx';
import { OrdersPage } from '../pages/OrdersPage.jsx';
import { OrderTrackPage } from '../pages/OrderTrackPage.jsx';
import { PaystackCallbackPage } from '../pages/PaystackCallbackPage.jsx';
import { DesignSystem } from '../pages/DesignSystem.jsx';
import { ComingSoon } from '../pages/ComingSoon.jsx';
import { SignupRole } from '../pages/auth/SignupRole.jsx';
import { SignupBuyer } from '../pages/auth/SignupBuyer.jsx';
import { SignupSeller } from '../pages/auth/SignupSeller.jsx';
import { VerifyOtp } from '../pages/auth/VerifyOtp.jsx';
import { Login } from '../pages/auth/Login.jsx';

/** The whole auth flow renders as a modal over the marketplace home, which
 * stays mounted underneath — matching the web design (Log in/Start selling
 * are header buttons on Home, not a separate full-screen flow). */
function HomeWithAuthOverlay() {
  return (
    <>
      <Home />
      <Outlet />
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route element={<HomeWithAuthOverlay />}>
          <Route index element={null} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignupRole />} />
          <Route path="signup/buyer" element={<SignupBuyer />} />
          <Route path="signup/seller" element={<SignupSeller />} />
          <Route path="verify" element={<VerifyOtp />} />
        </Route>
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="sellers/:slug" element={<StorefrontPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/paystack-callback" element={<PaystackCallbackPage />} />
        <Route path="orders/:id" element={<OrderTrackPage />} />
        <Route path="design" element={<DesignSystem />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>

      <Route path="sell" element={<SellerShell />}>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="orders/:id" element={<SellerOrderDetailPage />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
