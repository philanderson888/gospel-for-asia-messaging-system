import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Missionary {
  id: string;
  email: string;
  created_at: string;
}

export default function Missionaries() {
  const { user } = useAuth();
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('\n==================');
      console.log('Manage Missionaries');
      console.log('==================\n');
      loadMissionaries();
      isFirstRender.current = false;
    }
  }, []);

  const loadMissionaries = async () => {
    try {
      const { data, error } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_missionary', true)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMissionaries(data || []);
      
      // Log current missionaries
      console.log('\nCurrent missionaries:');
      (data || []).forEach(missionary => {
        console.log(`- ${missionary.email}`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load missionaries');
      console.error('Error loading missionaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMissionary = async (missionaryId: string, missionaryEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${missionaryEmail} as a missionary?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({ is_missionary: false })
        .eq('id', missionaryId);

      if (error) throw error;

      toast.success('Missionary removed successfully');
      loadMissionaries();
    } catch (error: any) {
      toast.error('Failed to remove missionary');
      console.error('Error removing missionary:', error);
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
            <h2 className="text-lg font-medium mb-4">Current Missionaries</h2>
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
                  {missionaries.map((missionary) => (
                    <tr key={missionary.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {missionary.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(missionary.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveMissionary(missionary.id, missionary.email)}
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