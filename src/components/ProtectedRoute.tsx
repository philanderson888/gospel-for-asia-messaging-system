import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // If we don't require admin access, user is automatically authorized
        if (!requireAdmin) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        // Only check admin status if the route requires it
        const { data, error } = await supabase
          .from('authenticated_users')
          .select('is_administrator, approved')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking authorization:', error);
          setLoading(false);
          return;
        }

        // For admin routes, user must be both approved and an administrator
        setIsAuthorized(data.approved && data.is_administrator);
      } catch (error) {
        console.error('Error in authorization check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [user, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Access Denied</h2>
          <p className="text-gray-600 text-center mb-6">
            You don't have permission to access this page.
          </p>
          <div className="flex justify-center">
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}