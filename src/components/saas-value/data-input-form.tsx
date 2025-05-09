// src/components/saas-value/data-input-form.tsx
'use client';

import type { ValuationEstimationInput } from '@/ai/flows/valuation-estimation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DollarSign, Percent, TrendingUp, TrendingDown, Users, Briefcase, Target, FileText, Cpu, ShoppingCart, Handshake, Building2, Landmark, Megaphone, PieChart, FactoryIcon, Library, LineChart, LandmarkIcon, TrendingUpIcon, TrendingDownIcon, BadgePercent, Info, Trash2, FileSignature, BarChart3, Route, Users2, UsersRound, CalendarClock, Tags, Settings2, Package, Gauge, AppWindow, CalendarDays, Banknote, History, PlusCircle, MinusCircle, Globe, HelpCircle
} from 'lucide-react';

const historicalFinancialItemSchema = z.object({
  year: z.coerce.number().int({ message: 'Year must be an integer.' }).min(1980, {message: "Year too far in past."}).max(new Date().getFullYear() + 5, {message: "Year too far in future."}),
  arr: z.coerce.number().min(0, {message: "ARR cannot be negative."}).optional(),
  revenue: z.coerce.number().min(0, {message: "Revenue cannot be negative."}).optional(),
  expenses: z.coerce.number().min(0, {message: "Expenses cannot be negative."}).optional(),
  netProfitOrLoss: z.coerce.number().optional(),
  customerCount: z.coerce.number().int().min(0, {message: "Customer count cannot be negative."}).optional(),
});

