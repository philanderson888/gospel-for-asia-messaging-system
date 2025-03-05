import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  knownUsers: string[];
  addKnownUser: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  knownUsers: [],
  addKnownUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [knownUsers, setKnownUsers] = useState<string[]>([]);

  const addKnownUser = (email: string) => {
    if (!knownUsers.includes(email)) {
      console.log('Adding known user:', email);
      setKnownUsers(prev => [...prev, email]);
    }
  };

  useEffect(() => {
    console.log('Auth Provider: Starting initialization');
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Auth Provider: Getting session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('Auth Provider: Component unmounted during session fetch');
          return;
        }

        if (error) {
          console.error('Auth Provider: Session error:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Auth Provider: Session retrieved', session ? 'with user' : 'no user');
        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser?.email) {
            addKnownUser(currentUser.email);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth Provider: Initialization error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Provider: Auth state changed:', event);
      
      if (!mounted) {
        console.log('Auth Provider: Component unmounted during auth change');
        return;
      }

      try {
        const currentUser = session?.user ?? null;
        console.log('Auth Provider: Updating user state:', currentUser?.email);
        setUser(currentUser);
        if (currentUser?.email) {
          addKnownUser(currentUser.email);
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth Provider: Error during auth state change:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      console.log('Auth Provider: Cleaning up');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    knownUsers,
    addKnownUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}