import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { WishlistProvider } from './hooks/useWishlist';
import { AdminDataProvider } from './hooks/useAdminData';
import { supabase } from './lib/supabase';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetailPage from './pages/ProductDetailPage';
import AccountLayout from './pages/account/AccountLayout';
import WishlistPage from './pages/WishlistPage';
import AuthDebug from './components/common/AuthDebug';

function App() {
  useEffect(() => {
    // Handle auth callback from magic link
    const handleAuthCallback = async () => {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth callback error:', error);
          return;
        }
        
        if (data?.session) {
          console.log('User authenticated:', data.session.user.email);
          // Clear URL fragments
          if (window.location.hash) {
            window.location.hash = '';
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
      }
    };

    // Check if this is an auth callback
    if (window.location.hash.includes('access_token') || 
        window.location.hash.includes('error') || 
        window.location.hash.includes('type=recovery')) {
      handleAuthCallback();
    }
  }, []);

  return (
    <AuthProvider>
      <AdminDataProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#333',
                      color: '#fff',
                      borderRadius: '12px',
                    },
                  }}
                />
                
                <AuthDebug />
                
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route
                    path="/*"
                    element={
                      <>
                        <Header />
                        <main className="pb-16 md:pb-0">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/product/:productId" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/account" element={<AccountLayout />} />
                          </Routes>
                        </main>
                        <BottomNav />
                      </>
                    }
                  />
                </Routes>
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AdminDataProvider>
    </AuthProvider>
  );
}

export default App;