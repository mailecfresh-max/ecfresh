import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
  createUserIfNotExists: (email: string, userData?: Partial<User>) => Promise<User>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    try {
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const createUserIfNotExists = async (email: string, userData?: Partial<User>): Promise<User> => {
    if (!supabase) {
      throw new Error('Database service not available');
    }

    try {
      // Create new user
      const newUserId = `user-${Date.now()}`;
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: newUserId,
          email,
          name: userData?.name || email.split('@')[0],
          phone: userData?.phone || '',
          pin_code: userData?.pinCode || '',
          loyalty_points: userData?.loyaltyPoints || 0,
          total_purchases: userData?.totalPurchases || 0,
          is_admin: false
        })
        .select()
        .single();

      if (error) throw error;

      const userProfile: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name || '',
        phone: newUser.phone || '',
        pinCode: newUser.pin_code || '',
        loyaltyPoints: newUser.loyalty_points,
        totalPurchases: newUser.total_purchases,
        addresses: [],
        isAdmin: newUser.is_admin
      };

      return userProfile;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    if (!supabase) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // Update in Supabase
    supabase
      .from('users')
      .update({
        name: updatedUser.name,
        phone: updatedUser.phone,
        pin_code: updatedUser.pinCode,
        loyalty_points: updatedUser.loyaltyPoints,
        total_purchases: updatedUser.totalPurchases
      })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating user:', error);
        }
      });

    // Handle addresses separately if provided
    if (userData.addresses) {
      userData.addresses.forEach(async (address) => {
        if (address.id.startsWith('addr-')) {
          // New address, insert
          await supabase.from('addresses').insert({
            user_id: user.id,
            name: address.name,
            phone: address.phone,
            address: address.address,
            pin_code: address.pinCode,
            landmark: address.landmark,
            optional_phone: address.optionalPhone,
            is_default: address.isDefault
          });
        } else {
          // Existing address, update
          await supabase.from('addresses').update({
            name: address.name,
            phone: address.phone,
            address: address.address,
            pin_code: address.pinCode,
            landmark: address.landmark,
            optional_phone: address.optionalPhone,
            is_default: address.isDefault
          }).eq('id', address.id);
        }
      });
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, signOut, createUserIfNotExists, updateUser, isLoading } },
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