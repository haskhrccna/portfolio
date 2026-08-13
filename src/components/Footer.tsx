import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackVisitor } from "@/utils/visitorTracking";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    const initializeVisitor = async () => {
      console.log("Initializing visitor tracking in Footer");

      await trackVisitor();

      try {
        console.log("Fetching visitor count from Supabase");
        const { count, error } = await supabase
          .from("visitors")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Error fetching visitor count:", error);
          throw error;
        }

        console.log("Successfully fetched visitor count:", count);
        setVisitorCount(count || 0);
      } catch (error) {
        console.error("Error in visitor count fetch:", error);
        setVisitorCount(0);
      }
    };

    initializeVisitor();
  }, []);

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-gold/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-4 text-center sm:grid-cols-3 sm:text-left">
          <div className="font-mono text-xs uppercase tracking-[0.16em] text-stone">
            © {new Date().getFullYear()} Hassan Adam
          </div>
          <div className="flex flex-col items-center text-sm text-stone">
            <div>
              Site Visitors: <span className="font-medium text-ivory">{visitorCount}</span>
            </div>
            <div className="mt-1 font-mono text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="text-sm text-stone sm:text-right">All Rights Reserved</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
