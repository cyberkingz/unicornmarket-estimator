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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  DollarSign, Percent, TrendingUp, TrendingDown, Users, Briefcase, Target, FileText, Cpu, ShoppingCart, Handshake, Building2, Landmark, Megaphone, PieChart, FactoryIcon, Library, LineChart, LandmarkIcon, TrendingUpIcon, TrendingDownIcon, BadgePercent, Info, Trash2, FileSignature, BarChart3, Route, Users2
} from 'lucide-react';

const formSchema = z.object({
  softwareName: z.string().min(1, {message: 'Software name is required.'}).max(100, {message: 'Software name must be 100 characters or less.'}).describe('The name of the SaaS software/company'),
  arr: z.coerce.number().positive({ message: 'ARR must be a positive number.' }).describe('Annual Recurring Revenue (USD)'),
  newBusinessARRGrowthRate: z.coerce.number().min(0, { message: 'New business ARR growth rate cannot be negative.' }).max(5, { message: 'Rate seems too high (max 500%). Use decimal, e.g., 0.2 for 20%.' }).describe('Annual growth rate from new business (e.g., 0.2 for 20%)'),
  expansionARRGrowthRate: z.coerce.number().min(-1, { message: 'Expansion ARR growth rate can be negative (contraction) but not less than -100%.' }).max(5, { message: 'Rate seems too high (max 500%). Use decimal, e.g., 0.1 for 10%.' }).describe('Annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%)'),
  churnRate: z.coerce.number().min(0, { message: 'Churn rate cannot be negative.' }).max(1, { message: 'Churn rate cannot exceed 100%. Use decimal, e.g., 0.05 for 5%.' }).describe('Annual churn rate (e.g., 0.05 for 5%)'),
  netRevenueRetention: z.coerce.number().min(0, { message: 'NRR cannot be negative.'}).max(3, {message: 'NRR seems too high (max 300%). Use decimal, e.g., 1.1 for 110%.'}).describe('Net Revenue Retention (NRR) as decimal (e.g., 1.1 for 110%)'),
  grossMargin: z.coerce.number().min(0, { message: 'Gross margin cannot be negative.' }).max(1, { message: 'Gross margin cannot exceed 100%. Use decimal, e.g., 0.8 for 80%.' }).describe('Gross margin (e.g., 0.8 for 80%)'),
  
  costOfGoodsSold: z.coerce.number().min(0, {message: 'COGS must be a non-negative number.'}).optional().describe('Annual Cost of Goods Sold (COGS) in USD. Includes hosting, support directly tied to service delivery.'),
  generalAdministrativeSpend: z.coerce.number().min(0, {message: 'G&A spend must be a non-negative number.'}).optional().describe('Annual General & Administrative (G&A) spend in USD (e.g., non-S&M/R&D salaries, rent, legal).'),
  ebitda: z.coerce.number().optional().describe('Annual Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) in USD. Can be negative.'),

  customerAcquisitionCost: z.coerce.number().positive({ message: 'CAC must be a positive number.' }).describe('Average Customer Acquisition Cost (CAC) in USD'),
  ltvToCacRatio: z.coerce.number().positive({ message: 'LTV/CAC ratio must be a positive number.' }).describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1)'),
  salesMarketingSpendPercentage: z.coerce.number().min(0, { message: 'S&M spend % cannot be negative.' }).max(1, { message: 'S&M spend % cannot exceed 100%. Use decimal, e.g., 0.4 for 40%.' }).describe('Sales & Marketing spend as % of ARR (e.g., 0.4 for 40%)'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0, { message: 'R&D spend % cannot be negative.' }).max(1, { message: 'R&D spend % cannot exceed 100%. Use decimal, e.g., 0.2 for 20%.' }).describe('Research & Development spend as % of ARR (e.g., 0.2 for 20%)'),

  customerAcquisitionChannels: z.string().max(500, {message: 'Must be 500 characters or less.'}).optional().describe('Main customer acquisition channels (e.g., Google Ads, SEO). List key channels and their approx. contribution if possible.'),
  marketingSpendBreakdown: z.string().max(500, {message: 'Must be 500 characters or less.'}).optional().describe('Optional: Breakdown of marketing spend across key channels or categories.'),

  fundingStage: z.string().max(50, {message: 'Must be 50 characters or less.'}).optional().describe('Current funding stage (e.g., Bootstrap, Seed, Series A)'),
  industryVertical: z.string().max(100, {message: 'Must be 100 characters or less.'}).optional().describe('Primary industry vertical (e.g., FinTech, HealthTech)'),
  targetMarket: z.string().max(100, {message: 'Must be 100 characters or less.'}).optional().describe('Primary target market segment (e.g., SMB, Mid-Market, Enterprise)'),
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
      costOfGoodsSold: 250000, 
      generalAdministrativeSpend: 150000, 
      ebitda: 0, 
      customerAcquisitionCost: 5000,
      ltvToCacRatio: 3.5,
      salesMarketingSpendPercentage: 0.40,
      researchDevelopmentSpendPercentage: 0.20,
      customerAcquisitionChannels: "SEO (40%), Content Marketing (30%), Google Ads (20%), Referrals (10%)",
      marketingSpendBreakdown: "Google Ads: $10k/month, SEO/Content: $5k/month, Social Media: $2k/month",
      fundingStage: 'Series A',
      industryVertical: 'General B2B SaaS',
      targetMarket: 'Mid-Market Companies',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as ValuationEstimationInput);
  }

  function handleClearForm() {
    form.reset({
      softwareName: '',
      arr: undefined,
      newBusinessARRGrowthRate: undefined,
      expansionARRGrowthRate: undefined,
      churnRate: undefined,
      netRevenueRetention: undefined,
      grossMargin: undefined,
      costOfGoodsSold: undefined,
      generalAdministrativeSpend: undefined,
      ebitda: undefined,
      customerAcquisitionCost: undefined,
      ltvToCacRatio: undefined,
      salesMarketingSpendPercentage: undefined,
      researchDevelopmentSpendPercentage: undefined,
      customerAcquisitionChannels: '',
      marketingSpendBreakdown: '',
      fundingStage: '',
      industryVertical: '',
      targetMarket: '',
    });
  }
  
  const accordionDefaultValues = ["item-1", "item-2"]; // Open first two accordions by default

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Company &amp; Financial Metrics</CardTitle>
        <CardDescription>Enter your SaaS company's details and key metrics to estimate its valuation. More details lead to a more refined analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Accordion type="multiple" defaultValue={accordionDefaultValues} className="w-full">
              {/* Section: Basic Information */}
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-medium hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <FileSignature className="h-6 w-6 text-primary" />
                    <span>Basic Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
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
                </AccordionContent>
              </AccordionItem>

              {/* Section: Core Financials & Growth */}
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-medium hover:no-underline">
                  <div className="flex items-center space-x-2">
                     <BarChart3 className="h-6 w-6 text-primary" />
                    <span>Core Financials &amp; Growth</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
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
                          <FormDescription>Total ARR in USD.</FormDescription>
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
                            <BadgePercent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="e.g., 0.8 for 80%" {...field} className="pl-10" aria-label="Gross Margin" />
                            </FormControl>
                          </div>
                          <FormDescription>Gross profit margin (decimal, e.g., 0.8 for 80%).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newBusinessARRGrowthRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">New Business ARR Growth Rate</FormLabel>
                          <div className="relative">
                            <TrendingUpIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="e.g., 0.2 for 20%" {...field} className="pl-10" aria-label="New Business ARR Growth Rate"/>
                            </FormControl>
                          </div>
                          <FormDescription>Annual growth from new customers (decimal).</FormDescription>
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
                    <FormField
                      control={form.control}
                      name="churnRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Annual Churn Rate</FormLabel>
                          <div className="relative">
                            <TrendingDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="e.g., 0.1 for 10%" {...field} className="pl-10" aria-label="Annual Churn Rate" />
                            </FormControl>
                          </div>
                          <FormDescription>Annual customer/revenue churn rate (decimal).</FormDescription>
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
                          <FormDescription>NRR or DBNER (decimal, e.g., 1.1 for 110%).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section: Operational Metrics */}
              <AccordionItem value="item-3">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <LineChart className="h-6 w-6 text-primary" />
                    <span>Operational &amp; Cost Metrics</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField
                      control={form.control}
                      name="costOfGoodsSold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Cost of Goods Sold (COGS) <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                          <div className="relative">
                            <FactoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" placeholder="e.g., 250000" {...field} className="pl-10" aria-label="Cost of Goods Sold" />
                            </FormControl>
                          </div>
                          <FormDescription>Annual COGS in USD (hosting, direct support etc.).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="generalAdministrativeSpend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">G&amp;A Spend <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                          <div className="relative">
                            <Library className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" placeholder="e.g., 150000" {...field} className="pl-10" aria-label="General & Administrative Spend" />
                            </FormControl>
                          </div>
                          <FormDescription>Annual G&A spend in USD (non-S&M/R&D salaries, rent, legal).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ebitda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">EBITDA <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                          <div className="relative">
                            <LineChart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="number" placeholder="e.g., 0 or -50000" {...field} className="pl-10" aria-label="EBITDA" />
                            </FormControl>
                          </div>
                          <FormDescription>Annual EBITDA in USD. Can be negative.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section: Customer Acquisition (Optional) */}
              <AccordionItem value="item-4">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <Route className="h-6 w-6 text-primary" />
                    <span>Customer Acquisition</span><span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField
                      control={form.control}
                      name="customerAcquisitionChannels"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-base">Main Customer Acquisition Channels</FormLabel>
                          <div className="relative">
                            <Megaphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Textarea placeholder="e.g., SEO (40%), Google Ads (30%), Content Marketing (20%), Referrals (10%)" {...field} className="pl-10 min-h-[80px]" aria-label="Main Customer Acquisition Channels" />
                            </FormControl>
                          </div>
                          <FormDescription>List key channels and their approximate contribution if known. Helps assess acquisition strategy.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marketingSpendBreakdown"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-base">Marketing Spend Breakdown</FormLabel>
                          <div className="relative">
                            <PieChart className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Textarea placeholder="e.g., Google Ads: $10k/month, Content Creation: $5k/month, SEO Agency: $3k/month" {...field} className="pl-10 min-h-[80px]" aria-label="Marketing Spend Breakdown" />
                            </FormControl>
                          </div>
                          <FormDescription>Optional breakdown of marketing spend by channel or category. Provides insight into spend efficiency.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section: Contextual Information */}
              <AccordionItem value="item-5">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <Info className="h-6 w-6 text-primary" />
                    <span>Contextual Information</span><span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField
                      control={form.control}
                      name="fundingStage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Funding Stage</FormLabel>
                          <div className="relative">
                            <LandmarkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input type="text" placeholder="e.g., Series A, Bootstrap" {...field} className="pl-10" aria-label="Funding Stage" />
                            </FormControl>
                          </div>
                          <FormDescription>Company's current funding stage.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industryVertical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Industry Vertical</FormLabel>
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
                        <FormItem className="md:col-span-2"> 
                          <FormLabel className="text-base">Target Market</FormLabel>
                          <div className="relative">
                            <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
