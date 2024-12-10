import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { VisitorsTable } from "@/components/admin/VisitorsTable";
import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate("/login");
        return;
      }
      
      console.log("User found, checking admin status...");
      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      console.log("Admin check result:", { isAdmin, error });
      
      if (error || !isAdmin) {
        console.error("Error or not admin:", error);
        toast.error("Unauthorized access");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch visitor data
  const { data: visitorData } = useQuery({
    queryKey: ["visitor-data"],
    queryFn: async () => {
      console.log("Fetching visitor data...");
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching visitor data:", error);
        throw error;
      }
      
      console.log("Visitor data:", data);
      return data;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCountrySelect = (country: string) => {
    console.log('Country selected:', country);
    setSelectedCountry(country);
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

        <div className="grid gap-8">
          <AdminSettings />
          <VisitorsChart 
            visitors={visitorData || []} 
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
          />
          <VisitorsTable 
            visitors={visitorData || []} 
            selectedCountry={selectedCountry}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;