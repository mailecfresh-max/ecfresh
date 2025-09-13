import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';

const BottomNav: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/shop', icon: ShoppingBag, label: 'Shop' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { to: '/account', icon: User, label: 'Account' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {badge && badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {badge > 9 ? '9+' : badge}
                    </motion.div>
                  )}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNav"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-600 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;