import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  signInWithEmail: (email: string) => Promise<boolean>;
  signInWithPassword: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData?: { name?: string; phone?: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
  createUserIfNotExists: (email: string, userData?: Partial<User>) => Promise<User>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          addresses (*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

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
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    if (!supabase) {
      toast.error('Authentication service not available');
      return false;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending magic link:', error);
      return false;
    }
  };

  const signInWithPassword = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      toast.error('Authentication service not available');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      if (data.user) {
        await fetchUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error signing in with password:', error);
      const authError = error as AuthError;
      if (authError.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
      return false;
    }
  };

  const signUp = async (email: string, password: string, userData?: { name?: string; phone?: string }): Promise<boolean> => {
    if (!supabase) {
      toast.error('Authentication service not available');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: userData?.name || email.split('@')[0],
            phone: userData?.phone || ''
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Create user profile immediately
        await createUserIfNotExists(email, {
          name: userData?.name || email.split('@')[0],
          phone: userData?.phone || ''
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error signing up:', error);
      const authError = error as AuthError;
      if (authError.message.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
      return false;
    }
  };
  const signOut = async () => {
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
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

      // Get the current authenticated user ID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('No authenticated user found');
      }

      // Create new user with the authenticated user's ID
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email,
          name: userData?.name || email.split('@')[0],
          phone: userData?.phone || '',
          pin_code: userData?.pinCode || '',
          loyalty_points: userData?.loyaltyPoints || 0,
          total_purchases: userData?.totalPurchases || 0
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
      // Update addresses in Supabase
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
    { value: { user, signInWithEmail, signInWithPassword, signUp, signOut, createUserIfNotExists, updateUser, isLoading } },
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