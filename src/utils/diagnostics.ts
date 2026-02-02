import { supabase } from "@/integrations/supabase/client";

/**
 * Diagnostic function to test Supabase connectivity and permissions
 * Run this in browser console: await window.testSupabaseConnection()
 */
export const testSupabaseConnection = async () => {
  console.log("=== SUPABASE DIAGNOSTICS ===");
  console.log("Starting comprehensive database tests...\n");

  // Test 1: Check if Supabase client is initialized
  console.log("1. Testing Supabase client initialization...");
  if (!supabase) {
    console.error("❌ Supabase client is not initialized!");
    return;
  }
  console.log("✅ Supabase client initialized\n");

  // Test 2: Try to SELECT from visitors table
  console.log("2. Testing SELECT permission on visitors table...");
  try {
    const { data, error, count } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("❌ SELECT failed with error:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log("✅ SELECT successful!");
      console.log(`Current visitor count: ${count}`);
    }
  } catch (err: any) {
    console.error("❌ Unexpected error during SELECT:", err);
  }
  console.log("");

  // Test 3: Try to INSERT into visitors table
  console.log("3. Testing INSERT permission on visitors table...");
  try {
    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          page_url: '/test-diagnostic',
          visited_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ INSERT failed with error:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      // Provide specific guidance based on error code
      if (error.code === '42501') {
        console.log("\n🔧 FIX: This is a Row Level Security (RLS) policy error.");
        console.log("You need to add RLS policies in Supabase:");
        console.log("1. Go to: https://supabase.com/dashboard/project/_/sql");
        console.log("2. Run the SQL commands in the SUPABASE_FIX.sql file");
      } else if (error.code === 'PGRST204') {
        console.log("\n🔧 FIX: Table might not exist or permissions are missing.");
      }
    } else {
      console.log("✅ INSERT successful!");
      console.log("Inserted visitor data:", data);
    }
  } catch (err: any) {
    console.error("❌ Unexpected error during INSERT:", err);
  }
  console.log("");

  // Test 4: Get final count
  console.log("4. Getting final visitor count...");
  try {
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("❌ Count query failed:", error);
    } else {
      console.log(`✅ Total visitors in database: ${count}`);
    }
  } catch (err: any) {
    console.error("❌ Error getting count:", err);
  }

  console.log("\n=== DIAGNOSTICS COMPLETE ===");
  console.log("If you see ❌ errors above, check SUPABASE_FIX.sql for solutions");
};

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testSupabaseConnection = testSupabaseConnection;
}
