import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { VisitorsTable } from "@/components/admin/VisitorsTable";
import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { KeyIndicators } from "@/components/admin/KeyIndicators";
import { toast } from "sonner";
import { useState } from "react";

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
      
      return data;
    }
  });

  const handleLogout = async () => {
    console.log("Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
      return;
    }
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleCountrySelect = (country: string) => {
    console.log('Country selected:', country);
    setSelectedCountry(country);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A1F] via-[#7B3FE4] to-[#4A1D96]">
      <div className="container mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Logout
            </Button>
          </div>

          {/* Key Indicators */}
          <section className="space-y-4">
            <KeyIndicators />
          </section>

          {/* Charts Section */}
          <div className="grid gap-8 md:grid-cols-2">
            <section className="col-span-2">
              <VisitorsChart 
                visitors={visitorData || []} 
                onCountrySelect={setSelectedCountry}
                selectedCountry={selectedCountry}
              />
            </section>
            
            <section className="col-span-2">
              <VisitorsTable 
                visitors={visitorData || []} 
                selectedCountry={selectedCountry}
              />
            </section>
          </div>

          {/* Settings Section */}
          <section className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
            <AdminSettings />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;