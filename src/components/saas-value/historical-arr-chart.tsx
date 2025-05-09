// src/components/saas-value/historical-arr-chart.tsx
'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart'; // Assuming ChartConfig is exported from chart.tsx

type HistoricalFinancialItem = {
  year: number;
  arr?: number | null;
  revenue?: number | null;
  // other fields if needed for chart
};

type HistoricalARRChartProps = {
  historicalData: HistoricalFinancialItem[];
};

const formatCurrencyForAxis = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const arrValue = payload.find((p: any) => p.dataKey === 'arr')?.value;
    const revenueValue = payload.find((p: any) => p.dataKey === 'revenue')?.value;

    return (
      <div className="p-2 bg-background/80 border border-border rounded-md shadow-lg backdrop-blur-sm">
        <p className="font-semibold text-foreground">{`Year: ${label}`}</p>
        {arrValue !== undefined && (
          <p style={{ color: 'hsl(var(--chart-1))' }}>
            {`ARR: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0 }).format(arrValue)}`}
          </p>
        )}
         {revenueValue !== undefined && (
          <p style={{ color: 'hsl(var(--chart-2))' }}>
            {`Revenue: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0 }).format(revenueValue)}`}
          </p>
        )}
      </div>
    );
  }
  return null;
};


export default function HistoricalARRChart({ historicalData }: HistoricalARRChartProps) {
  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  const chartData = historicalData
    .filter(item => item.year && (item.arr !== undefined || item.revenue !== undefined) ) // Ensure year is present and at least one metric
    .sort((a, b) => a.year - b.year) // Sort by year
    .map(item => ({
      year: item.year.toString(), // XAxis expects string categories
      arr: item.arr ?? undefined, // Use undefined if null/undefined for recharts to skip point/bar
      revenue: item.revenue ?? undefined,
    }));

  if (chartData.length === 0) {
    return (
         <Card className="shadow-lg rounded-xl mt-8">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-accent" />
                Historical Financial Trends
                </CardTitle>
                <CardDescription>Visualizing year-over-year financial performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Not enough historical data provided to display a chart.</p>
            </CardContent>
        </Card>
    );
  }
  
  const chartConfig = {
    arr: {
      label: "ARR (USD)",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue (USD)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;


  return (
    <Card className="shadow-lg rounded-xl mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <TrendingUp className="mr-2 h-6 w-6 text-accent" />
          Historical Financial Trends
        </CardTitle>
        <CardDescription>Visualizing year-over-year financial performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
                dataKey="year" 
                stroke="hsl(var(--foreground))" 
                tickLine={false} 
                axisLine={false}
            />
            <YAxis 
                stroke="hsl(var(--foreground))" 
                tickFormatter={formatCurrencyForAxis}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            {chartData.some(d => d.arr !== undefined) && (
                <Bar dataKey="arr" fill={chartConfig.arr.color} name={chartConfig.arr.label} radius={[4, 4, 0, 0]} />
            )}
            {chartData.some(d => d.revenue !== undefined) && (
                <Bar dataKey="revenue" fill={chartConfig.revenue.color} name={chartConfig.revenue.label} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