const formSchema = z.object({
  softwareName: z.string().min(1, {message: 'Software name is required.'}).max(100, {message: 'Software name must be 100 characters or less.'}).describe('The name of the SaaS software/company'),
  
  // Core Current Metrics
  arr: z.coerce.number().positive({ message: 'ARR must be a positive number.' }).describe('Current Annual Recurring Revenue (USD)'),
  newBusinessARRGrowthRate: z.coerce.number().min(0, { message: 'New business ARR growth rate cannot be negative.' }).max(5, { message: 'Rate seems too high (max 500%). Use decimal, e.g., 0.2 for 20%.' }).describe('Current annual growth rate from new business (e.g., 0.2 for 20%)'),
  expansionARRGrowthRate: z.coerce.number().min(-1, { message: 'Expansion ARR growth rate can be negative (contraction) but not less than -100%.' }).max(5, { message: 'Rate seems too high (max 500%). Use decimal, e.g., 0.1 for 10%.' }).describe('Current annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%)'),
  churnRate: z.coerce.number().min(0, { message: 'Churn rate cannot be negative.' }).max(1, { message: 'Churn rate cannot exceed 100%. Use decimal, e.g., 0.05 for 5%.' }).describe('Current annual churn rate (e.g., 0.05 for 5%)'),
  netRevenueRetention: z.coerce.number().min(0, { message: 'NRR cannot be negative.'}).max(3, {message: 'NRR seems too high (max 300%). Use decimal, e.g., 1.1 for 110%.'}).describe('Current Net Revenue Retention (NRR) as decimal (e.g., 1.1 for 110%)'),
  grossMargin: z.coerce.number().min(0, { message: 'Gross margin cannot be negative.' }).max(1, { message: 'Gross margin cannot exceed 100%. Use decimal, e.g., 0.8 for 80%.' }).describe('Current gross margin (e.g., 0.8 for 80%)'),

  // Historical Financial Data
  historicalFinancials: z.array(historicalFinancialItemSchema).max(5, {message: "Up to 5 years of historical data."}).optional().describe('Optional: Array of historical financial data for up to 5 previous years.'),

  // Detailed P&L / Operational Costs
  costOfGoodsSold: z.coerce.number().min(0, {message: 'COGS must be a non-negative number.'}).optional().describe('Optional: Annual Cost of Goods Sold (COGS) in USD.'),
  salesMarketingSpendPercentage: z.coerce.number().min(0, { message: 'S&M spend % cannot be negative.' }).max(1, { message: 'S&M spend % cannot exceed 100%. Use decimal, e.g., 0.4 for 40%.' }).describe('Current Sales & Marketing spend as % of ARR (e.g., 0.4 for 40%)'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0, { message: 'R&D spend % cannot be negative.' }).max(1, { message: 'R&D spend % cannot exceed 100%. Use decimal, e.g., 0.2 for 20%.' }).describe('Current Research & Development spend as % of ARR (e.g., 0.2 for 20%)'),
  generalAdministrativeSpendPercentage: z.coerce.number().min(0, { message: 'G&A spend % cannot be negative.' }).max(1, { message: 'G&A spend % cannot exceed 100%. Use decimal, e.g., 0.15 for 15%.' }).optional().describe('Optional: Current General & Administrative (G&A) spend as % of ARR (e.g., 0.15 for 15%).'),
  ebitda: z.coerce.number().optional().describe('Optional: Current Annual EBITDA in USD. Can be negative.'),

  // Customer Segmentation & Unit Economics
  totalCustomers: z.coerce.number().int({message: "Must be a whole number."}).positive({message: "Must be positive."}).optional().describe('Optional: Total number of active customers.'),
  customerAcquisitionCost: z.coerce.number().positive({ message: 'CAC must be a positive number.' }).describe('Average Customer Acquisition Cost (CAC) in USD'),
  ltvToCacRatio: z.coerce.number().positive({ message: 'LTV/CAC ratio must be a positive number.' }).describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1)'),
  cacByChannel: z.string().max(500, {message: "Must be 500 characters or less."}).optional().describe('Optional: Approximate CAC for key acquisition channels (e.g., "Google Ads: $500, SEO: $200").'),
  cohortAnalysisSummary: z.string().max(1000, {message: "Must be 1000 characters or less."}).optional().describe('Optional: Brief summary of cohort retention trends and LTV insights.'),
  
  // Pricing Strategy
  pricingTiers: z.string().max(500, {message: "Must be 500 characters or less."}).optional().describe('Optional: Description of pricing tiers.'),
  averageDealSize: z.coerce.number().positive({message: "Must be positive."}).optional().describe('Optional: Average Annual Contract Value (ACV) or deal size in USD.'),
  averageContractLengthMonths: z.coerce.number().int({message: "Must be a whole number."}).positive({message: "Must be positive."}).optional().describe('Optional: Average contract length in months.'),
  
  // Sales & Marketing
  salesCycleLengthDays: z.coerce.number().int({message: "Must be a whole number."}).positive({message: "Must be positive."}).optional().describe('Optional: Average sales cycle length in days.'),
  customerAcquisitionChannels: z.string().max(500, {message: 'Must be 500 characters or less.'}).optional().describe('Optional: Main customer acquisition channels.'),
  marketingSpendBreakdown: z.string().max(500, {message: 'Must be 500 characters or less.'}).optional().describe('Optional: Breakdown of marketing spend.'),

  // Team & Operations
  totalEmployees: z.coerce.number().int({message: "Must be a whole number."}).positive({message: "Must be positive."}).optional().describe('Optional: Total number of full-time employees.'),
  salesTeamSize: z.coerce.number().int({message: "Must be a whole number."}).min(0, {message: "Cannot be negative."}).optional().describe('Optional: Number of employees in sales roles.'),
  marketingTeamSize: z.coerce.number().int({message: "Must be a whole number."}).min(0, {message: "Cannot be negative."}).optional().describe('Optional: Number of employees in marketing roles.'),
  engineeringTeamSize: z.coerce.number().int({message: "Must be a whole number."}).min(0, {message: "Cannot be negative."}).optional().describe('Optional: Number of employees in engineering/R&D roles.'),
  
  // Capital Efficiency
  cashBurnRateMonthly: z.coerce.number().optional().describe('Optional: Average monthly net cash burn in USD (positive if cash flow positive).'),
  cashRunwayMonths: z.coerce.number().min(0, {message: "Cannot be negative."}).optional().describe('Optional: Estimated months of cash runway remaining.'),
  
  // Debt & Equity Structure
  totalDebt: z.coerce.number().min(0, {message: "Cannot be negative."}).optional().describe('Optional: Total outstanding debt in USD.'),
  equityStructureSummary: z.string().max(1000, {message: "Must be 1000 characters or less."}).optional().describe('Optional: Brief summary of equity structure.'),

  // Product Usage Data
  dailyActiveUsers: z.coerce.number().int({message: "Must be a whole number."}).min(0, {message: "Cannot be negative."}).optional().describe('Optional: Daily Active Users (DAU).'),
  monthlyActiveUsers: z.coerce.number().int({message: "Must be a whole number."}).min(0, {message: "Cannot be negative."}).optional().describe('Optional: Monthly Active Users (MAU).'),
  keyFeatureAdoptionRate: z.string().max(500, {message: "Must be 500 characters or less."}).optional().describe('Optional: Adoption rate of 1-2 key product features.'),
  
  // Contextual Information
  fundingStage: z.string().max(100, {message: 'Must be 100 characters or less.'}).optional().describe('Current funding stage.'),
  industryVertical: z.string().max(100, {message: 'Must be 100 characters or less.'}).optional().describe('Primary industry vertical.'),
  targetMarket: z.string().max(100, {message: 'Must be 100 characters or less.'}).optional().describe('Primary target market segment.'),
  customerGeographicConcentration: z.string().max(500, {message: "Must be 500 characters or less."}).optional().describe('Optional: Primary geographic markets and revenue contribution.'),
});

