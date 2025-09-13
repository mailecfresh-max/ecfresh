import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Leaf } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.isAdmin ? '/dashboard' : '/'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signInWithEmail(email);
      if (success) {
        setIsEmailSent(true);
        toast.success('Magic link sent! Check your email to sign in.');
      } else {
        toast.error('Failed to send magic link. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in your email to sign in.
            </p>
            <button
              onClick={() => {
                setIsEmailSent(false);
                setEmail('');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Try a different email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <img 
              src="/WhatsApp_Image_2025-07-24_at_7.15.05_AM-removebg-preview.png" 
              alt="ECFresh Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Enter your email to get a magic link</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>We'll send you a secure link to sign in without a password</p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;