import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

interface AuthenticatedUser {
  id: string;
  email: string;
  is_administrator: boolean;
  is_missionary: boolean;
  is_sponsor: boolean;
  approved: boolean | null;
  approved_by: string | null;
  approved_date_time: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [currentUserApproved, setCurrentUserApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserApprovalAndLoadData = async () => {
      if (!user) return;

      try {
        console.log('\n=== Checking User Approval Status ===');
        // First check the current user's approval status
        const { data: userData, error: userError } = await supabase
          .from('authenticated_users')
          .select('approved')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user approval status:', userError);
          return;
        }

        console.log('User approval status:', userData?.approved);
        setCurrentUserApproved(userData?.approved);

        // Only load other users if the current user is approved
        if (userData?.approved) {
          console.log('User is approved, fetching all users...');
          const { data, error } = await supabase
            .from('authenticated_users')
            .select('*');

          if (error) {
            console.error('Error fetching authenticated users:', error);
            return;
          }

          // Save all users to local storage
          localStorage.setItem('authenticatedUsers', JSON.stringify(data || []));

          // Categorize users
          const missionaries = data?.filter(user => user.is_missionary) || [];
          const sponsors = data?.filter(user => user.is_sponsor) || [];
          const administrators = data?.filter(user => user.is_administrator) || [];

          // Save categorized lists to local storage
          localStorage.setItem('missionaries', JSON.stringify(missionaries));
          localStorage.setItem('sponsors', JSON.stringify(sponsors));
          localStorage.setItem('administrators', JSON.stringify(administrators));

          // Log the results
          console.log('\n=== User Categories ===');
          
          console.log('\nMissionaries:');
          if (missionaries.length > 0) {
            missionaries.forEach(user => console.log(`- ${user.email}`));
          } else {
            console.log('No missionaries present');
          }

          console.log('\nSponsors:');
          if (sponsors.length > 0) {
            sponsors.forEach(user => console.log(`- ${user.email}`));
          } else {
            console.log('No sponsors present');
          }

          console.log('\nAdministrators:');
          if (administrators.length > 0) {
            administrators.forEach(user => console.log(`- ${user.email}`));
          } else {
            console.log('No administrators present');
          }
        }
      } catch (error) {
        console.error('Error processing users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFirstRender.current && user) {
      console.log('\n===============');
      console.log('Dashboard');
      console.log('===============\n');
      console.log('Current user:', user.email);
      checkUserApprovalAndLoadData();
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
      
      // Clear local storage on sign out
      localStorage.removeItem('authenticatedUsers');
      localStorage.removeItem('missionaries');
      localStorage.removeItem('sponsors');
      localStorage.removeItem('administrators');
      
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
              {currentUserApproved && (
                <Link
                  to="/authenticated-users"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Authenticated Users
                </Link>
              )}
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
          {!currentUserApproved ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your account is pending approval. You won't be able to access user information
                    until an administrator approves your account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your account is approved. You have full access to the system.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Welcome!</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                You are signed in as <span className="font-medium">{user?.email}</span>
              </p>
              {currentUserApproved ? (
                <p className="text-gray-600">
                  Welcome to your dashboard! Here you can manage users and access all system features.
                </p>
              ) : (
                <p className="text-gray-600">
                  Your account is currently pending approval. Once approved, you'll have access to all system features.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}