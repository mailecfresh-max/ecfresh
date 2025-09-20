import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { WishlistProvider } from './hooks/useWishlist';
import { AdminDataProvider } from './hooks/useAdminData';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPasswordPage from './pages/AdminPasswordPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AccountLayout from './pages/account/AccountLayout';
import WishlistPage from './pages/WishlistPage';

// Get the publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we have a valid Clerk key (not just a placeholder)
const hasValidClerkKey = clerkPubKey && 
  clerkPubKey !== 'pk_test_placeholder_key_replace_with_real_key' && 
  clerkPubKey.startsWith('pk_');

if (!hasValidClerkKey) {
  console.warn('Missing Clerk Publishable Key. Authentication features will be disabled.');
}

function App() {
  // If no valid Clerk key is available, render without ClerkProvider
  if (!hasValidClerkKey) {
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
                  
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin" element={<AdminPasswordPage />} />
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

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
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
                  
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin" element={<AdminPasswordPage />} />
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
    </ClerkProvider>
  );
}

export default App;