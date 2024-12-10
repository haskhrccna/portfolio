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

  // Filter visitor data and sort by date
  const filteredVisitors = visitors?.filter(visitor => {
    const matchesCountry = visitor.country === selectedCountry;
    const matchesDate = !dateFilter || 
      format(new Date(visitor.visited_at), 'yyyy-MM-dd') === dateFilter;
    return matchesCountry && matchesDate;
  }).sort((a, b) => {
    return new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="w-48">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
              disabled={!selectedCountry}
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
              {selectedCountry ? (
                filteredVisitors?.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      {visitor.visited_at ? format(new Date(visitor.visited_at), 'PPpp') : 'N/A'}
                    </TableCell>
                    <TableCell>{visitor.country || 'Unknown'}</TableCell>
                    <TableCell>{visitor.city || 'Unknown'}</TableCell>
                    <TableCell>{visitor.ip_address || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Click on a country in the chart above to view visitor details
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};