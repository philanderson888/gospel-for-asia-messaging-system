import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

type UserRole = 'administrator' | 'missionary' | 'sponsor';

export default function Register() {
  const navigate = useNavigate();
  const { addKnownUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [sponsorId, setSponsorId] = useState('');
  const [childId, setChildId] = useState('');
  const [bridgeOfHopeName, setBridgeOfHopeName] = useState('');
  const [bridgeOfHopeId, setBridgeOfHopeId] = useState('');
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('\n===============');
      console.log('Register');
      console.log('===============\n');
      isFirstRender.current = false;
    }
  }, []);

  const validateSponsorFields = () => {
    if (selectedRole !== 'sponsor') return true;
    
    if (!sponsorId || !childId) {
      toast.error('Sponsor ID and Child ID are required for sponsors');
      return false;
    }

    if (!/^\d+$/.test(sponsorId)) {
      toast.error('Sponsor ID must contain only numbers');
      return false;
    }

    if (sponsorId.length > 8) {
      toast.error('Sponsor ID must be 8 digits or less');
      return false;
    }

    if (!/^\d+$/.test(childId)) {
      toast.error('Child ID must contain only numbers');
      return false;
    }

    if (childId.length > 10) {
      toast.error('Child ID must be 10 digits or less');
      return false;
    }

    return true;
  };

  const validateBridgeOfHopeId = () => {
    if (selectedRole !== 'missionary' || !bridgeOfHopeId) return true;

    if (!/^\d+$/.test(bridgeOfHopeId)) {
      toast.error('Bridge of Hope ID must contain only numbers');
      return false;
    }

    if (bridgeOfHopeId.length > 8) {
      toast.error('Bridge of Hope ID must be 8 digits or less');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Registration requested for:', email);
      console.log('Role requested:', selectedRole);

      if (!selectedRole) {
        throw new Error('Please select a role');
      }

      if (!validateSponsorFields() || !validateBridgeOfHopeId()) {
        setLoading(false);
        return;
      }

      // First sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error('User registration failed');
      }

      // Add the user to authenticated_users table
      const { error: insertError } = await supabase
        .from('authenticated_users')
        .insert([
          {
            id: signUpData.user.id,
            email: email,
            is_administrator: selectedRole === 'administrator',
            is_missionary: selectedRole === 'missionary',
            is_sponsor: selectedRole === 'sponsor',
            approved: null, // Needs admin approval
            approved_by: null,
            approved_date_time: null,
            sponsor_id: selectedRole === 'sponsor' ? sponsorId : null,
            child_id: selectedRole === 'sponsor' ? childId : null,
            bridge_of_hope_name: selectedRole === 'missionary' ? bridgeOfHopeName : null,
            bridge_of_hope_id: selectedRole === 'missionary' ? bridgeOfHopeId : null
          }
        ]);

      if (insertError) {
        console.error('Error adding to authenticated_users:', insertError);
        throw new Error('Failed to complete registration process');
      }

      // Add the newly registered user to known users
      addKnownUser(email);
      
      // Immediately sign out the user
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Error signing out:', signOutError);
      }

      setLoading(false);
      
      toast.success(
        selectedRole === 'administrator'
          ? 'Registration successful! Your administrator request is pending approval. Please sign in.'
          : 'Registration successful! Please sign in to continue.'
      );
      
      // Navigate to login page
      navigate('/login');
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="administrator"
                name="role"
                type="radio"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                checked={selectedRole === 'administrator'}
                onChange={() => setSelectedRole('administrator')}
              />
              <label htmlFor="administrator" className="ml-2 block text-sm text-gray-900">
                Request Administrator Access
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="missionary"
                name="role"
                type="radio"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                checked={selectedRole === 'missionary'}
                onChange={() => setSelectedRole('missionary')}
              />
              <label htmlFor="missionary" className="ml-2 block text-sm text-gray-900">
                Register as Missionary
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="sponsor"
                name="role"
                type="radio"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                checked={selectedRole === 'sponsor'}
                onChange={() => setSelectedRole('sponsor')}
              />
              <label htmlFor="sponsor" className="ml-2 block text-sm text-gray-900">
                Register as Sponsor
              </label>
            </div>
          </div>

          {/* Missionary-specific fields */}
          {selectedRole === 'missionary' && (
            <div className="space-y-4 mt-4">
              <div>
                <label htmlFor="bridge-of-hope-name" className="block text-sm font-medium text-gray-700">
                  Bridge of Hope Center Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="bridge-of-hope-name"
                    id="bridge-of-hope-name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter Bridge of Hope Center Name (optional)"
                    value={bridgeOfHopeName}
                    onChange={(e) => setBridgeOfHopeName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bridge-of-hope-id" className="block text-sm font-medium text-gray-700">
                  Bridge of Hope Center ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="bridge-of-hope-id"
                    id="bridge-of-hope-id"
                    pattern="[0-9]{1,8}"
                    maxLength={8}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter Bridge of Hope Center ID (optional)"
                    value={bridgeOfHopeId}
                    onChange={(e) => setBridgeOfHopeId(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Optional: Enter your Bridge of Hope Center ID (up to 8 digits)
                </p>
              </div>
            </div>
          )}

          {/* Sponsor-specific fields */}
          {selectedRole === 'sponsor' && (
            <div className="space-y-4 mt-4">
              <div>
                <label htmlFor="sponsor-id" className="block text-sm font-medium text-gray-700">
                  Sponsor ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sponsor-id"
                    id="sponsor-id"
                    required
                    pattern="[0-9]{1,8}"
                    maxLength={8}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your Sponsor ID (up to 8 digits)"
                    value={sponsorId}
                    onChange={(e) => setSponsorId(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Your Sponsor ID can be found in your sponsorship welcome letter (up to 8 digits)
                </p>
              </div>

              <div>
                <label htmlFor="child-id" className="block text-sm font-medium text-gray-700">
                  Child ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="child-id"
                    id="child-id"
                    required
                    pattern="[0-9]{1,10}"
                    maxLength={10}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your Child ID (up to 10 digits)"
                    value={childId}
                    onChange={(e) => setChildId(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  The Child ID can be found in your sponsorship welcome letter (up to 10 digits)
                </p>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                !selectedRole
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className={`h-5 w-5 ${!selectedRole ? 'text-gray-500' : 'text-indigo-500 group-hover:text-indigo-400'}`} />
              </span>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}