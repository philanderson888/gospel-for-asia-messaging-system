import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, AlertCircle, School, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BridgeOfHopeCenter } from '../types/bridgeOfHopeCenter';
import { Child } from '../types/child';
import { getChildBySponsorId, getChildrenByCenter } from '../services/childService';
import { getCenterByMissionary } from '../services/bridgeOfHopeCenterService';
import toast from 'react-hot-toast';

interface AuthenticatedUser {
  id: string;
  email: string;
  is_administrator: boolean;
  is_missionary: boolean;
  is_sponsor: boolean;
  approved: boolean;
  sponsor_id: string | null;
  child_id: string | null;
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

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [center, setCenter] = useState<BridgeOfHopeCenter | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    administrators: 0,
    missionaries: 0,
    sponsors: 0,
    pending: 0,
    unreadMessages: 0,
    bridgeOfHopeCenters: 1,
    children: 1
  });
  const [pendingCounts, setPendingCounts] = useState({
    administrators: 0,
    missionaries: 0,
    sponsors: 0
  });

  useEffect(() => {
    const checkUserStatusAndLoadData = async () => {
      if (!user) return;

      try {
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

        // Only load other data if the current user is approved
        if (userData?.approved) {
          // Get user counts
          const { data: countData, error: countError } = await supabase
            .from('authenticated_users')
            .select('*')
            .eq('approved', true);

          if (!countError && countData) {
            setUserCounts(prev => ({
              ...prev,
              administrators: countData.filter(u => u.is_administrator).length,
              missionaries: countData.filter(u => u.is_missionary).length,
              sponsors: countData.filter(u => u.is_sponsor).length
            }));
          }

          // Get pending counts
          const { data: pendingData, error: pendingError } = await supabase
            .from('authenticated_users')
            .select('*')
            .is('approved', null);

          if (!pendingError && pendingData) {
            setPendingCounts({
              administrators: pendingData.filter(u => u.is_administrator).length,
              missionaries: pendingData.filter(u => u.is_missionary).length,
              sponsors: pendingData.filter(u => u.is_sponsor).length
            });
            setUserCounts(prev => ({
              ...prev,
              pending: pendingData.length
            }));
          }

          // If user is a missionary, get their center details from local storage
          if (userData.is_missionary && userData.bridge_of_hope_id) {
            const centerData = getCenterByMissionary(userData.bridge_of_hope_id);
            if (centerData) {
              setCenter(centerData);
              // Get children at this center from local storage
              const centerChildren = getChildrenByCenter(userData.bridge_of_hope_id);
              setChildren(centerChildren);
            }
          }

          // If user is a sponsor, get their sponsored child from local storage
          if (userData.is_sponsor && userData.sponsor_id) {
            const sponsoredChild = getChildBySponsorId(userData.sponsor_id);
            if (sponsoredChild) {
              setChildren([sponsoredChild]);
            }
          }
        }
      } catch (error) {
        console.error('Error processing users:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isFirstRender.current && user) {
      checkUserStatusAndLoadData();
      isFirstRender.current = false;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access the dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <School className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Bridge of Hope
                </span>
              </div>
              {currentUser?.approved && currentUser?.is_administrator && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/tech-specs"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Tech Specs
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  navigate('/login');
                }}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!currentUser.approved ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Approval Pending
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your account is pending approval. You will be notified once an
                      administrator has reviewed your registration.
                    </p>
                  </div>
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

              {/* Missionary Welcome */}
              {currentUser.is_missionary && (
                <div className="bg-white shadow rounded-lg mb-6">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      Welcome, Missionary
                    </h2>
                    <p className="text-gray-600 mb-4">
                      "And he said to them, 'Go into all the world and proclaim the gospel
                      to the whole creation.'" - Mark 16:15
                    </p>
                    {center && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Your Bridge of Hope Center
                        </h3>
                        <p className="mt-1 text-lg text-gray-900">{center.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sponsor Welcome */}
              {currentUser.is_sponsor && (
                <div className="bg-white shadow rounded-lg mb-6">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      Welcome, Sponsor
                    </h2>
                    <p className="text-gray-600 mb-4">
                      "Whoever receives one such child in my name receives me." - Matthew
                      18:5
                    </p>
                    {children.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Your Sponsored Child
                        </h3>
                        <p className="mt-1 text-lg text-gray-900">
                          {children[0].name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
                                {pendingCounts.administrators > 0 && (
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                    <span className="px-2 py-0.5 rounded-full bg-red-100">
                                      {pendingCounts.administrators} pending
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
                                {pendingCounts.missionaries > 0 && (
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                    <span className="px-2 py-0.5 rounded-full bg-red-100">
                                      {pendingCounts.missionaries} pending
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
                                {pendingCounts.sponsors > 0 && (
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                    <span className="px-2 py-0.5 rounded-full bg-red-100">
                                      {pendingCounts.sponsors} pending
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

              {/* Missionary Dashboard Link */}
              {currentUser.is_missionary && (
                <div className="mt-6">
                  <Link
                    to="/missionary-dashboard"
                    className="block bg-white shadow rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <School className="h-6 w-6 text-indigo-600" />
                        <h3 className="ml-3 text-lg font-medium text-gray-900">
                          Go to Missionary Dashboard
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        View and manage your Bridge of Hope center, children, and messages
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Sponsor Messages Link */}
              {currentUser.is_sponsor && (
                <div className="mt-6">
                  <Link
                    to="/messages"
                    className="block bg-white shadow rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <MessageCircle className="h-6 w-6 text-indigo-600" />
                        <h3 className="ml-3 text-lg font-medium text-gray-900">
                          View Messages
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Read and send messages to your sponsored child
                      </p>
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