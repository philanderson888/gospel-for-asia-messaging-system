import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PendingUser {
  id: string;
  email: string;
  created_at: string;
  is_administrator: boolean;
  is_missionary: boolean;
  is_sponsor: boolean;
}

export default function Pending() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('\n==================');
      console.log('Manage Pending Users');
      console.log('==================\n');
      loadPendingUsers();
      isFirstRender.current = false;
    }
  }, []);

  const loadPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('authenticated_users')
        .select('*')
        .is('approved', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setPendingUsers(data || []);
      
      // Log current pending users
      console.log('\nCurrent pending users:');
      (data || []).forEach(pending => {
        console.log(`- ${pending.email} (${[
          pending.is_administrator ? 'Administrator' : '',
          pending.is_missionary ? 'Missionary' : '',
          pending.is_sponsor ? 'Sponsor' : ''
        ].filter(Boolean).join(', ')})`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load pending users');
      console.error('Error loading pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${userEmail}?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('User removed successfully');
      loadPendingUsers();
    } catch (error: any) {
      toast.error('Failed to remove user');
      console.error('Error removing user:', error);
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
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">New Users Pending Approval</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map((pendingUser) => (
                    <tr key={pendingUser.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pendingUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {[
                          pendingUser.is_administrator ? 'Administrator' : '',
                          pendingUser.is_missionary ? 'Missionary' : '',
                          pendingUser.is_sponsor ? 'Sponsor' : ''
                        ].filter(Boolean).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pendingUser.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveUser(pendingUser.id, pendingUser.email)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}