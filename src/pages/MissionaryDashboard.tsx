import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, School, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getCenterByMissionary } from '../services/bridgeOfHopeCenterService';
import { getChildrenByCenter } from '../services/childService';
import { Child } from '../types/child';
import { BridgeOfHopeCenter } from '../types/bridgeOfHopeCenter';

interface AuthenticatedUser {
  id: string;
  email: string;
  bridge_of_hope_id: string | null;
  bridge_of_hope_name: string | null;
}

export default function MissionaryDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [center, setCenter] = useState<BridgeOfHopeCenter | null>(null);
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    const loadMissionaryData = async () => {
      if (!user) return;

      try {
        console.log('\n=== Loading Missionary Dashboard ===');
        console.log('Loading data for missionary:', user.email);

        // Get missionary's details
        const { data: userData, error: userError } = await supabase
          .from('authenticated_users')
          .select('id, email, bridge_of_hope_id, bridge_of_hope_name')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        console.log('Missionary details:', userData);
        setCurrentUser(userData);

        if (userData.bridge_of_hope_id) {
          // Get Bridge of Hope center details
          const centerData = getCenterByMissionary(userData.bridge_of_hope_id);
          console.log('Bridge of Hope center:', centerData);
          setCenter(centerData);

          if (centerData) {
            // Get children at this center
            const centerChildren = getChildrenByCenter(centerData.center_id);
            console.log('Children at center:', centerChildren);
            setChildren(centerChildren);
          }
        }
      } catch (error) {
        console.error('Error loading missionary data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMissionaryData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

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
                <button
                  onClick={() => {
                    const element = document.getElementById('children-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  View Children
                </button>
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

        {/* Children Section */}
        <div id="children-section" className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Children at Your Center</h2>
            </div>
            {children.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Child ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sponsorship Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {children.map((child) => (
                      <tr key={child.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {child.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {child.child_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(child.date_of_birth).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {child.sponsor_id ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Sponsored
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Awaiting Sponsor
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No children registered at this center yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}