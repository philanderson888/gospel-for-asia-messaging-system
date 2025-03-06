import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  addKnownUser: (email: string) => void;
  knownUsers: string[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  addKnownUser: () => {},
  knownUsers: [],
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [knownUsers, setKnownUsers] = useState<string[]>([]);

  const addKnownUser = (email: string) => {
    setKnownUsers(prev => [...prev, email]);
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('administrators')
        .select('id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('Auth Provider mounted');
    let mounted = true;

    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const adminStatus = await checkAdminStatus(currentUser.id);
          if (mounted) {
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const adminStatus = await checkAdminStatus(currentUser.id);
        if (mounted) {
          setIsAdmin(adminStatus);
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    addKnownUser,
    knownUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}