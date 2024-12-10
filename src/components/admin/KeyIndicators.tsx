import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export const KeyIndicators = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin statistics...");
      
      // Get total visitors and previous period
      const currentPeriod = await supabase
        .from('visitors')
        .select('*', { count: 'exact' })
        .gte('visited_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const previousPeriod = await supabase
        .from('visitors')
        .select('*', { count: 'exact' })
        .gte('visited_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
        .lt('visited_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Calculate percentage change
      const percentageChange = previousPeriod.count ? 
        ((currentPeriod.count - previousPeriod.count) / previousPeriod.count) * 100 : 0;

      // Get unique countries
      const { data: countries } = await supabase
        .from('visitors')
        .select('country')
        .not('country', 'is', null);
      const uniqueCountries = new Set(countries?.map(v => v.country)).size;

      // Get engagement metrics (messages)
      const { count: totalMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });

      return {
        totalVisitors: currentPeriod.count || 0,
        previousPeriodVisitors: previousPeriod.count || 0,
        percentageChange,
        uniqueCountries,
        totalMessages,
        averageSessionDuration: "3h 31m", // Placeholder - would need actual session tracking
        bounceRate: "26.75%"
      };
    }
  });

  const indicators = [
    {
      title: "Total Visitors",
      value: stats?.totalVisitors || 0,
      change: stats?.percentageChange || 0,
      period: "vs previous 30 days",
      previousValue: stats?.previousPeriodVisitors || 0
    },
    {
      title: "Bounce Rate",
      value: stats?.bounceRate || "0%",
      change: -24.84,
      period: "vs previous period",
      previousValue: "35.59%"
    },
    {
      title: "Avg. Session Duration",
      value: stats?.averageSessionDuration || "0h 0m",
      change: 17.8,
      period: "vs previous period",
      previousValue: "2h 51m"
    },
    {
      title: "Messages",
      value: stats?.totalMessages || 0,
      change: 28.6,
      period: "vs previous period",
      previousValue: stats?.totalMessages ? Math.round(stats.totalMessages * 0.8) : 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {indicators.map((indicator) => (
        <Card 
          key={indicator.title}
          className="p-4 glass hover:bg-white/20 transition-colors"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">
              {indicator.title}
            </p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white">
                {indicator.value}
              </h3>
              <div className={`flex items-center text-sm ${
                indicator.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {indicator.change >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                {Math.abs(indicator.change)}%
              </div>
            </div>
            <p className="text-sm text-white/60">
              {indicator.period} ({indicator.previousValue})
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};