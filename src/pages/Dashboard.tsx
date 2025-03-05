import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const checkAdministrators = async () => {
      try {
        const { data, error } = await supabase
          .from('administrators')
          .select('email');

        if (error) {
          console.error('Error fetching administrators:', error);
          return;
        }

        if (data && data.length > 0) {
          console.log('Current administrators:', data.map(admin => admin.email));
        } else {
          console.log('No administrators present');
        }
      } catch (error) {
        console.error('Error checking administrators:', error);
      }
    };

    if (isFirstRender.current && user) {
      console.log('\n===============');
      console.log('Dashboard');
      console.log('===============\n');
      console.log('Current user:', user.email);
      checkAdministrators();
      isFirstRender.current = false;
    }
  }, [user]);

  const handleSignOut = async () => {
    console.log('Sign out requested');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/administrators"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Administrators
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Welcome!</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                You are signed in as <span className="font-medium">{user?.email}</span>
              </p>
              <p className="text-gray-600">
                Welcome to your dashboard! This is where you'll see your personalized
                content and settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}