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
      throw error;
    }
    
    console.log("Successfully tracked visitor:", visitorData);
    return visitorData;
  } catch (error) {
    console.error("Error tracking visitor:", error);
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
      throw error;
    }

    console.log("Total visitors:", count);
    return count;
  } catch (error) {
    console.error("Error getting visitor count:", error);
    return 0;
  }
};