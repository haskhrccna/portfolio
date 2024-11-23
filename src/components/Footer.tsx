import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { trackVisitor } from '@/utils/visitorTracking';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    const initializeVisitor = async () => {
      console.log('Initializing visitor tracking in Footer');
      
      // Track the visit
      await trackVisitor();

      // Get total visitor count based on visitor_number sequence
      try {
        console.log('Fetching visitor count from Supabase');
        const { data, error } = await supabase
          .from('visitors')
          .select('visitor_number')
          .order('visitor_number', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching visitor count:', error);
          throw error;
        }
        
        if (data) {
          console.log('Successfully fetched visitor count:', data.visitor_number);
          setVisitorCount(data.visitor_number);
        }
      } catch (error) {
        console.error('Error in visitor count fetch:', error);
      }
    };

    initializeVisitor();
  }, []);

  return (
    <footer className="w-full py-6 mt-auto glass">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center">
          <div className="text-white/80 text-sm">
            © {new Date().getFullYear()} Hassan Adam
          </div>
          <div className="flex flex-col items-center text-white/80 text-sm">
            <div>
              Site Visitors: <span className="font-bold text-white">{visitorCount}</span>
            </div>
            <div className="text-xs mt-1">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="text-white/80 text-sm text-right">
            All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;