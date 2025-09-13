import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthDebug: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-1">Auth Debug:</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>Admin: {user?.isAdmin ? 'Yes' : 'No'}</div>
      <div>ID: {user?.id || 'None'}</div>
    </div>
  );
};

export default AuthDebug;