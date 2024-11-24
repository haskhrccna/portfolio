import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      
      // Check if user is admin
      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      if (error || !isAdmin) {
        toast.error("Unauthorized access");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const { data: visitorStats } = useQuery({
    queryKey: ["visitor-statistics"],
    queryFn: async () => {
      console.log("Fetching visitor statistics...");
      const { data, error } = await supabase
        .from('visitor_statistics')
        .select('*')
        .order('visit_date', { ascending: false })
        .limit(30);
      
      if (error) {
        console.error("Error fetching visitor stats:", error);
        throw error;
      }
      
      console.log("Visitor statistics:", data);
      return data;
    }
  });

  const { data: contactStats } = useQuery({
    queryKey: ["contact-statistics"],
    queryFn: async () => {
      console.log("Fetching contact statistics...");
      const { data, error } = await supabase
        .from('contact_statistics')
        .select('*')
        .order('message_date', { ascending: false })
        .limit(30);
      
      if (error) {
        console.error("Error fetching contact stats:", error);
        throw error;
      }
      
      console.log("Contact statistics:", data);
      return data;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Statistics (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="visit_date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_visits" stroke="#8884d8" name="Total Visits" />
                  <Line type="monotone" dataKey="unique_visitors" stroke="#82ca9d" name="Unique Visitors" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Statistics (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contactStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="message_date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_messages" stroke="#8884d8" name="Total Messages" />
                  <Line type="monotone" dataKey="cv_requests" stroke="#82ca9d" name="CV Requests" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;