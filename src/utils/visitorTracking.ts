import { supabase } from "@/integrations/supabase/client";

export const trackVisitor = async () => {
  try {
    // Insert visitor record with minimal data to avoid API rate limits
    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          page_url: window.location.pathname
        }
      ])
      .select();

    if (error) {
      console.error('Error tracking visitor:', error);
      return null;
    }

    console.log('Visitor tracked successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in trackVisitor:', error);
    return null;
  }
};