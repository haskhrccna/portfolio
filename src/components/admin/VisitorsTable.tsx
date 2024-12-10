import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Visitor {
  id: string;
  visited_at: string;
  country: string | null;
  city: string | null;
  ip_address: string | null;
}

interface VisitorsTableProps {
  visitors: Visitor[];
  selectedCountry: string | null;
}

export const VisitorsTable = ({ visitors, selectedCountry }: VisitorsTableProps) => {
  const [dateFilter, setDateFilter] = useState<string>("");

  console.log('Selected country:', selectedCountry);
  console.log('Visitors data:', visitors);

  // Filter visitor data and sort by date with case-insensitive comparison
  const filteredVisitors = visitors?.filter(visitor => {
    const matchesCountry = selectedCountry && visitor.country && 
      visitor.country.toLowerCase() === selectedCountry.toLowerCase();
    const matchesDate = !dateFilter || 
      format(new Date(visitor.visited_at), 'yyyy-MM-dd') === dateFilter;
    
    return matchesCountry && matchesDate;
  }).sort((a, b) => {
    return new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime();
  });

  console.log('Filtered visitors:', filteredVisitors);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Visitor Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="w-48">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white/10 text-white border-white/20"
              disabled={!selectedCountry}
            />
          </div>
        </div>
        <div className="rounded-md border border-white/20">
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white/10 backdrop-blur-md">
                <TableRow>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Country</TableHead>
                  <TableHead className="text-white">City</TableHead>
                  <TableHead className="text-white">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white/5">
                {selectedCountry ? (
                  filteredVisitors?.map((visitor) => (
                    <TableRow key={visitor.id} className="hover:bg-white/10">
                      <TableCell className="text-white">
                        {visitor.visited_at ? format(new Date(visitor.visited_at), 'PPpp') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-white">{visitor.country || 'Unknown'}</TableCell>
                      <TableCell className="text-white">{visitor.city || 'Unknown'}</TableCell>
                      <TableCell className="text-white">{visitor.ip_address || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-white/60">
                      Click on a country in the chart above to view visitor details
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};