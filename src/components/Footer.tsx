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

      // Get total visitor count using count query
      try {
        console.log('Fetching visitor count from Supabase');
        const { count, error } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching visitor count:', error);
          throw error;
        }

        console.log('Successfully fetched visitor count:', count);
        setVisitorCount(count || 0);
      } catch (error) {
        console.error('Error in visitor count fetch:', error);
        setVisitorCount(0);
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