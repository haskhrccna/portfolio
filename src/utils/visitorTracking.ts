import { supabase } from "@/integrations/supabase/client";

export const trackVisitor = async () => {
  try {
    // Get IP info using a free IP API
    const response = await fetch('https://api.ipapi.com/api/check?access_key=YOUR_API_KEY');
    const ipData = await response.json();

    const { data, error } = await supabase
      .from('visitors')
      .insert([
        {
          ip_address: ipData.ip,
          country: ipData.country_name,
          city: ipData.city,
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
    // If IP API fails, still track the visit without location data
    const { data, error: dbError } = await supabase
      .from('visitors')
      .insert([
        {
          page_url: window.location.pathname
        }
      ])
      .select();

    if (dbError) {
      console.error('Error tracking visitor:', dbError);
      return null;
    }

    return data;
  }
};