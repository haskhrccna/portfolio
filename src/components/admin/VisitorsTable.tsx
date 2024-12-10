import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const [dateFilter, setDateFilter] = useState<string>("");

  // Process visitors data to count visitors per country
  const countryData = visitors.reduce((acc: { [key: string]: number }, visitor) => {
    if (visitor.country) {
      acc[visitor.country] = (acc[visitor.country] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to array format for recharts
  const chartData = Object.entries(countryData)
    .map(([country, count]) => ({
      country,
      visitors: count,
    }))
    .sort((a, b) => b.visitors - a.visitors);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Visitors by Country</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="w-48">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white/10 text-white border-white/20"
            />
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis 
                dataKey="country"
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: 'rgba(255,255,255,0.9)' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: 'rgba(255,255,255,0.9)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 10, 31, 0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar 
                dataKey="visitors" 
                fill="#0EA5E9"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};