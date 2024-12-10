import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays } from "date-fns";

interface Visitor {
  visited_at: string;
}

interface VisitorsChartProps {
  visitors: Visitor[];
  onCountrySelect: (country: string) => void;
  selectedCountry: string | null;
}

export const VisitorsChart = ({ visitors }: VisitorsChartProps) => {
  // Process data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayVisitors = visitors?.filter(v => 
      format(new Date(v.visited_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length || 0;
    
    return {
      date: format(date, 'MMM dd'),
      visitors: dayVisitors,
    };
  }).reverse();

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-white">
          <span>Sessions</span>
          <div className="text-sm font-normal">
            Last 30 days ({format(subDays(new Date(), 30), 'MMM dd')} - {format(new Date(), 'MMM dd')})
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last30Days}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B3FE4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7B3FE4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis 
                dataKey="date"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#7B3FE4"
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};