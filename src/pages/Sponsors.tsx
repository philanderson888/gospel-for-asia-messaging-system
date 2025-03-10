import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Sponsor {
  id: string;
  email: string;
  created_at: string;
  approved: boolean | null;
  sponsor_id: string | null;
  child_id: string | null;
}

interface EditingState {
  id: string | null;
  field: 'sponsor_id' | 'child_id' | null;
  value: string;
}

export default function Sponsors() {
  const { user } = useAuth();
  const [pendingSponsors, setPendingSponsors] = useState<Sponsor[]>([]);
  const [approvedSponsors, setApprovedSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null, value: '' });
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
      // Load pending sponsors
      const { data: pendingData, error: pendingError } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_sponsor', true)
        .is('approved', null)
        .order('created_at', { ascending: true });

      if (pendingError) throw pendingError;

      // Load approved sponsors
      const { data: approvedData, error: approvedError } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_sponsor', true)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (approvedError) throw approvedError;

      setPendingSponsors(pendingData || []);
      setApprovedSponsors(approvedData || []);
      
      // Log sponsors
      console.log('\nPending sponsors:');
      (pendingData || []).forEach(sponsor => {
        console.log(`- ${sponsor.email} (Sponsor ID: ${sponsor.sponsor_id}, Child ID: ${sponsor.child_id})`);
      });
      
      console.log('\nApproved sponsors:');
      (approvedData || []).forEach(sponsor => {
        console.log(`- ${sponsor.email} (Sponsor ID: ${sponsor.sponsor_id}, Child ID: ${sponsor.child_id})`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load sponsors');
      console.error('Error loading sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sponsorId: string, sponsorEmail: string) => {
    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({
          approved: true,
          approved_by: user?.id,
          approved_date_time: new Date().toISOString()
        })
        .eq('id', sponsorId);

      if (error) throw error;

      toast.success(`Sponsor ${sponsorEmail} approved successfully`);
      loadSponsors();
    } catch (error: any) {
      toast.error('Failed to approve sponsor');
      console.error('Error approving sponsor:', error);
    }
  };

  const handleReject = async (sponsorId: string, sponsorEmail: string) => {
    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({
          approved: false,
          approved_by: user?.id,
          approved_date_time: new Date().toISOString()
        })
        .eq('id', sponsorId);

      if (error) throw error;

      toast.success(`Sponsor ${sponsorEmail} rejected`);
      loadSponsors();
    } catch (error: any) {
      toast.error('Failed to reject sponsor');
      console.error('Error rejecting sponsor:', error);
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

  const startEditing = (id: string, field: 'sponsor_id' | 'child_id', value: string | null) => {
    setEditing({ id, field, value: value || '' });
  };

  const cancelEditing = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  const validateId = (value: string, field: 'sponsor_id' | 'child_id'): boolean => {
    if (!value) {
      toast.error(`${field === 'sponsor_id' ? 'Sponsor' : 'Child'} ID is required`);
      return false;
    }

    if (!/^\d+$/.test(value)) {
      toast.error(`${field === 'sponsor_id' ? 'Sponsor' : 'Child'} ID must contain only numbers`);
      return false;
    }

    const maxLength = field === 'sponsor_id' ? 8 : 10;
    if (value.length > maxLength) {
      toast.error(`${field === 'sponsor_id' ? 'Sponsor' : 'Child'} ID must be ${maxLength} digits or less`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!editing.id || !editing.field) return;

    if (!validateId(editing.value, editing.field)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({ [editing.field]: editing.value })
        .eq('id', editing.id);

      if (error) throw error;

      toast.success('Updated successfully');
      loadSponsors();
      cancelEditing();
    } catch (error: any) {
      toast.error('Failed to update');
      console.error('Error updating:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const maxLength = editing.field === 'sponsor_id' ? 8 : 10;
    const numbersOnly = value.replace(/[^\d]/g, '').slice(0, maxLength);
    setEditing({ ...editing, value: numbersOnly });
  };

  const renderEditableCell = (sponsor: Sponsor, field: 'sponsor_id' | 'child_id') => {
    const isEditing = editing.id === sponsor.id && editing.field === field;
    const value = sponsor[field];
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={editing.value}
            onChange={handleInputChange}
            maxLength={field === 'sponsor_id' ? 8 : 10}
            pattern="[0-9]*"
            inputMode="numeric"
            className="block w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={`Enter ${field === 'sponsor_id' ? 'Sponsor' : 'Child'} ID`}
          />
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-900"
            title="Save"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={cancelEditing}
            className="text-red-600 hover:text-red-900"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center group">
        <span className="text-gray-500">{value || 'Not provided'}</span>
        <button
          onClick={() => startEditing(sponsor.id, field, value)}
          className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    );
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

        {/* Pending Sponsors Section */}
        {pendingSponsors.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 text-yellow-600">Pending Sponsors</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sponsor ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Child ID
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
                    {pendingSponsors.map((sponsor) => (
                      <tr key={sponsor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sponsor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderEditableCell(sponsor, 'sponsor_id')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderEditableCell(sponsor, 'child_id')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sponsor.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(sponsor.id, sponsor.email)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(sponsor.id, sponsor.email)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center ml-2"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Approved Sponsors Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-green-600">Approved Sponsors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sponsor ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Child ID
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
                  {approvedSponsors.map((sponsor) => (
                    <tr key={sponsor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sponsor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderEditableCell(sponsor, 'sponsor_id')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderEditableCell(sponsor, 'child_id')}
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