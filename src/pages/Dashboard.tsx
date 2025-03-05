import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  to="/administrators"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Administrators
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{user?.email}</span>
                {isAdmin && (
                  <Shield className="h-4 w-4 text-indigo-600" title="Administrator" />
                )}
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
              {isAdmin ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800">
                        Administrator Access
                      </h3>
                      <p className="mt-2 text-sm text-indigo-700">
                        You have administrator privileges. You can manage other administrators
                        using the "Manage Administrators" button above.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Welcome to your dashboard! This is where you'll see your personalized
                  content and settings.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}