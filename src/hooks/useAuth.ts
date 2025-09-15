import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
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
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        fetchUserProfile(clerkUser);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [clerkUser, isLoaded]);

  const fetchUserProfile = async (clerkUser: any) => {
    if (!supabase) return;

    console.log('Fetching user profile for:', clerkUser.emailAddresses[0]?.emailAddress);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          addresses (*)
        `)
        .eq('id', clerkUser.id)
        .single();

      if (error) {
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating new profile...');
          const newUser = await createUserIfNotExists(
            clerkUser.emailAddresses[0]?.emailAddress || '', 
            {
              name: clerkUser.fullName || clerkUser.firstName || '',
              phone: clerkUser.phoneNumbers[0]?.phoneNumber || ''
            }
          );
          setUser(newUser);
          setIsLoading(false);
          return;
        }
        throw error;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          email: data.email,
          name: data.name || '',
          phone: data.phone || '',
          pinCode: data.pin_code || '',
          loyaltyPoints: data.loyalty_points,
          totalPurchases: data.total_purchases,
          addresses: data.addresses || [],
          isAdmin: data.is_admin
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
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
      // First check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', clerkUser?.id)
        .single();

      if (existingUser && !fetchError) {
        // User exists, return existing user data
        const userProfile: User = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name || '',
          phone: existingUser.phone || '',
          pinCode: existingUser.pin_code || '',
          loyaltyPoints: existingUser.loyalty_points,
          totalPurchases: existingUser.total_purchases,
          addresses: [],
          isAdmin: existingUser.is_admin
        };
        return userProfile;
      }

      // Create new user with Clerk user's ID
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: clerkUser?.id,
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