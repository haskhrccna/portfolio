import { format } from "date-fns";
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
}

export const VisitorsTable = ({ visitors }: VisitorsTableProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Get unique countries for filter
  const uniqueCountries = [...new Set(visitors?.map(visitor => visitor.country || 'Unknown'))];

  // Filter visitor data
  const filteredVisitors = visitors?.filter(visitor => {
    const matchesCountry = selectedCountry === "all" || visitor.country === selectedCountry;
    const matchesDate = !dateFilter || 
      format(new Date(visitor.visited_at), 'yyyy-MM-dd') === dateFilter;
    return matchesCountry && matchesDate;
  });

  return (
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
                <SelectItem value="all">All Countries</SelectItem>
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
              {filteredVisitors?.map((visitor) => (
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
  );
};