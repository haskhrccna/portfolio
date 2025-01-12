import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

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
});

// Add a request interceptor to log requests
supabase.rest.interceptors.request.use((config) => {
  console.log('Making Supabase request:', config);
  return config;
});

// Add a response interceptor to log responses
supabase.rest.interceptors.response.use(
  (response) => {
    console.log('Received Supabase response:', response);
    return response;
  },
  (error) => {
    console.error('Supabase request failed:', error);
    return Promise.reject(error);
  }
);