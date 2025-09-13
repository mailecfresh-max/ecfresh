import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../../utils/localStorage';
import PinCodeSelector from '../common/PinCodeSelector';
import { PinCode } from '../../types';

const Header: React.FC = () => {
  const [isPinSelectorOpen, setIsPinSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalItems = getTotalItems();
  const savedPin = getFromLocalStorage<PinCode | null>(LOCAL_STORAGE_KEYS.USER_PIN, null);

  const handlePinSelect = (pinCode: PinCode) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PIN, JSON.stringify(pinCode));
    window.location.reload(); // Refresh to update pin display
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/WhatsApp_Image_2025-07-24_at_7.15.05_AM-removebg-preview.png" 
                alt="ECFresh Logo" 
                className="h-8 w-auto"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for vegetables, fruits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                />
              </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* PIN Selector */}
              <button
                onClick={() => setIsPinSelectorOpen(true)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:block">
                  {savedPin ? savedPin.area : 'Select PIN'}
                </span>
              </button>

              {/* Cart - Desktop */}
              <Link
                to="/cart"
                className="hidden md:flex relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.div>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <Link
                    to={user.isAdmin ? "/admin" : "/account"}
                    className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors"
                  >
                    {user.isAdmin ? 'Admin' : (user.name || 'Account')}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="md:hidden py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for vegetables, fruits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden border-t border-gray-200 bg-white"
        >
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            {user && (
              <Link
                to={user.isAdmin ? "/admin" : "/account"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {user.isAdmin ? 'Admin Dashboard' : 'My Account'}
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-green-600 font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      </header>

      <PinCodeSelector
        isOpen={isPinSelectorOpen}
        onClose={() => setIsPinSelectorOpen(false)}
        onSelect={handlePinSelect}
        selectedPin={savedPin?.pin}
      />
    </>
  );
};

export default Header;