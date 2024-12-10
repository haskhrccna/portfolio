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
  country: string | null;
}

interface VisitorsChartProps {
  visitors: Visitor[];
}

export const VisitorsChart = ({ visitors }: VisitorsChartProps) => {
  // Count visitors by country
  const chartData = visitors?.reduce((acc: { [key: string]: number }, visitor) => {
    const country = visitor.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Format data for the chart and sort by number of visitors
  const formattedChartData = chartData
    ? Object.entries(chartData)
        .map(([country, count]) => ({
          country,
          visitors: count,
        }))
        .sort((a, b) => b.visitors - a.visitors) // Sort by number of visitors in descending order
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors by Country</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis 
              allowDecimals={false}
              label={{ 
                value: 'Number of Visitors', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip />
            <Bar 
              dataKey="visitors" 
              fill="#8884d8"
              name="Visitors"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};