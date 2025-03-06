import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

// Debug the environment variables
console.log('Supabase Configuration:');
console.log('- URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('- API Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  }
);

// Debug helper to log request headers
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  if (session) {
    console.log('Session token present:', !!session.access_token);
  }
});