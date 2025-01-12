import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

// Create a custom logger
const loggerConfig = {
  apiKey: supabaseAnonKey,
  logLevel: 'debug',
  // Add custom debug function
  debug: (msg: string) => {
    console.log('Supabase Debug:', msg);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // Add logger configuration
  logger: loggerConfig,
});

// Add debug logs for monitoring
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (session) {
    console.log('Session user:', session.user?.email);
  }
});