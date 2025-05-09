// src/components/saas-value/benchmark-display.tsx
import type { BenchmarkComparisonOutput } from '@/ai/flows/benchmark-comparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scale, TrendingUp, AlertTriangleIcon, CheckCircle2, ShieldAlert, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const processAnalysisText = (text: string) => {
  let processedText = text
    .replace(/\n/g, '<br />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processedText = processedText.replace(/^#{2,3}\s*(.*?)(\r?\n|<br\s*\/?>)/gm, (match, p1) => {
      const headingLevel = match.startsWith('###') ? 'h4' : 'h3';
      return `<${headingLevel} class="text-lg font-semibold mt-4 mb-2 text-foreground/90">${p1.trim()}</${headingLevel}>`;
  });
  return processedText;
};


export default function BenchmarkDisplay({
  benchmarkAnalysis,
  strengthAreas,
  improvementAreas,
}: BenchmarkComparisonOutput) {
  const formattedBenchmarkAnalysis = processAnalysisText(benchmarkAnalysis);

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
          <h3 className="text-xl font-semibold mb-2 text-foreground">Overall Analysis:</h3>
          <div className="text-md leading-relaxed text-foreground/90 space-y-3" dangerouslySetInnerHTML={{ __html: formattedBenchmarkAnalysis }} />
        </div>

        {strengthAreas && strengthAreas.length > 0 && (
          <Alert variant="default" className="bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" />
               <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <span className="flex items-center cursor-help">
                      Key Strength Areas
                      <HelpCircle className="ml-1.5 h-4 w-4 text-green-700/70 dark:text-green-300/70" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm p-2 bg-popover text-popover-foreground shadow-md rounded-md">
                    <p>Areas where the company performs notably well compared to industry benchmarks or peers.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <span className="flex items-center cursor-help">
                      Potential Improvement Areas
                      <HelpCircle className="ml-1.5 h-4 w-4 text-amber-700/70 dark:text-amber-300/70" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm p-2 bg-popover text-popover-foreground shadow-md rounded-md">
                    <p>Areas where the company could improve relative to benchmarks, or potential risks highlighted by the analysis.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
