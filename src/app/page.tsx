// src/app/page.tsx
'use client';

import { useState, useRef } from 'react';
import type { ValuationEstimationInput, ValuationEstimationOutput } from '@/ai/flows/valuation-estimation';
import { valuationEstimation } from '@/ai/flows/valuation-estimation';
import type { BenchmarkComparisonInput, BenchmarkComparisonOutput } from '@/ai/flows/benchmark-comparison';
import { benchmarkComparison } from '@/ai/flows/benchmark-comparison';

import DataInputForm from '@/components/saas-value/data-input-form';
import ValuationDisplay from '@/components/saas-value/valuation-display';
import AnalysisDisplay from '@/components/saas-value/analysis-display';
import BenchmarkDisplay from '@/components/saas-value/benchmark-display';
import HistoricalARRChart from '@/components/saas-value/historical-arr-chart';
import { Header } from '@/components/saas-value/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangleIcon, TrendingUp, Download } from 'lucide-react';


export default function SaasValuePage() {
  const [valuationResult, setValuationResult] = useState<ValuationEstimationOutput | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkComparisonOutput | null>(null);
  const [inputDataForChart, setInputDataForChart] = useState<ValuationEstimationInput['historicalFinancials'] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const { toast } = useToast();

  const reportContentRef = useRef<HTMLDivElement>(null);


  const handleFormSubmit = async (data: ValuationEstimationInput) => {
    setIsLoading(true);
    setValuationResult(null);
    setBenchmarkResult(null); 
    setInputDataForChart(data.historicalFinancials);
    
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
          ...data, 
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

  const handleDownloadPdf = async () => {
    toast({
      title: "PDF Download (Coming Soon)",
      description: "This feature is under development. Libraries like jsPDF and html2canvas would be used here to generate the PDF.",
    });
    // Placeholder for PDF generation logic:
    //
    // To implement PDF generation, you would typically:
    // 1. Install necessary libraries:
    //    `npm install jspdf html2canvas`
    //    or `yarn add jspdf html2canvas`
    //
    // 2. Import them in this file:
    //    `import jsPDF from 'jspdf';`
    //    `import html2canvas from 'html2canvas';`
    //
    // 3. Implement the PDF generation logic within this function:
    //    - Check if `reportContentRef.current` (the div wrapping the report) exists.
    //    - Use `html2canvas` to capture the content of `reportContentRef.current` as an image (canvas).
    //      `const canvas = await html2canvas(reportContentRef.current, { scale: 2, useCORS: true });`
    //    - Convert the canvas to a data URL:
    //      `const imgData = canvas.toDataURL('image/png');`
    //    - Create a new jsPDF instance:
    //      `const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });`
    //    - Calculate image dimensions to fit the PDF page, maintaining aspect ratio:
    //      `const pdfWidth = pdf.internal.pageSize.getWidth();`
    //      `const pdfHeight = pdf.internal.pageSize.getHeight();`
    //      `const canvasWidth = canvas.width;`
    //      `const canvasHeight = canvas.height;`
    //      `const ratio = canvasWidth / canvasHeight;`
    //      `let imgWidth = pdfWidth - 40; // 20pt margin`
    //      `let imgHeight = imgWidth / ratio;`
    //      `if (imgHeight > pdfHeight - 40) { imgHeight = pdfHeight - 40; imgWidth = imgHeight * ratio; }`
    //      `const x = (pdfWidth - imgWidth) / 2;`
    //      `const y = 20;`
    //    - Add the image to the PDF:
    //      `pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);`
    //    - Handle multi-page PDFs if content is longer than one page. This might involve
    //      capturing sections of the report individually or a more complex scrolling capture.
    //    - Save the PDF:
    //      `pdf.save('SaaSValue-Report.pdf');`
    //    - Add loading states (e.g., `setIsGeneratingPdf(true/false)`) and error handling.
    //
    // Note: Styling for PDF output might need adjustments. `html2canvas` captures what's rendered
    // in the browser, but complex CSS (like flexbox/grid spanning multiple pages) can be tricky.
    // Consider a dedicated "print" stylesheet or simplifying layout for PDF generation if issues arise.
    console.log("Attempting to download PDF (placeholder)...");
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 antialiased">
      <Header />
      <main className="container mx-auto max-w-4xl mt-8 space-y-8 pb-16">
        <DataInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        
        <div ref={reportContentRef}> {/* This div wraps all content that should be in the PDF */}
          {isLoading && (
            <div className="space-y-8">
              {/* ValuationDisplay Skeleton */}
              <Card className="shadow-lg rounded-xl">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" data-ai-hint="text placeholder" />
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 border rounded-lg"><Skeleton className="h-6 w-1/2 mx-auto mb-2" data-ai-hint="label placeholder" /><Skeleton className="h-10 w-3/4 mx-auto" data-ai-hint="value placeholder" /></div>
                    <div className="p-4 border rounded-lg"><Skeleton className="h-6 w-1/2 mx-auto mb-2" data-ai-hint="label placeholder" /><Skeleton className="h-12 w-full mx-auto" data-ai-hint="value placeholder" /></div>
                    <div className="p-4 border rounded-lg"><Skeleton className="h-6 w-1/2 mx-auto mb-2" data-ai-hint="label placeholder" /><Skeleton className="h-10 w-3/4 mx-auto" data-ai-hint="value placeholder" /></div>
                  </div>
                  <div className="text-center">
                      <div className="inline-block p-4 rounded-lg shadow-sm max-w-xs mx-auto border border-border bg-card/50">
                          <div className="flex items-center justify-center mb-2">
                              <Skeleton className="h-5 w-5 mr-2" data-ai-hint="icon placeholder" />
                              <Skeleton className="h-6 w-3/4" data-ai-hint="label placeholder" />
                          </div>
                          <Skeleton className="h-10 w-1/2 mx-auto" data-ai-hint="value placeholder" />
                          <Skeleton className="h-3 w-1/3 mx-auto mt-1" data-ai-hint="description placeholder" />
                      </div>
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
                  <Skeleton className="h-6 w-full mt-2" data-ai-hint="paragraph line" />
                  <Skeleton className="h-6 w-3/4" data-ai-hint="paragraph line" />
                </CardContent>
              </Card>
              {/* Historical Chart Skeleton */}
              <Card className="shadow-lg rounded-xl mt-8">
                <CardHeader>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-muted-foreground/50" />
                    <Skeleton className="h-7 w-2/5" data-ai-hint="chart title" />
                  </div>
                  <Skeleton className="h-4 w-3/5 mt-1" data-ai-hint="chart description" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" data-ai-hint="chart placeholder" />
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
                impliedARRMultiple={valuationResult.impliedARRMultiple}
              />
              <AnalysisDisplay analysis={valuationResult.analysis} />
              {inputDataForChart && inputDataForChart.length > 0 && (
                <HistoricalARRChart historicalData={inputDataForChart} />
              )}
            </div>
          )}

          {/* Benchmark Skeletons: Shown when valuation is done, but benchmarking is in progress */}
          {!isLoading && valuationResult && isBenchmarking && (
            <Card className="shadow-lg rounded-xl mt-8">
              <CardHeader>
                  <div className="flex items-center">
                      <Skeleton className="h-7 w-7 mr-2" data-ai-hint="icon scale" />
                      <Skeleton className="h-8 w-3/5" data-ai-hint="title placeholder" />
                  </div>
                <Skeleton className="h-4 w-4/5 mt-1" data-ai-hint="description placeholder" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/3 mb-2" data-ai-hint="subheading placeholder" />
                  <Skeleton className="h-4 w-full" data-ai-hint="paragraph line" />
                  <Skeleton className="h-4 w-11/12 mt-1" data-ai-hint="paragraph line" />
                  <Skeleton className="h-4 w-full mt-1" data-ai-hint="paragraph line" />
                </div>
                  <Alert variant="default" className="bg-green-50/50 border-green-300/50 dark:bg-green-900/10 dark:border-green-700/30">
                      <Skeleton className="h-5 w-5 mr-2 absolute left-4 top-4" data-ai-hint="icon checkmark" />
                      <AlertTitle className="ml-7"><Skeleton className="h-6 w-2/5" data-ai-hint="alert title" /></AlertTitle>
                      <AlertDescription className="space-y-2 mt-2 ml-7">
                          <Skeleton className="h-4 w-full" data-ai-hint="list item" />
                          <Skeleton className="h-4 w-5/6" data-ai-hint="list item" />
                      </AlertDescription>
                  </Alert>
                  <Alert variant="destructive" className="bg-amber-50/50 border-amber-300/50 dark:bg-amber-900/10 dark:border-amber-700/30">
                      <Skeleton className="h-5 w-5 mr-2 absolute left-4 top-4" data-ai-hint="icon warning" />
                      <AlertTitle className="ml-7"><Skeleton className="h-6 w-2/5" data-ai-hint="alert title" /></AlertTitle>
                      <AlertDescription className="space-y-2 mt-2 ml-7">
                          <Skeleton className="h-4 w-full" data-ai-hint="list item" />
                          <Skeleton className="h-4 w-10/12" data-ai-hint="list item" />
                      </AlertDescription>
                  </Alert>
              </CardContent>
            </Card>
          )}

          {!isLoading && !isBenchmarking && benchmarkResult && (
            <div className="mt-8 animate-fadeIn">
              <BenchmarkDisplay {...benchmarkResult} />
            </div>
          )}
        </div> {/* End of reportContentRef div */}

        {!isLoading && !isBenchmarking && valuationResult && benchmarkResult && (
          <div className="mt-12 text-center">
            <Button 
              onClick={handleDownloadPdf} 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2"
              aria-label="Download Report as PDF"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Report PDF
            </Button>
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

    