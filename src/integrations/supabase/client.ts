// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ikxgwmujogucdamjgqkp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreGd3bXVqb2d1Y2RhbWpncWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDU4MTYsImV4cCI6MjA0NjQ4MTgxNn0.hJXmSuqUbL_aTB7FtuRZ3krWFKBAJtHyyqzxa9o3kyE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);