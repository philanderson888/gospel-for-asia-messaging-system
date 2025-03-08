import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, AlertCircle, UserCheck, MessageCircle, School, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { logMessages, getUnreadMessagesCount } from '../services/messageService';
import { logCenters, getCenterByMissionary } from '../services/bridgeOfHopeCenterService';
import { logChildren } from '../services/childService';
import { BridgeOfHopeCenter } from '../types/bridgeOfHopeCenter';

interface AuthenticatedUser {
  id: string;
  email: string;
  is_administrator: boolean;
  is_missionary: boolean;
  is_sponsor: boolean;
  is_bridge_of_hope: boolean;
  approved: boolean | null;
  approved_by: string | null;
  approved_date_time: string | null;
  sponsor_id: string | null;
  bridge_of_hope_id: string | null;
  bridge_of_hope_name: string | null;
}

interface UserCounts {
  administrators: number;
  missionaries: number;
  sponsors: number;
  pending: number;
  unreadMessages: number;
  bridgeOfHopeCenters: number;
  children: number;
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
  const [center, setCenter] = useState<BridgeOfHopeCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAdministrators, setPendingAdministrators] = useState(0);
  const [pendingMissionaries, setPendingMissionaries] = useState(0);
  const [pendingSponsors, setPendingSponsors] = useState(0);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    administrators: 0,
    missionaries: 0,
    sponsors: 0,
    pending: 0,
    unreadMessages: 0,
    bridgeOfHopeCenters: 1,
    children: 1
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

        // Log all local storage data
        logMessages();
        logCenters();
        logChildren();

        // If user is a sponsor, get their unread message count
        if (userData?.is_sponsor && userData?.sponsor_id) {
          const unreadCount = getUnreadMessagesCount(userData.sponsor_id);
          setUserCounts(prev => ({ ...prev, unreadMessages: unreadCount }));
        }

        // If user is a missionary, get their center details
        if (userData?.is_missionary && userData?.bridge_of_hope_id) {
          const centerData = getCenterByMissionary(userData.bridge_of_hope_id);
          setCenter(centerData);
        }

        // Only load other data if the current user is approved
        if (userData?.approved) {
          console.log('User is approved, fetching all data...');

          // Fetch users
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
              if (user.is_administrator) setPendingAdministrators(prev => prev + 1);
              if (user.is_missionary) setPendingMissionaries(prev => prev + 1);
              if (user.is_sponsor) setPendingSponsors(prev => prev + 1);
            } else {
              if (user.is_administrator) userLists.administrators.push(user);
              if (user.is_missionary) userLists.missionaries.push(user);
              if (user.is_sponsor) userLists.sponsors.push(user);
            }
          });

          // Set counts
          setUserCounts(prev => ({
            ...prev,
            administrators: userLists.administrators.length,
            missionaries: userLists.missionaries.length,
            sponsors: userLists.sponsors.length,
            pending: userLists.pending.length
          }));

          // Log user details
          console.log('\n=== User Statistics ===');
          console.log('Administrators:', userLists.administrators.length);
          console.log('Missionaries:', userLists.missionaries.length);
          console.log('Sponsors:', userLists.sponsors.length);
          console.log('Pending:', userLists.pending.length);
          console.log('Bridge of Hope Centers:', 1);
          console.log('Children:', 1);
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
            <>
              {/* Administrator Welcome Banner */}
              {currentUser.is_administrator && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg mb-6">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Bridge of Hope Administrator's Dashboard
                    </h1>
                    <p className="text-blue-100">
                      "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters." - Colossians 3:23
                    </p>
                  </div>
                </div>
              )}

              {/* Missionary Dashboard Content */}
              {currentUser.is_missionary && (
                <>
                  {/* Welcome Message */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg mb-6">
                    <div className="p-8">
                      <h1 className="text-2xl font-bold text-white mb-2">
                        Welcome, {user?.email}!
                      </h1>
                      <p className="text-blue-100">
                        "And we know that in all things God works for the good of those who love him, 
                        who have been called according to his purpose." - Romans 8:28
                      </p>
                    </div>
                  </div>

                  {/* Bridge of Hope Center Info */}
                  <div className="bg-white shadow rounded-lg mb-6">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <School className="h-6 w-6 text-indigo-600 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Your Bridge of Hope Center</h2>
                      </div>
                      {center ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Center Name</p>
                            <p className="mt-1 text-lg text-gray-900">{center.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Center ID</p>
                            <p className="mt-1 text-lg text-gray-900">{center.center_id}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No Bridge of Hope center assigned yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Children Card */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Users className="h-6 w-6 text-green-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Children</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          View and manage children at your Bridge of Hope center
                        </p>
                        <div className="mt-4">
                          <Link
                            to="/missionary-dashboard"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            View Children
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Messages Card */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <MessageCircle className="h-6 w-6 text-purple-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Manage messages between sponsors and children (Coming Soon)
                        </p>
                        <div className="mt-4">
                          <button
                            disabled
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                          >
                            Coming Soon
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sponsor Dashboard Content */}
              {currentUser.is_sponsor && (
                <>
                  {/* Sponsor Welcome Message */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg mb-6">
                    <div className="p-8">
                      <h1 className="text-2xl font-bold text-white mb-2">
                        Welcome, {user?.email}!
                      </h1>
                      <p className="text-blue-100 mb-4">
                        "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." - Galatians 6:9
                      </p>
                      <p className="text-blue-100">
                        Your sponsorship is making a real difference in a child's life. Through your support and prayers, 
                        you're helping to provide education, nutrition, and spiritual guidance. Keep encouraging your sponsored 
                        child through your messages - your words mean more than you know!
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Messages Card */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <MessageCircle className="h-6 w-6 text-purple-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Stay connected with your sponsored child through personal messages
                        </p>
                        <div className="mt-4">
                          <Link
                            to="/messages"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            View Messages
                            {userCounts.unreadMessages > 0 && (
                              <span className="ml-2 px-2 py-1 text-xs bg-purple-800 rounded-full">
                                {userCounts.unreadMessages} new
                              </span>
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Prayer Focus Card */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Heart className="h-6 w-6 text-red-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Prayer Focus</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          This week's prayer focus for your sponsored child:
                        </p>
                        <div className="bg-red-50 rounded-lg p-4">
                          <p className="text-red-800">
                            "May the God of hope fill you with all joy and peace as you trust in him, 
                            so that you may overflow with hope by the power of the Holy Spirit." 
                            - Romans 15:13
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unread Messages Card */}
                  <Link to="/messages" className="block">
                    <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <MessageCircle className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Unread Messages
                              </dt>
                              <dd className="text-lg font-medium text-purple-900">
                                {userCounts.unreadMessages}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )}

              {/* Administrator Stats */}
              {currentUser.is_administrator && (
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
                                Administrators
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-lg font-medium text-indigo-900">
                                  {userCounts.administrators}
                                </div>
                                {pendingAdministrators > 0 && (
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                    <span className="px-2 py-0.5 rounded-full bg-red-100">
                                      {pendingAdministrators} pending
                                    </span>
                                  </div>
                                )}
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
                                Missionaries
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-lg font-medium text-green-900">
                                  {userCounts.missionaries}
                                </div>
                                {pendingMissionaries > 0 && (
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                    <span className="px-2 py-0.5 rounded-full bg-red-100">
                                      {pendingMissionaries} pending
                                    </span>
                                  </div>
                                )}
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
                                Sponsors
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-lg font-medium text-blue-900">
                                  {userCounts.sponsors}
                                </div>
                                {pendingSponsors > 0 && (
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                    <span className="px-2 py-0.5 rounded-full bg-red-100">
                                      {pendingSponsors} pending
                                    </span>
                                  </div>
                                )}
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
                                New Users Pending
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}