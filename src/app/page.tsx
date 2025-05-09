// src/app/page.tsx
'use client';

import { useState } from 'react';
import type { ValuationEstimationInput, ValuationEstimationOutput } from '@/ai/flows/valuation-estimation';
import { valuationEstimation } from '@/ai/flows/valuation-estimation';
import type { BenchmarkComparisonInput, BenchmarkComparisonOutput } from '@/ai/flows/benchmark-comparison';
import { benchmarkComparison } from '@/ai/flows/benchmark-comparison';

import DataInputForm from '@/components/saas-value/data-input-form';
import ValuationDisplay from '@/components/saas-value/valuation-display';
import AnalysisDisplay from '@/components/saas-value/analysis-display';
import BenchmarkDisplay from '@/components/saas-value/benchmark-display';
import { Header } from '@/components/saas-value/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';


export default function SaasValuePage() {
  const [valuationResult, setValuationResult] = useState<ValuationEstimationOutput | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: ValuationEstimationInput) => {
    setIsLoading(true);
    setValuationResult(null);
    setBenchmarkResult(null); 
    
    try {
      // Valuation Estimation
      const valuationData = await valuationEstimation(data);
      setValuationResult(valuationData);
      toast({
        title: "Valuation Estimated",
        description: "Valuation analysis successfully completed.",
      });

      // Benchmark Comparison
      setIsBenchmarking(true);
      try {
        const benchmarkInput: BenchmarkComparisonInput = {
          arr: data.arr,
          growthRate: data.growthRate,
          churnRate: data.churnRate,
          grossMargin: data.grossMargin,
          estimatedAverageValuation: valuationData.averageValuation,
        };
        const benchmarkOut = await benchmarkComparison(benchmarkInput);
        setBenchmarkResult(benchmarkOut);
        toast({
          title: "Benchmark Analysis Complete",
          description: "Competitive benchmark insights generated.",
        });
      } catch (benchmarkError) {
        console.error("Error generating benchmark analysis:", benchmarkError);
        let benchmarkErrorMessage = "Failed to generate benchmark analysis. Valuation results are still available.";
        if (benchmarkError instanceof Error) {
          benchmarkErrorMessage = benchmarkError.message;
        }
        toast({
          variant: "destructive",
          title: "Benchmark Error",
          description: benchmarkErrorMessage,
        });
        setBenchmarkResult(null);
      } finally {
        setIsBenchmarking(false);
      }

    } catch (error) {
      console.error("Error estimating valuation:", error);
      let errorMessage = "Failed to estimate valuation. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Estimation Error",
        description: errorMessage,
      });
      setValuationResult(null);
      setBenchmarkResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 antialiased">
      <Header />
      <main className="container mx-auto max-w-4xl mt-8 space-y-8 pb-16">
        <DataInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        
        {isLoading && (
          <div className="space-y-8">
            {/* ValuationDisplay Skeleton */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" data-ai-hint="text placeholder" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg"><Skeleton className="h-6 w-1/2 mx-auto mb-2" data-ai-hint="label placeholder" /><Skeleton className="h-10 w-3/4 mx-auto" data-ai-hint="value placeholder" /></div>
                  <div className="p-4 border rounded-lg"><Skeleton className="h-6 w-1/2 mx-auto mb-2" data-ai-hint="label placeholder" /><Skeleton className="h-12 w-full mx-auto" data-ai-hint="value placeholder" /></div>
                  <div className="p-4 border rounded-lg"><Skeleton className="h-6 w-1/2 mx-auto mb-2" data-ai-hint="label placeholder" /><Skeleton className="h-10 w-3/4 mx-auto" data-ai-hint="value placeholder" /></div>
                </div>
                 <div className="text-center text-muted-foreground mt-4">
                  <Skeleton className="h-4 w-3/4 mx-auto" data-ai-hint="loading message" />
                  <Skeleton className="h-4 w-1/2 mx-auto mt-1" data-ai-hint="loading message" />
                </div>
              </CardContent>
            </Card>
            {/* AnalysisDisplay Skeleton */}
            <Card className="shadow-lg rounded-xl">
               <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-1" data-ai-hint="text placeholder" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" data-ai-hint="paragraph line" />
                <Skeleton className="h-6 w-full" data-ai-hint="paragraph line" />
                <Skeleton className="h-6 w-5/6" data-ai-hint="paragraph line" />
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && valuationResult && (
          <div className="space-y-8 animate-fadeIn">
            <ValuationDisplay
              lowValuation={valuationResult.lowValuation}
              highValuation={valuationResult.highValuation}
              averageValuation={valuationResult.averageValuation}
            />
            <AnalysisDisplay analysis={valuationResult.analysis} />
          </div>
        )}

        {/* Benchmark Skeletons: Shown when valuation is done, but benchmarking is in progress */}
        {!isLoading && valuationResult && isBenchmarking && (
           <Card className="shadow-lg rounded-xl mt-8">
             <CardHeader>
               <Skeleton className="h-8 w-3/5" data-ai-hint="title placeholder" />
               <Skeleton className="h-4 w-4/5 mt-1" data-ai-hint="description placeholder" />
             </CardHeader>
             <CardContent className="space-y-4">
               <Skeleton className="h-6 w-full" data-ai-hint="paragraph line" />
               <Skeleton className="h-6 w-11/12" data-ai-hint="paragraph line" />
               <Skeleton className="h-6 w-full mt-4" data-ai-hint="list item" />
               <Skeleton className="h-6 w-5/6" data-ai-hint="list item" />
               <Skeleton className="h-6 w-full mt-4" data-ai-hint="list item" />
               <Skeleton className="h-6 w-10/12" data-ai-hint="list item" />
             </CardContent>
           </Card>
        )}

        {!isLoading && !isBenchmarking && benchmarkResult && (
          <div className="mt-8 animate-fadeIn">
            <BenchmarkDisplay {...benchmarkResult} />
          </div>
        )}

      </main>
       <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
