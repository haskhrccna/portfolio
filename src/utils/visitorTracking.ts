import { supabase } from "@/integrations/supabase/client";

export const trackVisitor = async () => {
  try {
    console.log("Tracking visitor for page:", window.location.pathname);

    // Insert visitor data with minimal info if location API fails
    const { data: visitorData, error } = await supabase
      .from('visitors')
      .insert([
        {
          page_url: window.location.pathname,
          visited_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error while tracking visitor:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log("Successfully tracked visitor:", visitorData);
    return visitorData;
  } catch (error: any) {
    console.error("Error tracking visitor:", error);
    console.error("Full error object:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};

// Helper function to get total visitor count
export const getVisitorCount = async () => {
  try {
    console.log("Fetching visitor count");

    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("Error fetching visitor count:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log("Total visitors:", count);
    return count || 0;
  } catch (error: any) {
    console.error("Error getting visitor count:", error);
    console.error("Full error object:", {
      name: error?.name,
      message: error?.message
    });
    return 0;
  }
};