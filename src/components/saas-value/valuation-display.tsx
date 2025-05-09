import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, TrendingUp, TrendingDown, Zap } from 'lucide-react';

type ValuationDisplayProps = {
  lowValuation: number;
  highValuation: number;
  averageValuation: number;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ValuationDisplay({
  lowValuation,
  highValuation,
  averageValuation,
}: ValuationDisplayProps) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center">
          <BarChart className="mr-2 h-7 w-7 text-accent" />
          Estimated Valuation Range
        </CardTitle>
        <CardDescription>Based on the provided metrics, here's the estimated valuation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Card className="bg-secondary/10 p-6 rounded-lg shadow">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground flex items-center justify-center">
                <TrendingDown className="mr-2 h-5 w-5" />
                Low Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-foreground">{formatCurrency(lowValuation)}</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 p-6 rounded-lg shadow-xl border-2 border-accent transform scale-105 md:scale-110 z-10">
            <CardHeader className="p-0 pb-2">
               <CardTitle className="text-lg font-medium text-accent flex items-center justify-center">
                <Zap className="mr-2 h-5 w-5" />
                Average Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-4xl font-extrabold text-accent">{formatCurrency(averageValuation)}</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 p-6 rounded-lg shadow">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg font-medium text-muted-foreground flex items-center justify-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                High Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-foreground">{formatCurrency(highValuation)}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
