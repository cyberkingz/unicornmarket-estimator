// src/components/saas-value/benchmark-display.tsx
import type { BenchmarkComparisonOutput } from '@/ai/flows/benchmark-comparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-600 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" />
              Key Strength Areas:
            </h3>
            <ul className="list-none space-y-2 pl-0">
              {strengthAreas.map((strength, index) => (
                <li key={`strength-${index}`} className="flex items-start text-md text-foreground/80">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-1" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvementAreas && improvementAreas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-600 flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Potential Improvement Areas:
            </h3>
            <ul className="list-none space-y-2 pl-0">
              {improvementAreas.map((improvement, index) => (
                <li key={`improvement-${index}`} className="flex items-start text-md text-foreground/80">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500 shrink-0 mt-1" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
