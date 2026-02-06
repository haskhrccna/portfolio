import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { VisitorsTable } from "@/components/admin/VisitorsTable";
import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { KeyIndicators } from "@/components/admin/KeyIndicators";
import { ContactMessages } from "@/components/admin/ContactMessages";
import { DataExport } from "@/components/admin/DataExport";
import { VisitorManagement } from "@/components/admin/VisitorManagement";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { PhotoGallery } from "@/components/admin/PhotoGallery";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { BackupRestore } from "@/components/admin/BackupRestore";
import { toast } from "sonner";
import { BarChart3, MessageSquare, Database, Users, Activity, Settings, Home, LogOut, Image, FolderOpen, Archive } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analytics");

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

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A1F] via-[#7B3FE4] to-[#4A1D96]">
      <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button
                onClick={goHome}
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Key Indicators - Always Visible */}
          <KeyIndicators />

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass w-full md:w-auto grid grid-cols-3 md:flex md:grid-cols-none gap-2">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-white/20">
                <Activity className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="visitors" className="data-[state=active]:bg-white/20">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Visitors</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-white/20">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-white/20">
                <FolderOpen className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:bg-white/20">
                <Image className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="backup" className="data-[state=active]:bg-white/20">
                <Archive className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Backup</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-white/20">
                <Database className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Export</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <VisitorsChart
                visitors={visitorData || []}
                onCountrySelect={setSelectedCountry}
                selectedCountry={selectedCountry}
              />
              <VisitorsTable
                visitors={visitorData || []}
                selectedCountry={selectedCountry}
              />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <ActivityLog />
            </TabsContent>

            {/* Visitors Tab */}
            <TabsContent value="visitors" className="space-y-6">
              <VisitorManagement />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <ContactMessages />
            </TabsContent>

            {/* Media Library Tab */}
            <TabsContent value="media" className="space-y-6">
              <MediaLibrary />
            </TabsContent>

            {/* Photo Gallery Tab */}
            <TabsContent value="photos" className="space-y-6">
              <PhotoGallery />
            </TabsContent>

            {/* Backup & Restore Tab */}
            <TabsContent value="backup" className="space-y-6">
              <BackupRestore />
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              <DataExport />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="glass p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Site Settings</h2>
                <AdminSettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
