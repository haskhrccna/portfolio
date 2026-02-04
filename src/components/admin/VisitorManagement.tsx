import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, RefreshCw, Eye, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Visitor {
  id: string;
  visitor_number: number;
  page_url: string | null;
  country: string | null;
  city: string | null;
  ip_address: string | null;
  visited_at: string;
}

export const VisitorManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const { data: visitors, isLoading } = useQuery({
    queryKey: ["all-visitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as Visitor[];
    }
  });

  const deleteVisitorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('visitors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-visitors"] });
      queryClient.invalidateQueries({ queryKey: ["visitor-data"] });
      toast.success("Visitor record deleted");
    },
    onError: () => {
      toast.error("Failed to delete visitor record");
    }
  });

  const deleteOldVisitorsMutation = useMutation({
    mutationFn: async (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const { error } = await supabase
        .from('visitors')
        .delete()
        .lt('visited_at', date.toISOString());

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-visitors"] });
      queryClient.invalidateQueries({ queryKey: ["visitor-data"] });
      toast.success("Old visitor records deleted");
    },
    onError: () => {
      toast.error("Failed to delete old visitor records");
    }
  });

  const uniqueCountries = Array.from(
    new Set(visitors?.map(v => v.country).filter(Boolean))
  ).sort();

  const filteredVisitors = visitors?.filter(v => {
    const matchesSearch = !search ||
      v.country?.toLowerCase().includes(search.toLowerCase()) ||
      v.city?.toLowerCase().includes(search.toLowerCase()) ||
      v.ip_address?.includes(search) ||
      v.page_url?.toLowerCase().includes(search.toLowerCase());

    const matchesCountry = countryFilter === 'all' || v.country === countryFilter;

    return matchesSearch && matchesCountry;
  });

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-white text-center">
          Loading visitor data...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visitor Management ({filteredVisitors?.length || 0} visitors)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["all-visitors"] })}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cleanup
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass border-white/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Old Visitor Data</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/80 space-y-2">
                    <p>Choose how far back to keep visitor records:</p>
                    <div className="space-y-2 pt-2">
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                        onClick={() => deleteOldVisitorsMutation.mutate(90)}
                      >
                        Delete visitors older than 90 days
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                        onClick={() => deleteOldVisitorsMutation.mutate(180)}
                      >
                        Delete visitors older than 180 days
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                        onClick={() => deleteOldVisitorsMutation.mutate(365)}
                      >
                        Delete visitors older than 1 year
                      </Button>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search by country, city, IP, or page..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/10 text-white border-white/20 placeholder:text-white/40"
            />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="bg-white/10 text-white border-white/20">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="all" className="text-white">All Countries</SelectItem>
              {uniqueCountries.map(country => (
                <SelectItem key={country} value={country!} className="text-white">
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visitor List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {!filteredVisitors || filteredVisitors.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              No visitors found
            </div>
          ) : (
            filteredVisitors.map((visitor) => (
              <div
                key={visitor.id}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div>
                    <div className="text-white/60 text-xs">Visitor #</div>
                    <div className="text-white font-mono">{visitor.visitor_number}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Location
                    </div>
                    <div className="text-white">
                      {visitor.country || 'Unknown'}
                      {visitor.city && `, ${visitor.city}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">IP Address</div>
                    <div className="text-white font-mono text-sm">
                      {visitor.ip_address || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Visited At</div>
                    <div className="text-white text-sm">
                      {new Date(visitor.visited_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        onClick={() => setSelectedVisitor(visitor)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Visitor Details</DialogTitle>
                      </DialogHeader>
                      {selectedVisitor && (
                        <div className="space-y-3">
                          <div>
                            <div className="text-white/60 text-sm">Visitor Number</div>
                            <div className="text-white font-mono">{selectedVisitor.visitor_number}</div>
                          </div>
                          <div>
                            <div className="text-white/60 text-sm">Country</div>
                            <div className="text-white">{selectedVisitor.country || 'Unknown'}</div>
                          </div>
                          <div>
                            <div className="text-white/60 text-sm">City</div>
                            <div className="text-white">{selectedVisitor.city || 'Unknown'}</div>
                          </div>
                          <div>
                            <div className="text-white/60 text-sm">IP Address</div>
                            <div className="text-white font-mono">{selectedVisitor.ip_address || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-white/60 text-sm">Page URL</div>
                            <div className="text-white">{selectedVisitor.page_url || '/'}</div>
                          </div>
                          <div>
                            <div className="text-white/60 text-sm">Visited At</div>
                            <div className="text-white">{new Date(selectedVisitor.visited_at).toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-white/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete visitor record?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/80">
                          This will permanently delete this visitor record. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteVisitorMutation.mutate(visitor.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
