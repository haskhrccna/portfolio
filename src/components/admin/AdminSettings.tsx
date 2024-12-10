import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVRequestSelector } from "./CVRequestSelector";

export const AdminSettings = () => {
  const [showCvRequest, setShowCvRequest] = useState(true);

  // Fetch admin settings
  const { data: adminSettings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      console.log("Fetching admin settings...");
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      setShowCvRequest(data.show_cv_request);
      return data;
    }
  });

  const handleCvRequestChange = async (value: string) => {
    const newValue = value === 'enabled';
    try {
      console.log("Updating CV request visibility to:", newValue);
      const { error } = await supabase
        .from('admin_settings')
        .update({ show_cv_request: newValue })
        .eq('id', 1);

      if (error) throw error;

      setShowCvRequest(newValue);
      toast.success("CV request visibility updated successfully");
    } catch (error) {
      console.error("Error updating CV request visibility:", error);
      toast.error("Failed to update CV request visibility");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CVRequestSelector
            value={showCvRequest ? 'enabled' : 'disabled'}
            onValueChange={handleCvRequestChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};