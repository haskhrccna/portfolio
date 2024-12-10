import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { format } from "date-fns";
import { AdminSettings } from "@/components/admin/AdminSettings";

const Admin = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

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

  // Get unique countries for filter
  const uniqueCountries = [...new Set(visitorData?.map(visitor => visitor.country || 'Unknown'))];

  // Filter visitor data
  const filteredVisitorData = visitorData?.filter(visitor => {
    const matchesCountry = !selectedCountry || visitor.country === selectedCountry;
    const matchesDate = !dateFilter || 
      format(new Date(visitor.visited_at), 'yyyy-MM-dd') === dateFilter;
    return matchesCountry && matchesDate;
  });

  const chartData = visitorData?.reduce((acc: any, visitor) => {
    const country = visitor.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const formattedChartData = chartData
    ? Object.entries(chartData).map(([country, count]) => ({
        country,
        visitors: count,
      }))
    : [];

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

        <div className="grid gap-8">
          <AdminSettings />

          <Card>
            <CardHeader>
              <CardTitle>Visitors by Country</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="w-48">
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      {uniqueCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisitorData?.map((visitor) => (
                      <TableRow key={visitor.id}>
                        <TableCell>
                          {visitor.visited_at ? format(new Date(visitor.visited_at), 'PPpp') : 'N/A'}
                        </TableCell>
                        <TableCell>{visitor.country || 'Unknown'}</TableCell>
                        <TableCell>{visitor.city || 'Unknown'}</TableCell>
                        <TableCell>{visitor.ip_address || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;