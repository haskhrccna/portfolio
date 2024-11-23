import { supabase } from "@/integrations/supabase/client";

export const trackVisitor = async () => {
  try {
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

    if (error) throw error;
    return visitorData;
  } catch (error) {
    console.error("Error tracking visitor:", error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};