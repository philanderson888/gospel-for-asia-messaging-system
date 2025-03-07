import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, School, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getCenterByMissionary } from '../services/bridgeOfHopeCenterService';
import { getChildrenByCenter } from '../services/childService';
import { logRecentMessagesForCenter } from '../services/bridgeOfHopeMessageService';
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
  const isFirstRender = useRef(true);

  useEffect(() => {
    const loadMissionaryData = async () => {
      if (!user) return;

      try {
        // Get missionary's details
        const { data: userData, error: userError } = await supabase
          .from('authenticated_users')
          .select('id, email, bridge_of_hope_id, bridge_of_hope_name')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        setCurrentUser(userData);

        if (userData.bridge_of_hope_id) {
          // Get Bridge of Hope center details
          const centerData = getCenterByMissionary(userData.bridge_of_hope_id);
          setCenter(centerData);

          if (centerData) {
            // Get children at this center
            const centerChildren = getChildrenByCenter(centerData.center_id);
            setChildren(centerChildren);

            // Log recent messages for this center
            if (isFirstRender.current) {
              logRecentMessagesForCenter(centerData.center_id);
              isFirstRender.current = false;
            }
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

        {/* Bridge of Hope Center Info */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <School className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Bridge of Hope Center Details</h2>
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

        {/* Children List */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Children at this Center</h2>
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
                        Sponsor Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {children.map((child) => (
                      <tr key={child.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {child.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {child.child_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(child.date_of_birth).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            child.sponsor_id
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {child.sponsor_id ? 'Sponsored' : 'Needs Sponsor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {child.sponsor_id && (
                            <Link
                              to={`/messages/${child.sponsor_id}`}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              View Messages
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No children registered at this center yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}