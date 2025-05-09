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
import { 
  DollarSign, Percent, TrendingUp, TrendingDown, Trash2, Users, Briefcase, Target, FileText, Cpu, ShoppingCart, Handshake, Building2, Landmark
} from 'lucide-react';

const formSchema = z.object({
  softwareName: z.string().min(1, {message: 'Software name is required.'}).max(100, {message: 'Software name must be 100 characters or less.'}).describe('The name of the SaaS software/company'),
  arr: z.coerce.number().positive({ message: 'ARR must be a positive number.' }).describe('Annual Recurring Revenue (USD)'),
  newBusinessARRGrowthRate: z.coerce.number().min(0, { message: 'New business ARR growth rate cannot be negative.' }).max(5, { message: 'Rate seems too high (max 500%). Use decimal, e.g., 0.2 for 20%.' }).describe('Annual growth rate from new business (e.g., 0.2 for 20%)'),
  expansionARRGrowthRate: z.coerce.number().min(-1, { message: 'Expansion ARR growth rate can be negative (contraction) but not less than -100%.' }).max(5, { message: 'Rate seems too high (max 500%). Use decimal, e.g., 0.1 for 10%.' }).describe('Annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%)'),
  churnRate: z.coerce.number().min(0, { message: 'Churn rate cannot be negative.' }).max(1, { message: 'Churn rate cannot exceed 100%. Use decimal, e.g., 0.05 for 5%.' }).describe('Annual churn rate (e.g., 0.05 for 5%)'),
  netRevenueRetention: z.coerce.number().min(0, { message: 'NRR cannot be negative.'}).max(3, {message: 'NRR seems too high (max 300%). Use decimal, e.g., 1.1 for 110%.'}).describe('Net Revenue Retention (NRR) as decimal (e.g., 1.1 for 110%)'),
  grossMargin: z.coerce.number().min(0, { message: 'Gross margin cannot be negative.' }).max(1, { message: 'Gross margin cannot exceed 100%. Use decimal, e.g., 0.8 for 80%.' }).describe('Gross margin (e.g., 0.8 for 80%)'),
  customerAcquisitionCost: z.coerce.number().positive({ message: 'CAC must be a positive number.' }).describe('Average Customer Acquisition Cost (CAC) in USD'),
  ltvToCacRatio: z.coerce.number().positive({ message: 'LTV/CAC ratio must be a positive number.' }).describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1)'),
  salesMarketingSpendPercentage: z.coerce.number().min(0, { message: 'S&M spend % cannot be negative.' }).max(1, { message: 'S&M spend % cannot exceed 100%. Use decimal, e.g., 0.4 for 40%.' }).describe('Sales & Marketing spend as % of ARR (e.g., 0.4 for 40%)'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0, { message: 'R&D spend % cannot be negative.' }).max(1, { message: 'R&D spend % cannot exceed 100%. Use decimal, e.g., 0.2 for 20%.' }).describe('Research & Development spend as % of ARR (e.g., 0.2 for 20%)'),
  fundingStage: z.string().optional().describe('Current funding stage (e.g., Bootstrap, Seed, Series A)'),
  industryVertical: z.string().optional().describe('Primary industry vertical (e.g., FinTech, HealthTech)'),
  targetMarket: z.string().optional().describe('Primary target market segment (e.g., SMB, Mid-Market, Enterprise)'),
});

type DataInputFormProps = {
  onSubmit: (data: ValuationEstimationInput) => Promise<void>;
  isLoading: boolean;
};

