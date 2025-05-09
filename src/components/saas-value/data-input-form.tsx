// src/components/saas-value/data-input-form.tsx
'use client';

import type { ValuationEstimationInput } from '@/ai/flows/valuation-estimation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Percent, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

const formSchema = z.object({
  arr: z.coerce.number().positive({ message: 'ARR must be a positive number.' }).describe('Annual Recurring Revenue (USD)'),
  growthRate: z.coerce.number().min(0, { message: 'Growth rate cannot be negative.' }).max(5, { message: 'Growth rate seems too high (max 500%). Use decimal, e.g., 0.2 for 20%.' }).describe('Year-over-year growth rate (e.g., 0.2 for 20%)'),
  churnRate: z.coerce.number().min(0, { message: 'Churn rate cannot be negative.' }).max(1, { message: 'Churn rate cannot exceed 100%. Use decimal, e.g., 0.05 for 5%.' }).describe('Annual churn rate (e.g., 0.05 for 5%)'),
  grossMargin: z.coerce.number().min(0, { message: 'Gross margin cannot be negative.' }).max(1, { message: 'Gross margin cannot exceed 100%. Use decimal, e.g., 0.8 for 80%.' }).describe('Gross margin (e.g., 0.8 for 80%)'),
});

type DataInputFormProps = {
  onSubmit: (data: ValuationEstimationInput) => Promise<void>;
  isLoading: boolean;
};

export default function DataInputForm({ onSubmit, isLoading }: DataInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arr: 1000000,
      growthRate: 0.3,
      churnRate: 0.1,
      grossMargin: 0.75,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  function handleClearForm() {
    form.reset();
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Company Metrics</CardTitle>
        <CardDescription>Enter your SaaS company's key financial metrics to estimate its valuation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="arr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Annual Recurring Revenue (ARR)</FormLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000000" {...field} className="pl-10" aria-label="Annual Recurring Revenue" />
                    </FormControl>
                  </div>
                  <FormDescription>Your company's total ARR in USD.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="growthRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Year-over-Year Growth Rate</FormLabel>
                   <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.3 for 30%" {...field} className="pl-10" aria-label="Year-over-Year Growth Rate"/>
                    </FormControl>
                  </div>
                  <FormDescription>Annual growth rate as a decimal (e.g., 0.3 for 30%).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="churnRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Annual Churn Rate</FormLabel>
                  <div className="relative">
                    <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.1 for 10%" {...field} className="pl-10" aria-label="Annual Churn Rate" />
                    </FormControl>
                  </div>
                  <FormDescription>Annual customer/revenue churn rate as a decimal (e.g., 0.1 for 10%).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grossMargin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Gross Margin</FormLabel>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.8 for 80%" {...field} className="pl-10" aria-label="Gross Margin" />
                    </FormControl>
                  </div>
                  <FormDescription>Gross profit margin as a decimal (e.g., 0.8 for 80%).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearForm} 
                disabled={isLoading}
                className="w-full sm:w-auto text-base py-3 rounded-lg shadow-sm transition-transform hover:scale-[1.02] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Clear Form
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2 flex-grow"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Estimating...
                  </>
                ) : (
                  'Estimate Valuation'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
