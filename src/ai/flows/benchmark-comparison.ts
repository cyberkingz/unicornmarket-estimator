// src/ai/flows/benchmark-comparison.ts
'use server';
/**
 * @fileOverview Provides a competitive benchmark analysis for a SaaS company.
 *
 * - benchmarkComparison - A function that generates a benchmark comparison.
 * - BenchmarkComparisonInput - The input type for the benchmarkComparison function.
 * - BenchmarkComparisonOutput - The return type for the benchmarkComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BenchmarkComparisonInputSchema = z.object({
  softwareName: z.string().optional().describe('The name of the SaaS software or company.'),
  arr: z.number().describe('Annual Recurring Revenue (ARR) in USD.'),
  newBusinessARRGrowthRate: z.coerce.number().min(0).max(5).describe('Annual growth rate from new business (e.g., 0.25 for 25%).'),
  expansionARRGrowthRate: z.coerce.number().min(-1).max(5).describe('Annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%). Can be negative for contraction.'),
  churnRate: z.number().describe('Annual churn rate (as a decimal, e.g., 0.05 for 10%).'),
  netRevenueRetention: z.coerce.number().min(0).max(3).describe('Net Revenue Retention (NRR) or Dollar-Based Net Expansion Rate (DBNER) as a decimal (e.g., 1.1 for 110%).'),
  grossMargin: z.number().describe('Gross margin (as a decimal, e.g., 0.8 for 80%).'),

  costOfGoodsSold: z.coerce.number().min(0).optional().describe('Optional: Annual Cost of Goods Sold (COGS) in USD. Includes hosting, third-party software, customer support directly related to service delivery.'),
  generalAdministrativeSpend: z.coerce.number().min(0).optional().describe('Optional: Annual General & Administrative (G&A) spend in USD (e.g., salaries not in S&M/R&D, rent, utilities, legal).'),
  ebitda: z.coerce.number().optional().describe('Optional: Annual Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) in USD. Can be negative.'),
  
  customerAcquisitionCost: z.coerce.number().positive().describe('Average Customer Acquisition Cost (CAC) in USD.'),
  ltvToCacRatio: z.coerce.number().positive().describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1).'),
  salesMarketingSpendPercentage: z.coerce.number().min(0).max(1).describe('Sales & Marketing spend as a percentage of ARR (e.g., 0.4 for 40%).'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0).max(1).describe('Research & Development spend as a percentage of ARR (e.g., 0.2 for 20%).'),

  customerAcquisitionChannels: z.string().optional().describe('Optional: Main customer acquisition channels (e.g., Google Ads, SEO, Content Marketing, Sales Team). Listing key channels and their approximate contribution can provide more context for benchmarking channel effectiveness.'),
  marketingSpendBreakdown: z.string().optional().describe('Optional: Breakdown of marketing spend across key channels or categories. This can give insights into spend efficiency and channel dependency compared to industry norms.'),

  fundingStage: z.string().optional().describe('Current funding stage (e.g., Bootstrap, Seed, Series A, Growth Stage, Public).'),
  industryVertical: z.string().optional().describe('Primary industry vertical (e.g., FinTech, HealthTech, Enterprise SaaS, MarTech).'),
  targetMarket: z.string().optional().describe('Primary target market segment (e.g., SMB, Mid-Market, Enterprise).'),
  estimatedAverageValuation: z.number().describe('The AI-estimated average valuation of the company in USD.'),
});
export type BenchmarkComparisonInput = z.infer<typeof BenchmarkComparisonInputSchema>;

const BenchmarkComparisonOutputSchema = z.object({
  benchmarkAnalysis: z.string().describe('A concise qualitative analysis comparing the company to typical industry benchmarks for key metrics (ARR, Growth components, NRR, Churn, Gross Margin, COGS/G&A/EBITDA if provided, CAC, LTV/CAC, S&M/R&D Spend, acquisition channels if provided) and overall valuation, considering its context (funding stage, industry, target market). Mention if metrics are above, below, or in line with general expectations for a SaaS company with the given profile, and how this impacts valuation.'),
  strengthAreas: z.array(z.string()).describe('A list of 2-4 key strengths based on the benchmark comparison (e.g., "NRR significantly above average for its funding stage and target market").'),
  improvementAreas: z.array(z.string()).describe('A list of 2-4 key areas for improvement based on the benchmark comparison (e.g., "CAC is higher than typical for companies in the specified industry vertical targeting SMBs").'),
});
export type BenchmarkComparisonOutput = z.infer<typeof BenchmarkComparisonOutputSchema>;

export async function benchmarkComparison(input: BenchmarkComparisonInput): Promise<BenchmarkComparisonOutput> {
  return benchmarkComparisonFlow(input);
}

const benchmarkComparisonPrompt = ai.definePrompt({
  name: 'benchmarkComparisonPrompt',
  input: {schema: BenchmarkComparisonInputSchema},
  output: {schema: BenchmarkComparisonOutputSchema},
  prompt: `You are a seasoned SaaS industry analyst. Your task is to provide an in-depth competitive benchmark analysis for a SaaS company based on the following metrics and its AI-estimated valuation.

Company Details & Metrics:
{{#if softwareName}}- Software Name: {{{softwareName}}}{{/if}}
- Annual Recurring Revenue (ARR): {{{arr}}} USD
- New Business ARR Growth Rate (annual): {{{newBusinessARRGrowthRate}}}
- Expansion ARR Growth Rate (annual): {{{expansionARRGrowthRate}}}
- Annual Churn Rate: {{{churnRate}}}
- Net Revenue Retention (NRR/DBNER): {{{netRevenueRetention}}}
- Gross Margin: {{{grossMargin}}}
{{#if costOfGoodsSold}}- Cost of Goods Sold (COGS): {{{costOfGoodsSold}}} USD (Optional){{/if}}
{{#if generalAdministrativeSpend}}- General & Administrative (G&A) Spend: {{{generalAdministrativeSpend}}} USD (Optional){{/if}}
{{#if ebitda}}- EBITDA: {{{ebitda}}} USD (Optional){{/if}}
- Customer Acquisition Cost (CAC): {{{customerAcquisitionCost}}} USD
- LTV to CAC Ratio: {{{ltvToCacRatio}}}
- Sales & Marketing Spend (% of ARR): {{{salesMarketingSpendPercentage}}}
- Research & Development Spend (% of ARR): {{{researchDevelopmentSpendPercentage}}}
{{#if customerAcquisitionChannels}}- Customer Acquisition Channels: {{{customerAcquisitionChannels}}} (Optional){{/if}}
{{#if marketingSpendBreakdown}}- Marketing Spend Breakdown: {{{marketingSpendBreakdown}}} (Optional){{/if}}
{{#if fundingStage}}- Funding Stage: {{{fundingStage}}}{{/if}}
{{#if industryVertical}}- Industry Vertical: {{{industryVertical}}}{{/if}}
{{#if targetMarket}}- Target Market: {{{targetMarket}}}{{/if}}
- Estimated Average Valuation: {{{estimatedAverageValuation}}} USD

Instructions:
1.  **Overall Benchmark Analysis**: Provide a concise qualitative analysis comparing the company's key metrics and its estimated valuation against typical industry benchmarks for SaaS companies. Consider its funding stage, industry, and target market if provided. If a software name is provided, you can refer to the company by its name.
    For each metric, state whether it's generally strong, average, or an area for concern compared to general expectations for its profile:
    *   ARR, New/Expansion Growth, NRR, Churn, Gross Margin.
    *   If COGS, G&A Spend, or EBITDA are provided, comment on how these compare to typical SaaS P&L structures (e.g., COGS as % of revenue, G&A as % of revenue, EBITDA margins).
    *   CAC, LTV/CAC ratio.
    *   S&M Spend (% of ARR), R&D Spend (% of ARR).
    *   If Customer Acquisition Channels or Marketing Spend Breakdown are provided, comment on the channel mix diversity, scalability, and spend efficiency relative to common practices for the company's scale and target market.
    Explain how these factors collectively influence its valuation relative to peers.
2.  **Strength Areas**: Identify 2-4 key strength areas. These should be metrics or aspects where the company performs notably well compared to general industry expectations for its profile.
3.  **Improvement Areas**: Identify 2-4 key areas where the company could improve relative to benchmarks. These should be actionable or highlight potential risks.

Focus on providing insights that would be valuable to founders or investors. Be realistic and acknowledge that benchmarks can vary significantly. Base your analysis on general SaaS industry knowledge, cross-referencing with typical performance for the company's profile (stage, industry, market).

Format your output as a JSON object with the keys: "benchmarkAnalysis", "strengthAreas", and "improvementAreas".
`,
});

const benchmarkComparisonFlow = ai.defineFlow(
  {
    name: 'benchmarkComparisonFlow',
    inputSchema: BenchmarkComparisonInputSchema,
    outputSchema: BenchmarkComparisonOutputSchema,
  },
  async input => {
    const {output} = await benchmarkComparisonPrompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a benchmark comparison.');
    }
    return output;
  }
);