type DataInputFormProps = {
  onSubmit: (data: ValuationEstimationInput) => Promise<void>;
  isLoading: boolean;
};

const FieldLabelWithTooltip = ({ label, tooltipText }: { label: string; tooltipText: string }) => (
  <div className="flex items-center">
    <FormLabel className="text-base">{label}</FormLabel>
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger type="button" asChild>
          <HelpCircle className="ml-1.5 h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm p-2 bg-popover text-popover-foreground shadow-md rounded-md">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);


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
      historicalFinancials: [{ year: new Date().getFullYear() -1 , arr: 800000, revenue: 850000, expenses: 600000, netProfitOrLoss: 250000, customerCount: 100 }],
      costOfGoodsSold: 250000, 
      salesMarketingSpendPercentage: 0.40,
      researchDevelopmentSpendPercentage: 0.20,
      generalAdministrativeSpendPercentage: 0.15,
      ebitda: 50000, 
      totalCustomers: 120,
      customerAcquisitionCost: 5000,
      ltvToCacRatio: 3.5,
      cacByChannel: "Google Ads: $600, SEO: $300, Referrals: $100",
      cohortAnalysisSummary: "12-month net dollar retention for Q1 2023 cohort: 110%. LTV for enterprise segment: $50k.",
      pricingTiers: "Basic: $49/mo, Pro: $149/mo, Enterprise: $499+/mo",
      averageDealSize: 12000, // ACV
      averageContractLengthMonths: 12,
      salesCycleLengthDays: 60,
      customerAcquisitionChannels: "SEO (40%), Content Marketing (30%), Google Ads (20%), Referrals (10%)",
      marketingSpendBreakdown: "Google Ads: $10k/month, SEO/Content: $5k/month, Social Media: $2k/month",
      totalEmployees: 50,
      salesTeamSize: 10,
      marketingTeamSize: 5,
      engineeringTeamSize: 20,
      cashBurnRateMonthly: -10000, // Negative for burn, positive for profit
      cashRunwayMonths: 18,
      totalDebt: 50000,
      equityStructureSummary: "Common stock, Series A ($5M raised, 20% ownership, 1x non-participating preference)",
      dailyActiveUsers: 1000,
      monthlyActiveUsers: 5000,
      keyFeatureAdoptionRate: "Dashboard Usage: 80% of MAU, Reporting Feature: 40% of MAU",
      fundingStage: 'Series A',
      industryVertical: 'General B2B SaaS',
      targetMarket: 'Mid-Market Companies',
      customerGeographicConcentration: "North America: 70%, Europe: 20%, APAC: 10%",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "historicalFinancials",
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const submissionValues = {
      ...values,
      historicalFinancials: values.historicalFinancials?.filter(item => item.year).map(item => ({
        ...item,
        arr: item.arr === null ? undefined : item.arr, // Ensure nulls become undefined for AI
        revenue: item.revenue === null ? undefined : item.revenue,
        expenses: item.expenses === null ? undefined : item.expenses,
        netProfitOrLoss: item.netProfitOrLoss === null ? undefined : item.netProfitOrLoss,
        customerCount: item.customerCount === null ? undefined : item.customerCount,
      }))
    };
    onSubmit(submissionValues as ValuationEstimationInput);
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
      historicalFinancials: [],
      costOfGoodsSold: undefined,
      salesMarketingSpendPercentage: undefined,
      researchDevelopmentSpendPercentage: undefined,
      generalAdministrativeSpendPercentage: undefined,
      ebitda: undefined,
      totalCustomers: undefined,
      customerAcquisitionCost: undefined,
      ltvToCacRatio: undefined,
      cacByChannel: '',
      cohortAnalysisSummary: '',
      pricingTiers: '',
      averageDealSize: undefined,
      averageContractLengthMonths: undefined,
      salesCycleLengthDays: undefined,
      customerAcquisitionChannels: '',
      marketingSpendBreakdown: '',
      totalEmployees: undefined,
      salesTeamSize: undefined,
      marketingTeamSize: undefined,
      engineeringTeamSize: undefined,
      cashBurnRateMonthly: undefined,
      cashRunwayMonths: undefined,
      totalDebt: undefined,
      equityStructureSummary: '',
      dailyActiveUsers: undefined,
      monthlyActiveUsers: undefined,
      keyFeatureAdoptionRate: '',
      fundingStage: '',
      industryVertical: '',
      targetMarket: '',
      customerGeographicConcentration: '',
    });
  }
  
  const accordionDefaultValues = ["item-1", "item-2"];

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Company &amp; Financial Metrics</CardTitle>
        <CardDescription>Enter your SaaS company's details and key metrics to estimate its valuation. More details lead to a more refined analysis. Fields marked (Optional) are not strictly required but improve accuracy.</CardDescription>
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
                        <FieldLabelWithTooltip label="Software Name *" tooltipText="The official name of your SaaS product or company." />
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

              {/* Section: Core Current Financials & Growth */}
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-medium hover:no-underline">
                  <div className="flex items-center space-x-2">
                     <BarChart3 className="h-6 w-6 text-primary" />
                    <span>Core Current Financials &amp; Growth *</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="arr" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Annual Recurring Revenue (ARR) *" tooltipText="Total current Annual Recurring Revenue in USD. This is the predictable revenue a company expects to receive from its customers over a year." /> <div className="relative"> <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 1000000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Total current ARR in USD.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="grossMargin" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Gross Margin *" tooltipText="Gross Profit (Revenue - COGS) / Revenue. Enter as a decimal (e.g., 0.8 for 80%)." /> <div className="relative"> <BadgePercent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.8 for 80%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Current gross profit margin (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="newBusinessARRGrowthRate" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="New Business ARR Growth Rate *" tooltipText="Annual growth rate from new customer acquisition. Enter as a decimal (e.g., 0.2 for 20%)." /> <div className="relative"> <TrendingUpIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.2 for 20%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Annual growth from new customers (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="expansionARRGrowthRate" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Expansion ARR Growth Rate *" tooltipText="Annual growth rate from existing customers (upsells, cross-sells). Can be negative if contraction. Enter as a decimal (e.g., 0.1 for 10%)." /> <div className="relative"> <Handshake className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.1 for 10%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Annual growth from existing customers (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="churnRate" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Annual Churn Rate *" tooltipText="Percentage of customers or revenue lost annually. Enter as a decimal (e.g., 0.1 for 10%)." /> <div className="relative"> <TrendingDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.1 for 10%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Annual customer/revenue churn rate (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="netRevenueRetention" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Net Revenue Retention (NRR) *" tooltipText="NRR or Dollar-Based Net Expansion Rate (DBNER). (Starting MRR + Expansion MRR - Churn MRR - Contraction MRR) / Starting MRR. Enter as decimal (e.g., 1.1 for 110%)." /> <div className="relative"> <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 1.1 for 110%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>NRR or DBNER (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section: Historical Performance */}
              <AccordionItem value="item-hist">
                <AccordionTrigger className="text-xl font-medium hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <History className="h-6 w-6 text-primary" />
                    <span>Historical Performance</span><span className="text-sm text-muted-foreground font-normal">(Optional, up to 5 years)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 space-y-3 relative bg-muted/30">
                       <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)} aria-label="Remove historical year"> <MinusCircle className="h-5 w-5 text-destructive" /> </Button>
                      <FormField control={form.control} name={`historicalFinancials.${index}.year`} render={({ field: itemField }) => ( <FormItem> <FormLabel>Year *</FormLabel> <FormControl><Input type="number" placeholder="e.g., 2023" {...itemField} /></FormControl><FormMessage /></FormItem> )}/>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name={`historicalFinancials.${index}.arr`} render={({ field: itemField }) => ( <FormItem> <FormLabel>ARR (USD)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 500000" {...itemField} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name={`historicalFinancials.${index}.revenue`} render={({ field: itemField }) => ( <FormItem> <FormLabel>Total Revenue (USD)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 550000" {...itemField} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name={`historicalFinancials.${index}.expenses`} render={({ field: itemField }) => ( <FormItem> <FormLabel>Total Expenses (USD)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 400000" {...itemField} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name={`historicalFinancials.${index}.netProfitOrLoss`} render={({ field: itemField }) => ( <FormItem> <FormLabel>Net Profit/Loss (USD)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 150000 or -50000" {...itemField} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name={`historicalFinancials.${index}.customerCount`} render={({ field: itemField }) => ( <FormItem> <FormLabel>Customer Count</FormLabel> <FormControl><Input type="number" placeholder="e.g., 80" {...itemField} /></FormControl><FormMessage /></FormItem> )}/>
                      </div>
                    </Card>
                  ))}
                   <Button type="button" variant="outline" size="sm" onClick={() => append({ year: new Date().getFullYear() - fields.length -1, arr: undefined, revenue: undefined, expenses: undefined, netProfitOrLoss: undefined, customerCount: undefined })} disabled={fields.length >= 5}> <PlusCircle className="mr-2 h-4 w-4" /> Add Historical Year </Button>
                   <FormMessage>{form.formState.errors.historicalFinancials?.message}</FormMessage>
                </AccordionContent>
              </AccordionItem>


              {/* Section: P&L / Operational & Cost Metrics */}
              <AccordionItem value="item-3">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <LineChart className="h-6 w-6 text-primary" />
                    <span>P&L / Operational & Cost Metrics *</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="costOfGoodsSold" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Cost of Goods Sold (COGS)" tooltipText="Annual Cost of Goods Sold in USD. Includes direct costs to deliver your service (e.g., hosting, third-party software licenses, customer support personnel directly involved in service delivery)." /> <span className="text-xs text-muted-foreground">(Optional)</span> <div className="relative"> <FactoryIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 250000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Annual COGS in USD.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="salesMarketingSpendPercentage" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="S&M Spend (% ARR) *" tooltipText="Sales & Marketing spend as a percentage of ARR. (Total S&M Expenses / ARR). Enter as decimal (e.g., 0.4 for 40%)." /> <div className="relative"> <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.4 for 40%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>S&M spend as % of ARR (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="researchDevelopmentSpendPercentage" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="R&D Spend (% ARR) *" tooltipText="Research & Development spend as a percentage of ARR. (Total R&D Expenses / ARR). Enter as decimal (e.g., 0.2 for 20%)." /> <div className="relative"> <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.2 for 20%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>R&D spend as % of ARR (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="generalAdministrativeSpendPercentage" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="G&A Spend (% ARR)" tooltipText="General & Administrative spend as a percentage of ARR. (Total G&A Expenses / ARR). Enter as decimal (e.g., 0.15 for 15%)." /> <span className="text-xs text-muted-foreground">(Optional)</span> <div className="relative"> <Library className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.15 for 15%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>G&A spend as % of ARR (decimal).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="ebitda" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="EBITDA" tooltipText="Current Annual Earnings Before Interest, Taxes, Depreciation, and Amortization in USD. Can be negative." /> <span className="text-xs text-muted-foreground">(Optional)</span> <div className="relative"> <LineChart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 0 or -50000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Annual EBITDA in USD. Can be negative.</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section: Customer Acquisition & Unit Economics */}
              <AccordionItem value="item-4">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    <span>Customer Acquisition & Unit Economics *</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="customerAcquisitionCost" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Customer Acquisition Cost (CAC) *" tooltipText="Average cost to acquire a new customer in USD. (Total Sales & Marketing Expenses / Number of New Customers Acquired)." /> <div className="relative"> <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 5000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Average CAC in USD.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="ltvToCacRatio" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="LTV to CAC Ratio *" tooltipText="Customer Lifetime Value (LTV) divided by Customer Acquisition Cost (CAC). A common benchmark is 3:1 or higher." /> <div className="relative"> <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" step="0.1" placeholder="e.g., 3.5" {...field} className="pl-10" /></FormControl> </div> <FormDescription>LTV to CAC ratio (e.g., 3 for 3:1).</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="totalCustomers" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Total Active Customers" tooltipText="The total number of currently active, paying customers." /> <span className="text-xs text-muted-foreground">(Optional)</span> <div className="relative"> <UsersRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 150" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Total number of current active customers.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="cacByChannel" render={({ field }) => ( <FormItem className="md:col-span-2"> <FieldLabelWithTooltip label="CAC by Channel" tooltipText="Approximate Customer Acquisition Cost for your key acquisition channels. E.g., 'Google Ads: $500, SEO: $200, Referrals: $100'." /> <span className="text-xs text-muted-foreground">(Optional)</span> <div className="relative"> <Route className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., Google Ads: $600, SEO: $300, Referrals: $100" {...field} className="pl-10 min-h-[80px]" /></FormControl> </div> <FormDescription>Approx. CAC for key acquisition channels.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="cohortAnalysisSummary" render={({ field }) => ( <FormItem className="md:col-span-2"> <FieldLabelWithTooltip label="Cohort Analysis Summary" tooltipText="A brief summary of customer cohort retention trends and LTV insights, if available. E.g., '12-month net dollar retention for Q1 2023 cohort was 110%. LTV for enterprise segment: $50k.'" /> <span className="text-xs text-muted-foreground">(Optional)</span> <div className="relative"> <PieChart className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., 12-month net dollar retention for Q1 2023 cohort: 110%. LTV for enterprise segment: $50k." {...field} className="pl-10 min-h-[100px]" /></FormControl> </div> <FormDescription>Brief summary of cohort retention trends and LTV insights.</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                </AccordionContent>
              </AccordionItem>

               {/* Section: Pricing & Sales Strategy */}
              <AccordionItem value="item-pricing-sales">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <Tags className="h-6 w-6 text-primary" />
                    <span>Pricing & Sales Strategy</span><span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="pricingTiers" render={({ field }) => ( <FormItem className="md:col-span-2"> <FieldLabelWithTooltip label="Pricing Tiers" tooltipText="Describe your main pricing tiers or packages. E.g., 'Basic: $29/mo, Pro: $149/mo, Enterprise: Custom'." /> <div className="relative"> <Tags className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., Basic: $29/mo, Pro: $149/mo, Enterprise: Custom" {...field} className="pl-10 min-h-[80px]" /></FormControl> </div> <FormDescription>Describe your main pricing tiers/packages.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="averageDealSize" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Average Deal Size (ACV)" tooltipText="Average Annual Contract Value (ACV) per customer in USD." /> <div className="relative"> <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 12000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Average Annual Contract Value in USD.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="averageContractLengthMonths" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Avg. Contract Length (Months)" tooltipText="Average customer contract length in months (e.g., 12 for annual, 1 for monthly)." /> <div className="relative"> <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 12" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Average customer contract length in months.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="salesCycleLengthDays" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Avg. Sales Cycle (Days)" tooltipText="Average time it takes from initial contact to closing a deal, in days." /> <div className="relative"> <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 60" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Average sales cycle length in days.</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                   <FormField control={form.control} name="customerAcquisitionChannels" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Main Customer Acquisition Channels" tooltipText="List your main customer acquisition channels and their approximate contribution if known. E.g., 'SEO (40%), Google Ads (30%), Content Marketing (20%), Referrals (10%)'." /> <div className="relative"> <Megaphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., SEO (40%), Google Ads (30%), Content Marketing (20%), Referrals (10%)" {...field} className="pl-10 min-h-[80px]" /></FormControl> </div> <FormDescription>List key channels and their approximate contribution if known.</FormDescription> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="marketingSpendBreakdown" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Marketing Spend Breakdown" tooltipText="Provide a breakdown of your marketing spend across key channels or categories. E.g., 'Google Ads: $10k/month, Content Creation: $5k/month'." /> <div className="relative"> <PieChart className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., Google Ads: $10k/month, Content Creation: $5k/month" {...field} className="pl-10 min-h-[80px]" /></FormControl> </div> <FormDescription>Optional breakdown of marketing spend by channel or category.</FormDescription> <FormMessage /> </FormItem> )}/>
                </AccordionContent>
              </AccordionItem>

              {/* Section: Team, Capital & Product */}
              <AccordionItem value="item-team-capital">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span>Team, Capital & Product</span><span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <h3 className="text-lg font-medium text-foreground/90">Team Composition</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="totalEmployees" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Total Employees" tooltipText="Total number of full-time equivalent employees." /> <div className="relative"> <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 50" {...field} className="pl-10" /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="salesTeamSize" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Sales Team Size" tooltipText="Number of employees primarily in sales roles." /> <div className="relative"> <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 10" {...field} className="pl-10" /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="marketingTeamSize" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Marketing Team Size" tooltipText="Number of employees primarily in marketing roles." /> <div className="relative"> <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 5" {...field} className="pl-10" /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="engineeringTeamSize" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Engineering Team Size" tooltipText="Number of employees primarily in engineering/R&D roles." /> <div className="relative"> <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 20" {...field} className="pl-10" /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                  </div>
                  <h3 className="text-lg font-medium text-foreground/90 mt-4">Capital Efficiency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="cashBurnRateMonthly" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Monthly Cash Burn/Gain" tooltipText="Average monthly net cash burn (enter as a negative number, e.g., -10000) or net cash gain (positive number) in USD." /> <div className="relative"> <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., -10000 or 5000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Avg. monthly net cash burn (negative) or gain (positive) in USD.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="cashRunwayMonths" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Cash Runway (Months)" tooltipText="Estimated number of months the company can operate with its current cash balance and burn rate." /> <div className="relative"> <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 18" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Estimated months of cash runway remaining.</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                  <h3 className="text-lg font-medium text-foreground/90 mt-4">Debt & Equity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                     <FormField control={form.control} name="totalDebt" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Total Outstanding Debt" tooltipText="Total amount of outstanding debt in USD." /> <div className="relative"> <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 50000" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Total outstanding debt in USD.</FormDescription> <FormMessage /> </FormItem> )}/>
                     <FormField control={form.control} name="equityStructureSummary" render={({ field }) => ( <FormItem className="md:col-span-2"> <FieldLabelWithTooltip label="Equity Structure Summary" tooltipText="Brief summary of the company's equity structure, e.g., 'Common stock only', or 'Series A ($5M raised, 20% ownership, 1x non-participating preference)'." /> <div className="relative"> <Library className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., Common stock only, or Series A ($5M raised, 20% ownership, 1x non-participating preference)" {...field} className="pl-10 min-h-[80px]" /></FormControl> </div> <FormDescription>Brief summary of equity structure (e.g., funding rounds, preferences).</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                  <h3 className="text-lg font-medium text-foreground/90 mt-4">Product Usage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="dailyActiveUsers" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Daily Active Users (DAU)" tooltipText="Number of unique users who engage with your product on a daily basis." /> <div className="relative"> <AppWindow className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 1000" {...field} className="pl-10" /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="monthlyActiveUsers" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Monthly Active Users (MAU)" tooltipText="Number of unique users who engage with your product in a given month." /> <div className="relative"> <AppWindow className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="number" placeholder="e.g., 5000" {...field} className="pl-10" /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="keyFeatureAdoptionRate" render={({ field }) => ( <FormItem className="md:col-span-2"> <FieldLabelWithTooltip label="Key Feature Adoption" tooltipText="Adoption rate of 1-2 key product features. E.g., 'Dashboard Usage: 80% of MAU, Reporting Feature: 40% of MAU'." /> <div className="relative"> <Target className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> <FormControl><Textarea placeholder="e.g., Dashboard Usage: 80% of MAU, Reporting Feature: 40% of MAU" {...field} className="pl-10 min-h-[80px]" /></FormControl> </div> <FormDescription>Adoption rate of 1-2 key product features.</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Section: Contextual Information */}
              <AccordionItem value="item-context">
                 <AccordionTrigger className="text-xl font-medium hover:no-underline">
                   <div className="flex items-center space-x-2">
                    <Info className="h-6 w-6 text-primary" />
                    <span>Contextual Information</span><span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormField control={form.control} name="fundingStage" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Funding Stage" tooltipText="The current funding stage of the company (e.g., Bootstrap, Seed, Series A, Growth Stage, Public)." /> <div className="relative"> <LandmarkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="text" placeholder="e.g., Series A, Bootstrap" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Company's current funding stage.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="industryVertical" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Industry Vertical" tooltipText="The primary industry vertical your company operates in (e.g., FinTech, HealthTech, Enterprise SaaS, MarTech)." /> <div className="relative"> <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="text" placeholder="e.g., FinTech, HealthTech" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Primary industry your company operates in.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="targetMarket" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Target Market" tooltipText="The primary customer segment your company targets (e.g., SMB, Mid-Market, Enterprise)." /> <div className="relative"> <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="text" placeholder="e.g., SMB, Mid-Market, Enterprise" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Primary customer segment.</FormDescription> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="customerGeographicConcentration" render={({ field }) => ( <FormItem> <FieldLabelWithTooltip label="Geographic Concentration" tooltipText="Describe the primary geographic markets for your customers and their approximate revenue contribution. E.g., 'North America: 70%, Europe: 20%, APAC: 10%'." /> <div className="relative"> <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> <FormControl><Input type="text" placeholder="e.g., North America: 70%, Europe: 20%" {...field} className="pl-10" /></FormControl> </div> <FormDescription>Primary geographic markets and revenue contribution.</FormDescription> <FormMessage /> </FormItem> )}/>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClearForm} disabled={isLoading} className="w-full sm:w-auto text-base py-3 rounded-lg shadow-sm transition-transform hover:scale-[1.02] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2">
                <Trash2 className="mr-2 h-5 w-5" /> Clear Form
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2 flex-grow">
                {isLoading ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Estimating... </> ) : ( 'Estimate Valuation & Analyze Benchmarks' )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">* Indicates a required field for core valuation. Other fields are optional but enhance analysis accuracy.</p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
