import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const KeyIndicators = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin statistics...");
      
      // Get total visitors
      const { count: totalVisitors } = await supabase
        .from('visitors')
        .select('*', { count: 'exact' });

      // Get unique countries
      const { data: countries } = await supabase
        .from('visitors')
        .select('country')
        .not('country', 'is', null);
      const uniqueCountries = new Set(countries?.map(v => v.country)).size;

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });

      // Get CV requests
      const { count: cvRequests } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .eq('request_cv', true);

      return {
        totalVisitors,
        uniqueCountries,
        totalMessages,
        cvRequests
      };
    }
  });

  const indicators = [
    {
      title: "Total Visitors",
      value: stats?.totalVisitors || 0,
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      textColor: "text-black"
    },
    {
      title: "Messages",
      value: stats?.totalMessages || 0,
      bgColor: "bg-red-50 dark:bg-red-950/30",
      textColor: "text-black"
    },
    {
      title: "Countries",
      value: stats?.uniqueCountries || 0,
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-black"
    },
    {
      title: "CV Requests",
      value: stats?.cvRequests || 0,
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-black"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {indicators.map((indicator) => (
        <Card 
          key={indicator.title}
          className={`p-4 ${indicator.bgColor} border-none`}
        >
          <h3 className="text-sm font-medium text-black">
            {indicator.title}
          </h3>
          <p className={`text-2xl font-bold mt-2 ${indicator.textColor}`}>
            {indicator.value}
          </p>
        </Card>
      ))}
    </div>
  );
};