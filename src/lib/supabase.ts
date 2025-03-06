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
      storage: localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce'
    }
  }
);

// Debug helper to log auth state changes and session info
supabase.auth.onAuthStateChange((event, session) => {
  console.log('\n=== Auth State Change ===');
  console.log('Event:', event);
  console.log('Session present:', !!session);
  if (session) {
    console.log('Access token present:', !!session.access_token);
    console.log('Token expiry:', new Date(session.expires_at! * 1000).toLocaleString());
    
    // Check if token needs refresh (if less than 5 minutes remaining)
    const expiresIn = session.expires_at! * 1000 - Date.now();
    if (expiresIn < 300000) { // 5 minutes in milliseconds
      console.log('Token expiring soon, will auto-refresh');
    }
  }
});

// Set up auto-refresh of session
setInterval(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const expiresAt = session.expires_at! * 1000; // convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    // If token expires in less than 5 minutes, refresh it
    if (timeUntilExpiry < 300000) { // 5 minutes in milliseconds
      console.log('Refreshing session token...');
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      } else {
        console.log('Session refreshed successfully');
      }
    }
  }
}, 60000); // Check every minute