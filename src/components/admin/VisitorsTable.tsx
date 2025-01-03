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
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 20, right: 20, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis 
                dataKey="country"
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: 'rgba(255,255,255,0.9)' }}
                angle={0}
                textAnchor="middle"
                height={60}
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