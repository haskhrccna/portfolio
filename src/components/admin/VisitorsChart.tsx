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
  const chartData = visitors?.reduce((acc: any, visitor) => {
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

  return (
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
  );
};