export default function DataInputForm({ onSubmit, isLoading }: DataInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      softwareName: 'MySaaSApp',
      arr: 1000000,
      newBusinessARRGrowthRate: 0.20,
      expansionARRGrowthRate: 0.10,
      churnRate: 0.1,
      netRevenueRetention: 1.05,
      grossMargin: 0.75,
      customerAcquisitionCost: 5000,
      ltvToCacRatio: 3.5,
      salesMarketingSpendPercentage: 0.40,
      researchDevelopmentSpendPercentage: 0.20,
      fundingStage: 'Series A',
      industryVertical: 'General SaaS',
      targetMarket: 'Mid-Market',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as ValuationEstimationInput); // Cast is safe due to schema alignment
  }

  function handleClearForm() {
    form.reset();
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Company &amp; Financial Metrics</CardTitle>
        <CardDescription>Enter your SaaS company's details and key metrics to estimate its valuation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="softwareName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Software Name</FormLabel>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="text" placeholder="e.g., Acme SaaS Platform" {...field} className="pl-10" aria-label="Software Name" />
                    </FormControl>
                  </div>
                  <FormDescription>The name of your SaaS software or company.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Financial Metrics */}
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

              {/* Growth Metrics */}
              <FormField
                control={form.control}
                name="newBusinessARRGrowthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">New Business ARR Growth Rate</FormLabel>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 0.2 for 20%" {...field} className="pl-10" aria-label="New Business ARR Growth Rate"/>
                      </FormControl>
                    </div>
                    <FormDescription>Annual growth from new customers (decimal, e.g., 0.2 for 20%).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expansionARRGrowthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Expansion ARR Growth Rate</FormLabel>
                    <div className="relative">
                      <Handshake className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 0.1 for 10%" {...field} className="pl-10" aria-label="Expansion ARR Growth Rate"/>
                      </FormControl>
                    </div>
                    <FormDescription>Annual growth from existing customers (upsell/expansion, decimal).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Retention Metrics */}
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
                name="netRevenueRetention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Net Revenue Retention (NRR)</FormLabel>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 1.1 for 110%" {...field} className="pl-10" aria-label="Net Revenue Retention" />
                      </FormControl>
                    </div>
                    <FormDescription>NRR or DBNER as a decimal (e.g., 1.1 for 110%).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Unit Economics */}
               <FormField
                control={form.control}
                name="customerAcquisitionCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Customer Acquisition Cost (CAC)</FormLabel>
                    <div className="relative">
                      <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5000" {...field} className="pl-10" aria-label="Customer Acquisition Cost" />
                      </FormControl>
                    </div>
                    <FormDescription>Average CAC in USD.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ltvToCacRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">LTV to CAC Ratio</FormLabel>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 3.5" {...field} className="pl-10" aria-label="LTV to CAC Ratio" />
                      </FormControl>
                    </div>
                    <FormDescription>Customer Lifetime Value to CAC ratio (e.g., 3 for 3:1).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Spend Efficiency */}
              <FormField
                control={form.control}
                name="salesMarketingSpendPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Sales & Marketing Spend (% ARR)</FormLabel>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 0.4 for 40%" {...field} className="pl-10" aria-label="Sales & Marketing Spend Percentage" />
                      </FormControl>
                    </div>
                    <FormDescription>S&M spend as % of ARR (decimal).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="researchDevelopmentSpendPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">R&D Spend (% ARR)</FormLabel>
                    <div className="relative">
                      <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 0.2 for 20%" {...field} className="pl-10" aria-label="Research & Development Spend Percentage" />
                      </FormControl>
                    </div>
                    <FormDescription>R&D spend as % of ARR (decimal).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contextual Information */}
              <FormField
                control={form.control}
                name="fundingStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Funding Stage (Optional)</FormLabel>
                     <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="text" placeholder="e.g., Series A, Bootstrap" {...field} className="pl-10" aria-label="Funding Stage" />
                      </FormControl>
                    </div>
                    <FormDescription>Your company's current funding stage.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industryVertical"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Industry Vertical (Optional)</FormLabel>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="text" placeholder="e.g., FinTech, HealthTech" {...field} className="pl-10" aria-label="Industry Vertical" />
                      </FormControl>
                    </div>
                    <FormDescription>Primary industry your company operates in.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="targetMarket"
                render={({ field }) => (
                  <FormItem className="md:col-span-2"> {/* Make this span full width on medium screens if it's the last in a row */}
                    <FormLabel className="text-base">Target Market (Optional)</FormLabel>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="text" placeholder="e.g., SMB, Mid-Market, Enterprise" {...field} className="pl-10" aria-label="Target Market" />
                      </FormControl>
                    </div>
                    <FormDescription>Primary customer segment.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  'Estimate Valuation & Analyze Benchmarks'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
