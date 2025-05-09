'use client';

import { useState } from 'react';
import type { ValuationEstimationInput, ValuationEstimationOutput } from '@/ai/flows/valuation-estimation';
import { valuationEstimation } from '@/ai/flows/valuation-estimation';
import DataInputForm from '@/components/saas-value/data-input-form';
import ValuationDisplay from '@/components/saas-value/valuation-display';
import AnalysisDisplay from '@/components/saas-value/analysis-display';
import { Header } from '@/components/saas-value/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';


export default function SaasValuePage() {
  const [valuationResult, setValuationResult] = useState<ValuationEstimationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: ValuationEstimationInput) => {
    setIsLoading(true);
    setValuationResult(null); // Clear previous results
    try {
      const result = await valuationEstimation(data);
      setValuationResult(result);
      toast({
        title: "Valuation Estimated",
        description: "Valuation analysis successfully completed.",
      });
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
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg rounded-xl">
               <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </CardContent>
            </Card>
          </div>
        )}

        {valuationResult && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            <ValuationDisplay
              lowValuation={valuationResult.lowValuation}
              highValuation={valuationResult.highValuation}
              averageValuation={valuationResult.averageValuation}
            />
            <AnalysisDisplay analysis={valuationResult.analysis} />
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
