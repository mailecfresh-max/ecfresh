import React, { useState } from 'react';
import { User, Package, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ProfileTab from './ProfileTab';
import OrdersTab from './OrdersTab';

type TabKey = 'profile' | 'orders';

const AccountLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [active, setActive] = useState<TabKey>('profile');

  if (isLoading) return null;
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
          <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to your account</h2>
          <p className="text-gray-600 mb-6">Please create an account or sign in to view orders and profile settings.</p>
          <div className="flex items-center justify-center gap-3">
            <Link 
              to="/shop" 
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> You can still place orders as a guest. An account will be created automatically when you checkout.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'orders', label: 'Orders', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Welcome back, {user.name || 'User'}!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`rounded-xl border text-left p-4 transition ${
                active === key ? 'border-green-500 bg-white shadow' : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">{label}</span>
              </div>
            </button>
          ))}
        </div>

        {active === 'profile' && <ProfileTab />}
        {active === 'orders' && <OrdersTab />}
      </div>
    </div>
  );
};

export default AccountLayout;