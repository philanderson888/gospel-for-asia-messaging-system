import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Sponsor {
  id: string;
  email: string;
  created_at: string;
}

export default function Sponsors() {
  const { user } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('\n==================');
      console.log('Manage Sponsors');
      console.log('==================\n');
      loadSponsors();
      isFirstRender.current = false;
    }
  }, []);

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_sponsor', true)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setSponsors(data || []);
      
      // Log current sponsors
      console.log('\nCurrent sponsors:');
      (data || []).forEach(sponsor => {
        console.log(`- ${sponsor.email}`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load sponsors');
      console.error('Error loading sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSponsor = async (sponsorId: string, sponsorEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${sponsorEmail} as a sponsor?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({ is_sponsor: false })
        .eq('id', sponsorId);

      if (error) throw error;

      toast.success('Sponsor removed successfully');
      loadSponsors();
    } catch (error: any) {
      toast.error('Failed to remove sponsor');
      console.error('Error removing sponsor:', error);
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
            <h2 className="text-lg font-medium mb-4">Current Sponsors</h2>
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
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sponsor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sponsor.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveSponsor(sponsor.id, sponsor.email)}
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