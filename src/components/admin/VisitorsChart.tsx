import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Visitor {
  country: string | null;
}

interface VisitorsChartProps {
  visitors: Visitor[];
  onCountrySelect: (country: string) => void;
  selectedCountry: string | null;
}

export const VisitorsChart = ({ visitors, onCountrySelect, selectedCountry }: VisitorsChartProps) => {
  // Count visitors by country
  const chartData = visitors?.reduce((acc: { [key: string]: { total: number; successful: number } }, visitor) => {
    const country = visitor.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = { total: 0, successful: 0 };
    }
    acc[country].total += 1;
    acc[country].successful += 1; // For demonstration, all visits are considered successful
    return acc;
  }, {});

  // Format data for the chart and sort by number of visitors
  const formattedChartData = chartData
    ? Object.entries(chartData)
        .map(([country, data]) => ({
          country,
          successful: data.successful,
          failed: data.total - data.successful,
          fill: country === selectedCountry ? '#6b46c1' : '#8884d8',
        }))
        .sort((a, b) => b.successful - a.successful)
    : [];

  const handleBarClick = (data: any) => {
    console.log('Bar clicked:', data.payload.country);
    onCountrySelect(data.payload.country);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visits</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded-full mr-1" />
            <span className="text-sm">Successful</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1" />
            <span className="text-sm">Failed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedChartData} barGap={0}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="country"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar 
              dataKey="successful" 
              fill="#7c3aed"
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              cursor="pointer"
              maxBarSize={50}
            />
            <Bar 
              dataKey="failed" 
              fill="#f87171"
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              cursor="pointer"
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};