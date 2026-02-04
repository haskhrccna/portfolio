import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Activity, Globe, Mail, Clock } from "lucide-react";

export const ActivityLog = () => {
  const { data: recentActivity, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      // Get recent visitors
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(10);

      if (visitorsError) throw visitorsError;

      // Get recent messages
      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesError) throw messagesError;

      // Combine and sort by time
      const combined: any[] = [
        ...(visitors || []).map(v => ({
          type: 'visitor',
          data: v,
          timestamp: new Date(v.visited_at)
        })),
        ...(messages || []).map(m => ({
          type: 'message',
          data: m,
          timestamp: new Date(m.created_at)
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return combined.slice(0, 15);
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-white text-center">
          Loading activity...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {!recentActivity || recentActivity.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No recent activity
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'visitor'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {activity.type === 'visitor' ? (
                        <Globe className="h-4 w-4" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {activity.type === 'visitor' ? (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-medium">New visitor</span>
                            <Badge variant="outline" className="bg-white/5 text-white/80 border-white/20">
                              {activity.data.country || 'Unknown'}
                            </Badge>
                          </div>
                          <p className="text-white/60 text-sm mt-1">
                            {activity.data.city && `${activity.data.city} • `}
                            {activity.data.page_url || '/'}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-white font-medium">New contact message</div>
                          <p className="text-white/80 text-sm mt-1">
                            From: {activity.data.name}
                          </p>
                          <p className="text-white/60 text-sm truncate">
                            {activity.data.message.substring(0, 80)}
                            {activity.data.message.length > 80 && '...'}
                          </p>
                        </>
                      )}
                      <div className="flex items-center gap-1 text-white/40 text-xs mt-2">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
