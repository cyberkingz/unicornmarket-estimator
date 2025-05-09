// src/components/saas-value/benchmark-display.tsx
import type { BenchmarkComparisonOutput } from '@/ai/flows/benchmark-comparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scale, TrendingUp, AlertTriangleIcon, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BenchmarkDisplay({
  benchmarkAnalysis,
  strengthAreas,
  improvementAreas,
}: BenchmarkComparisonOutput) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Scale className="mr-2 h-7 w-7 text-accent" />
          Competitive Benchmark Insights
        </CardTitle>
        <CardDescription>How your company stacks up against industry benchmarks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground/90">Overall Analysis:</h3>
          <p className="text-md leading-relaxed text-foreground/90 whitespace-pre-line">{benchmarkAnalysis}</p>
        </div>

        {strengthAreas && strengthAreas.length > 0 && (
          <Alert variant="default" className="bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" />
              Key Strength Areas
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400/90">
              <ul className="list-none space-y-2 pl-0 mt-2">
                {strengthAreas.map((strength, index) => (
                  <li key={`strength-${index}`} className="flex items-start text-md">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 dark:text-green-400 shrink-0 mt-1" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {improvementAreas && improvementAreas.length > 0 && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700 text-amber-700 dark:text-amber-300">
             <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-lg font-semibold text-amber-700 dark:text-amber-300 flex items-center">
              <AlertTriangleIcon className="mr-2 h-6 w-6" />
              Potential Improvement Areas
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400/90">
              <ul className="list-none space-y-2 pl-0 mt-2">
                {improvementAreas.map((improvement, index) => (
                  <li key={`improvement-${index}`} className="flex items-start text-md">
                    <AlertTriangleIcon className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-1" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
