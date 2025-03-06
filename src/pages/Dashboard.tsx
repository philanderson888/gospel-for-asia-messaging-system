import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, AlertCircle, UserCheck } from 'lucide-react';
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

interface UserCounts {
  administrators: number;
  missionaries: number;
  sponsors: number;
  pending: number;
}

interface UserLists {
  administrators: AuthenticatedUser[];
  missionaries: AuthenticatedUser[];
  sponsors: AuthenticatedUser[];
  pending: AuthenticatedUser[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    administrators: 0,
    missionaries: 0,
    sponsors: 0,
    pending: 0
  });

  useEffect(() => {
    const checkUserStatusAndLoadData = async () => {
      if (!user) return;

      try {
        console.log('\n=== Checking User Status ===');
        // First check the current user's status
        const { data: userData, error: userError } = await supabase
          .from('authenticated_users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user status:', userError);
          return;
        }

        setCurrentUser(userData);
        console.log('Current user status:', userData);

        // Only load other users if the current user is approved
        if (userData?.approved) {
          console.log('User is approved, fetching all users...');
          const { data: allUsers, error } = await supabase
            .from('authenticated_users')
            .select('*')
            .order('email', { ascending: true });

          if (error) {
            console.error('Error fetching authenticated users:', error);
            return;
          }

          // Categorize users
          const userLists: UserLists = {
            administrators: [],
            missionaries: [],
            sponsors: [],
            pending: []
          };

          allUsers?.forEach(user => {
            if (user.approved === null || user.approved === false) {
              userLists.pending.push(user);
            } else {
              // User is approved, add to respective role lists
              if (user.is_administrator) userLists.administrators.push(user);
              if (user.is_missionary) userLists.missionaries.push(user);
              if (user.is_sponsor) userLists.sponsors.push(user);
            }
          });

          // Set counts
          const counts: UserCounts = {
            administrators: userLists.administrators.length,
            missionaries: userLists.missionaries.length,
            sponsors: userLists.sponsors.length,
            pending: userLists.pending.length
          };

          setUserCounts(counts);

          // Log user details (limited to 10 per category)
          console.log('\n=== User Statistics ===');
          
          console.log('\nApproved Administrators:', counts.administrators);
          userLists.administrators.slice(0, 10).forEach(admin => {
            console.log(`- ${admin.email}`);
          });
          
          console.log('\nApproved Missionaries:', counts.missionaries);
          userLists.missionaries.slice(0, 10).forEach(missionary => {
            console.log(`- ${missionary.email}`);
          });
          
          console.log('\nApproved Sponsors:', counts.sponsors);
          userLists.sponsors.slice(0, 10).forEach(sponsor => {
            console.log(`- ${sponsor.email}`);
          });
          
          console.log('\nPending Approval:', counts.pending);
          userLists.pending.slice(0, 10).forEach(pending => {
            console.log(`- ${pending.email} (${[
              pending.is_administrator ? 'Administrator' : '',
              pending.is_missionary ? 'Missionary' : '',
              pending.is_sponsor ? 'Sponsor' : ''
            ].filter(Boolean).join(', ')})`);
          });
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
      checkUserStatusAndLoadData();
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
              {currentUser?.approved && currentUser.is_administrator && (
                <Link
                  to="/authenticated-users"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
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
          {!currentUser?.approved ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your account is pending approval. You won't be able to access system features
                    until an administrator approves your account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            currentUser && !currentUser.is_administrator && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Your account is approved. You have access to the system as a
                      {currentUser.is_missionary && ' Missionary'}
                      {currentUser.is_sponsor && ' Sponsor'}.
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Welcome!</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                You are signed in as <span className="font-medium">{user?.email}</span>
              </p>

              {currentUser?.approved && currentUser.is_administrator && (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Link to="/administrators" className="block">
                    <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Users className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Approved Administrators
                              </dt>
                              <dd className="text-lg font-medium text-indigo-900">
                                {userCounts.administrators}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/missionaries" className="block">
                    <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Approved Missionaries
                              </dt>
                              <dd className="text-lg font-medium text-green-900">
                                {userCounts.missionaries}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/sponsors" className="block">
                    <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Approved Sponsors
                              </dt>
                              <dd className="text-lg font-medium text-blue-900">
                                {userCounts.sponsors}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/pending" className="block">
                    <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Pending Approval
                              </dt>
                              <dd className="text-lg font-medium text-yellow-900">
                                {userCounts.pending}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}