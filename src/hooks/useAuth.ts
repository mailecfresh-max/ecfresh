import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Sample users for demo
const sampleUsers: User[] = [
  {
    id: 'admin-1',
    email: 'mail.ecfresh@gmail.com',
    name: 'Admin',
    phone: '+91 9876543210',
    loyaltyPoints: 0,
    totalPurchases: 0,
    addresses: [],
    isAdmin: true
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = getFromLocalStorage<User | null>(LOCAL_STORAGE_KEYS.USER, null);
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simple authentication logic
    if (email === 'mail.ecfresh@gmail.com' && password === 'Signin@66') {
      const adminUser = sampleUsers.find(u => u.email === email);
      if (adminUser) {
        setUser(adminUser);
        setToLocalStorage(LOCAL_STORAGE_KEYS.USER, adminUser);
        setIsLoading(false);
        return true;
      }
    }
    
    // For demo, allow any email/password combination for regular users
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      phone: '',
      loyaltyPoints: 0,
      totalPurchases: 0,
      addresses: [],
      isAdmin: false
    };
    
    setUser(newUser);
    setToLocalStorage(LOCAL_STORAGE_KEYS.USER, newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    removeFromLocalStorage(LOCAL_STORAGE_KEYS.USER);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser);
    } else {
      // If no user exists, create a new one from provided data (useful for guest -> account flow)
      const newUser: User = {
        id: userData.id || `user-${Date.now()}`,
        email: userData.email || `${(userData as any).phone || 'guest'}@guest.local`,
        name: userData.name || 'Guest',
        phone: (userData as any).phone || '',
        pinCode: userData.pinCode || undefined,
        loyaltyPoints: userData.loyaltyPoints ?? 0,
        totalPurchases: userData.totalPurchases ?? 0,
        addresses: (userData.addresses as any) || [],
        isAdmin: userData.isAdmin ?? false
      };
      setUser(newUser);
      setToLocalStorage(LOCAL_STORAGE_KEYS.USER, newUser);
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout, updateUser, isLoading } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};