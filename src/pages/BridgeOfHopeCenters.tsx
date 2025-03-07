import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BridgeOfHopeCenter {
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

export default function BridgeOfHopeCenters() {
  const { user } = useAuth();
  const [pendingCenters, setPendingCenters] = useState<BridgeOfHopeCenter[]>([]);
  const [approvedCenters, setApprovedCenters] = useState<BridgeOfHopeCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null, value: '' });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('\n==================');
      console.log('Manage Bridge of Hope Centers');
      console.log('==================\n');
      loadCenters();
      isFirstRender.current = false;
    }
  }, []);

  const loadCenters = async () => {
    try {
      // Load pending centers
      const { data: pendingData, error: pendingError } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_bridge_of_hope', true)
        .is('approved', null)
        .order('created_at', { ascending: true });

      if (pendingError) throw pendingError;

      // Load approved centers
      const { data: approvedData, error: approvedError } = await supabase
        .from('authenticated_users')
        .select('*')
        .eq('is_bridge_of_hope', true)
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (approvedError) throw approvedError;

      setPendingCenters(pendingData || []);
      setApprovedCenters(approvedData || []);
      
      // Log centers
      console.log('\nPending centers:');
      (pendingData || []).forEach(center => {
        console.log(`- ${center.email} (${center.bridge_of_hope_name || 'No name'}, ID: ${center.bridge_of_hope_id || 'No ID'})`);
      });
      
      console.log('\nApproved centers:');
      (approvedData || []).forEach(center => {
        console.log(`- ${center.email} (${center.bridge_of_hope_name || 'No name'}, ID: ${center.bridge_of_hope_id || 'No ID'})`);
      });
      console.log(''); // Empty line for better readability
    } catch (error: any) {
      toast.error('Failed to load Bridge of Hope centers');
      console.error('Error loading centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (centerId: string, centerEmail: string) => {
    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({
          approved: true,
          approved_by: user?.id,
          approved_date_time: new Date().toISOString()
        })
        .eq('id', centerId);

      if (error) throw error;

      toast.success(`Bridge of Hope center ${centerEmail} approved successfully`);
      loadCenters();
    } catch (error: any) {
      toast.error('Failed to approve center');
      console.error('Error approving center:', error);
    }
  };

  const handleReject = async (centerId: string, centerEmail: string) => {
    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({
          approved: false,
          approved_by: user?.id,
          approved_date_time: new Date().toISOString()
        })
        .eq('id', centerId);

      if (error) throw error;

      toast.success(`Bridge of Hope center ${centerEmail} rejected`);
      loadCenters();
    } catch (error: any) {
      toast.error('Failed to reject center');
      console.error('Error rejecting center:', error);
    }
  };

  const handleRemoveCenter = async (centerId: string, centerEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${centerEmail} as a Bridge of Hope center?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('authenticated_users')
        .update({ is_bridge_of_hope: false })
        .eq('id', centerId);

      if (error) throw error;

      toast.success('Bridge of Hope center removed successfully');
      loadCenters();
    } catch (error: any) {
      toast.error('Failed to remove center');
      console.error('Error removing center:', error);
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
      loadCenters();
      cancelEditing();
    } catch (error: any) {
      toast.error('Failed to update');
      console.error('Error updating:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (editing.field === 'bridge_of_hope_id') {
      // Only allow numbers and limit to 8 digits
      const numbersOnly = value.replace(/[^\d]/g, '').slice(0, 8);
      setEditing({ ...editing, value: numbersOnly });
    } else {
      setEditing({ ...editing, value });
    }
  };

  const renderEditableCell = (center: BridgeOfHopeCenter, field: 'bridge_of_hope_name' | 'bridge_of_hope_id') => {
    const isEditing = editing.id === center.id && editing.field === field;
    const value = center[field];
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type={field === 'bridge_of_hope_id' ? 'text' : 'text'}
            value={editing.value}
            onChange={handleInputChange}
            maxLength={field === 'bridge_of_hope_id' ? 8 : undefined}
            pattern={field === 'bridge_of_hope_id' ? '[0-9]*' : undefined}
            inputMode={field === 'bridge_of_hope_id' ? 'numeric' : 'text'}
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
          onClick={() => startEditing(center.id, field, value)}
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

        {/* Pending Centers Section */}
        {pendingCenters.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 text-yellow-600">Pending Bridge of Hope Centers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Center Name
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
                    {pendingCenters.map((center) => (
                      <tr key={center.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {center.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderEditableCell(center, 'bridge_of_hope_name')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderEditableCell(center, 'bridge_of_hope_id')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(center.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(center.id, center.email)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(center.id, center.email)}
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

        {/* Approved Centers Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-green-600">Approved Bridge of Hope Centers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Center Name
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
                  {approvedCenters.map((center) => (
                    <tr key={center.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {center.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderEditableCell(center, 'bridge_of_hope_name')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderEditableCell(center, 'bridge_of_hope_id')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(center.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveCenter(center.id, center.email)}
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