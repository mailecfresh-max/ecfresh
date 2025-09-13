import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (data?.session?.user) {
          // Check if user is admin
          const { data: userData } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', data.session.user.id)
            .single();

          toast.success('Successfully signed in!');
          
          if (userData?.is_admin) {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;