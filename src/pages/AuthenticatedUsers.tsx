import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthenticatedUser {
  id: string;
  email: string;
  created_at: string;
}

export default function AuthenticatedUsers() {
  const { user, isAdmin, checkUserExists } = useAuth();
  const [authenticatedUsers, setAuthenticatedUsers] = useState<AuthenticatedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('\n==================');
      console.log('Manage Authenticated Users');
      console.log('==================\n');
      loadAuthenticatedUsers();
      isFirstRender.current = false;
    }
  }, []);

  const loadAuthenticatedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('authenticated_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setAuthenticatedUsers(data || []);
      
      // Log current authenticated users
      console.log('\nCurrent authenticated users:');
      (data || []).forEach(user => {
        console.log(`- ${user.email}`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load authenticated users');
      console.error('Error loading authenticated users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);

    console.log(`Add Authenticated User requested for user: ${email}`);

    try {
      // Check if user exists in Supabase
      const userExists = await checkUserExists(email);
      console.log(userExists 
        ? 'User is present on the system so adding them to authenticated users' 
        : 'User is not present on the system so not possible to add them as authenticated user'
      );
      
      if (!userExists) {
        toast.error('Cannot add user: User does not exist in the system');
        return;
      }

      const { error: insertError } = await supabase
        .from('authenticated_users')
        .insert([
          {
            email: email,
          },
        ]);

      if (insertError) throw insertError;

      toast.success('User added successfully');
      setEmail('');
      loadAuthenticatedUsers();
    } catch (error: any) {
      toast.error('Failed to add user');
      console.error('Error adding user:', error);
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (userId === user?.id) {
      toast.error("You can't remove yourself as an authenticated user");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${userEmail} as an authenticated user?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('User removed successfully');
      loadAuthenticatedUsers();
    } catch (error: any) {
      toast.error('Failed to remove user');
      console.error('Error removing user:', error);
    }
  };

  if (!isAdmin && authenticatedUsers.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Access Denied</h2>
          <p className="text-gray-600 text-center mb-6">
            You don't have permission to access this page.
          </p>
          <Link
            to="/"
            className="flex items-center justify-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Add Authenticated User</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  onClick={handleAddUser}
                  disabled={addingUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {addingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Current Authenticated Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {authenticatedUsers.map((authUser) => (
                    <tr key={authUser.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {authUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(authUser.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {authUser.id !== user?.id && (
                          <button
                            onClick={() => handleRemoveUser(authUser.id, authUser.email)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        )}
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