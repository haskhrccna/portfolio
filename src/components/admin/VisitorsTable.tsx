import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export const VisitorsTable = ({ visitors }: VisitorsTableProps) => {
  // Process visitors data to group by country
  const countryData = visitors.reduce((acc: { 
    [key: string]: {
      count: number;
      ipAddresses: Set<string>;
    }
  }, visitor) => {
    if (visitor.country) {
      if (!acc[visitor.country]) {
        acc[visitor.country] = {
          count: 0,
          ipAddresses: new Set()
        };
      }
      acc[visitor.country].count += 1;
      if (visitor.ip_address) {
        acc[visitor.country].ipAddresses.add(visitor.ip_address);
      }
    }
    return acc;
  }, {});

  // Convert to array format for table
  const tableData = Object.entries(countryData)
    .map(([country, data]) => ({
      country,
      visits: data.count,
      ipAddresses: Array.from(data.ipAddresses).join(', ')
    }))
    .sort((a, b) => b.visits - a.visits);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Visitors by Country</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-white/20">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="text-white">Country</TableHead>
                <TableHead className="text-white text-right">Visits</TableHead>
                <TableHead className="text-white">IP Addresses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.country} className="border-white/20">
                  <TableCell className="text-white">{row.country}</TableCell>
                  <TableCell className="text-white text-right">{row.visits}</TableCell>
                  <TableCell className="text-white font-mono text-sm">
                    {row.ipAddresses || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
              {tableData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-white/60">
                    No visitor data available
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