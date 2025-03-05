import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Administrator {
  id: string;
  email: string;
  created_at: string;
}

export default function Administrators() {
  const { user, isAdmin } = useAuth();
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    loadAdministrators();
  }, []);

  const loadAdministrators = async () => {
    try {
      const { data, error } = await supabase
        .from('administrators')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setAdministrators(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);

    try {
      // First, check if the email matches the current user
      if (user?.email !== email) {
        throw new Error('You can only add yourself as the first administrator.');
      }

      // Add the user as an administrator
      const { error: insertError } = await supabase
        .from('administrators')
        .insert([
          {
            id: user.id,
            email: email,
          },
        ]);

      if (insertError) throw insertError;

      toast.success('Administrator added successfully');
      setEmail('');
      loadAdministrators();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, adminEmail: string) => {
    if (adminId === user?.id) {
      toast.error("You can't remove yourself as an administrator");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${adminEmail} as an administrator?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('administrators')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast.success('Administrator removed successfully');
      loadAdministrators();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isAdmin && administrators.length > 0) {
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
          {administrators.length === 0 && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Become an Administrator</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p className="text-sm text-yellow-700">
                  No administrators exist yet. As the first user, you can make yourself an administrator.
                  After that, only administrators can add new administrators.
                </p>
              </div>
              <form onSubmit={handleAddAdmin} className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {addingAdmin ? 'Adding...' : 'Become Administrator'}
                </button>
              </form>
            </div>
          )}

          {administrators.length > 0 && isAdmin && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Add Administrator</h2>
              <form onSubmit={handleAddAdmin} className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {addingAdmin ? 'Adding...' : 'Add Administrator'}
                </button>
              </form>
            </div>
          )}

          {administrators.length > 0 && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Current Administrators</h2>
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
                    {administrators.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {admin.id !== user?.id && isAdmin && (
                            <button
                              onClick={() => handleRemoveAdmin(admin.id, admin.email)}
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
          )}
        </div>
      </div>
    </div>
  );
}