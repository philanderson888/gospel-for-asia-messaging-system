import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Missionary {
  id: string;
  email: string;
  created_at: string;
  approved: boolean | null;
  bridge_of_hope_name: string | null;
  bridge_of_hope_id: string | null;
}

interface EditingState {
  id: string | null;
  field: 'bridge_of_hope_name' | 'bridge_of_hope_id' | null;
  value: string;
}

export default function Missionaries() {
  const { user } = useAuth();
  const [pendingMissionaries, setPendingMissionaries] = useState<Missionary[]>([]);
  const [approvedMissionaries, setApprovedMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null, value: '' });
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
      // Load pending missionaries
      const { data: pendingData, error: pendingError } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_missionary', true)
        .is('approved', null)
        .order('created_at', { ascending: true });

      if (pendingError) throw pendingError;

      // Load approved missionaries
      const { data: approvedData, error: approvedError } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_missionary', true)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (approvedError) throw approvedError;

      setPendingMissionaries(pendingData || []);
      setApprovedMissionaries(approvedData || []);
      
      // Log missionaries
      console.log('\nPending missionaries:');
      (pendingData || []).forEach(missionary => {
        console.log(`- ${missionary.email} (Bridge of Hope: ${missionary.bridge_of_hope_name || 'Not provided'})`);
      });
      
      console.log('\nApproved missionaries:');
      (approvedData || []).forEach(missionary => {
        console.log(`- ${missionary.email} (Bridge of Hope: ${missionary.bridge_of_hope_name || 'Not provided'})`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load missionaries');
      console.error('Error loading missionaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (missionaryId: string, missionaryEmail: string) => {
    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({
          approved: true,
          approved_by: user?.id,
          approved_date_time: new Date().toISOString()
        })
        .eq('id', missionaryId);

      if (error) throw error;

      toast.success(`Missionary ${missionaryEmail} approved successfully`);
      loadMissionaries();
    } catch (error: any) {
      toast.error('Failed to approve missionary');
      console.error('Error approving missionary:', error);
    }
  };

  const handleReject = async (missionaryId: string, missionaryEmail: string) => {
    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({
          approved: false,
          approved_by: user?.id,
          approved_date_time: new Date().toISOString()
        })
        .eq('id', missionaryId);

      if (error) throw error;

      toast.success(`Missionary ${missionaryEmail} rejected`);
      loadMissionaries();
    } catch (error: any) {
      toast.error('Failed to reject missionary');
      console.error('Error rejecting missionary:', error);
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

  const startEditing = (id: string, field: 'bridge_of_hope_name' | 'bridge_of_hope_id', value: string | null) => {
    setEditing({ id, field, value: value || '' });
  };

  const cancelEditing = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  const validateBridgeOfHopeId = (value: string): boolean => {
    if (!value) return true; // Allow empty value
    if (!/^\d+$/.test(value)) {
      toast.error('Bridge of Hope ID must contain only numbers');
      return false;
    }
    if (value.length > 8) {
      toast.error('Bridge of Hope ID must be 8 digits or less');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!editing.id || !editing.field) return;

    // Validate Bridge of Hope ID if that's what we're editing
    if (editing.field === 'bridge_of_hope_id' && !validateBridgeOfHopeId(editing.value)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({ [editing.field]: editing.value || null })
        .eq('id', editing.id);

      if (error) throw error;

      toast.success('Updated successfully');
      loadMissionaries();
      cancelEditing();
    } catch (error: any) {
      toast.error('Failed to update');
      console.error('Error updating:', error);
    }
  };

  const renderEditableCell = (missionary: Missionary, field: 'bridge_of_hope_name' | 'bridge_of_hope_id') => {
    const isEditing = editing.id === missionary.id && editing.field === field;
    const value = missionary[field];
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={editing.value}
            onChange={(e) => setEditing({ ...editing, value: e.target.value })}
            className="block w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={`Enter ${field === 'bridge_of_hope_name' ? 'center name' : 'center ID'}`}
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
          onClick={() => startEditing(missionary.id, field, value)}
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

        {/* Pending Missionaries Section */}
        {pendingMissionaries.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 text-yellow-600">Pending Missionaries</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bridge of Hope Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Center ID
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
                    {pendingMissionaries.map((missionary) => (
                      <tr key={missionary.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {missionary.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderEditableCell(missionary, 'bridge_of_hope_name')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderEditableCell(missionary, 'bridge_of_hope_id')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(missionary.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(missionary.id, missionary.email)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(missionary.id, missionary.email)}
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

        {/* Approved Missionaries Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-green-600">Approved Missionaries</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bridge of Hope Center
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Center ID
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
                  {approvedMissionaries.map((missionary) => (
                    <tr key={missionary.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {missionary.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderEditableCell(missionary, 'bridge_of_hope_name')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderEditableCell(missionary, 'bridge_of_hope_id')}
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