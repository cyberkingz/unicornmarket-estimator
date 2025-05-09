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

const HistoricalFinancialItemSchema = z.object({
  year: z.coerce.number().int().describe('The financial year (e.g., 2023).'),
  arr: z.coerce.number().optional().describe('Annual Recurring Revenue (ARR) for the year in USD.'),
  revenue: z.coerce.number().optional().describe('Total revenue for the year in USD.'),
  expenses: z.coerce.number().optional().describe('Total operating expenses for the year in USD.'),
  netProfitOrLoss: z.coerce.number().optional().describe('Net profit or loss for the year in USD.'),
  customerCount: z.coerce.number().int().positive().optional().describe('Number of active customers at year end.'),
});

const BenchmarkComparisonInputSchema = z.object({
  softwareName: z.string().optional().describe('The name of the SaaS software or company.'),
  estimatedAverageValuation: z.number().describe('The AI-estimated average valuation of the company in USD.'),

  // Core Current Metrics
  arr: z.number().describe('Current Annual Recurring Revenue (ARR) in USD.'),
  newBusinessARRGrowthRate: z.coerce.number().min(0).max(5).describe('Current annual growth rate from new business (e.g., 0.25 for 25%).'),
  expansionARRGrowthRate: z.coerce.number().min(-1).max(5).describe('Current annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%). Can be negative for contraction.'),
  churnRate: z.number().describe('Current annual churn rate (as a decimal, e.g., 0.05 for 5%).'),
  netRevenueRetention: z.coerce.number().min(0).max(3).describe('Current Net Revenue Retention (NRR) or Dollar-Based Net Expansion Rate (DBNER) as a decimal (e.g., 1.1 for 110%).'),
  grossMargin: z.number().describe('Current gross margin (as a decimal, e.g., 0.8 for 80%).'),
  
  // Historical Financial Data (Optional)
  historicalFinancials: z.array(HistoricalFinancialItemSchema).max(5, "Please provide data for up to the last 5 years.").optional().describe('Optional: Array of historical financial data for up to 5 previous years.'),

  // Detailed P&L / Operational Costs (Optional)
  costOfGoodsSold: z.coerce.number().min(0).optional().describe('Optional: Annual Cost of Goods Sold (COGS) in USD.'),
  salesMarketingSpendPercentage: z.coerce.number().min(0).max(1).describe('Current Sales & Marketing spend as a percentage of ARR (e.g., 0.4 for 40%).'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0).max(1).describe('Current Research & Development spend as a percentage of ARR (e.g., 0.2 for 20%).'),
  generalAdministrativeSpendPercentage: z.coerce.number().min(0).max(1).optional().describe('Optional: Current General & Administrative (G&A) spend as a percentage of ARR (e.g., 0.15 for 15%).'),
  ebitda: z.coerce.number().optional().describe('Optional: Current Annual Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) in USD. Can be negative.'),

  // Customer Segmentation & Unit Economics
  totalCustomers: z.coerce.number().int().positive().optional().describe('Optional: Total number of active customers.'),
  customerAcquisitionCost: z.coerce.number().positive().describe('Average Customer Acquisition Cost (CAC) in USD.'),
  ltvToCacRatio: z.coerce.number().positive().describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1).'),
  cacByChannel: z.string().max(500).optional().describe('Optional: Approximate CAC for key acquisition channels.'),
  cohortAnalysisSummary: z.string().max(1000).optional().describe('Optional: Brief summary of cohort retention trends and LTV insights.'),
  
  // Pricing Strategy (Optional)
  pricingTiers: z.string().max(500).optional().describe('Optional: Description of pricing tiers.'),
  averageDealSize: z.coerce.number().positive().optional().describe('Optional: Average Annual Contract Value (ACV) or deal size in USD.'),
  averageContractLengthMonths: z.coerce.number().int().positive().optional().describe('Optional: Average contract length in months.'),
  
  // Sales & Marketing (Optional)
  salesCycleLengthDays: z.coerce.number().int().positive().optional().describe('Optional: Average sales cycle length in days.'),
  customerAcquisitionChannels: z.string().max(500).optional().describe('Optional: Main customer acquisition channels and their approximate contribution.'),
  marketingSpendBreakdown: z.string().max(500).optional().describe('Optional: Breakdown of marketing spend across key channels or categories.'),

  // Team & Operations (Optional)
  totalEmployees: z.coerce.number().int().positive().optional().describe('Optional: Total number of full-time employees.'),
  salesTeamSize: z.coerce.number().int().positive().optional().describe('Optional: Number of employees in sales roles.'),
  marketingTeamSize: z.coerce.number().int().positive().optional().describe('Optional: Number of employees in marketing roles.'),
  engineeringTeamSize: z.coerce.number().int().positive().optional().describe('Optional: Number of employees in engineering/R&D roles.'),
  
  // Capital Efficiency (Optional)
  cashBurnRateMonthly: z.coerce.number().optional().describe('Optional: Average monthly net cash burn in USD. Can be positive if cash flow positive.'),
  cashRunwayMonths: z.coerce.number().positive().optional().describe('Optional: Estimated months of cash runway remaining.'),
  
  // Debt & Equity Structure (Optional)
  totalDebt: z.coerce.number().min(0).optional().describe('Optional: Total outstanding debt in USD.'),
  equityStructureSummary: z.string().max(1000).optional().describe('Optional: Brief summary of equity structure.'),

  // Product Usage Data (Optional)
  dailyActiveUsers: z.coerce.number().int().positive().optional().describe('Optional: Daily Active Users (DAU).'),
  monthlyActiveUsers: z.coerce.number().int().positive().optional().describe('Optional: Monthly Active Users (MAU).'),
  keyFeatureAdoptionRate: z.string().max(500).optional().describe('Optional: Adoption rate of 1-2 key product features.'),
  
  // Contextual Information (Optional)
  fundingStage: z.string().max(100).optional().describe('Current funding stage.'),
  industryVertical: z.string().max(100).optional().describe('Primary industry vertical.'),
  targetMarket: z.string().max(100).optional().describe('Primary target market segment.'),
  customerGeographicConcentration: z.string().max(500).optional().describe('Optional: Primary geographic markets and their approximate revenue contribution.'),
});
export type BenchmarkComparisonInput = z.infer<typeof BenchmarkComparisonInputSchema>;

const BenchmarkComparisonOutputSchema = z.object({
  benchmarkAnalysis: z.string().describe('A comprehensive qualitative analysis comparing the company to typical industry benchmarks and its likely peer group for key metrics (current metrics, historical trends if available, P&L structure, unit economics, pricing/sales efficiency, team size, capital efficiency, product engagement) and overall valuation, considering its context (funding stage, industry, target market, geography). Mention if metrics are above, below, or in line with general expectations for a SaaS company with the given profile, and how this impacts valuation. The analysis should be structured with clear subheadings (e.g., "Executive Summary of Benchmarking", "Financial Performance vs Peers", "Operational Efficiency vs Peers", "Market Positioning & Growth Potential").'),
  strengthAreas: z.array(z.string()).describe('A list of 2-4 key strengths based on the benchmark comparison (e.g., "NRR significantly above average for its funding stage and target market, indicating strong customer value and expansion.").'),
  improvementAreas: z.array(z.string()).describe('A list of 2-4 key areas for improvement based on the benchmark comparison (e.g., "CAC is higher than typical for companies in the specified industry vertical targeting SMBs, suggesting a need to optimize acquisition channels or pricing strategy.").'),
});
export type BenchmarkComparisonOutput = z.infer<typeof BenchmarkComparisonOutputSchema>;

export async function benchmarkComparison(input: BenchmarkComparisonInput): Promise<BenchmarkComparisonOutput> {
  return benchmarkComparisonFlow(input);
}

const benchmarkComparisonPrompt = ai.definePrompt({
  name: 'benchmarkComparisonPrompt',
  input: {schema: BenchmarkComparisonInputSchema},
  output: {schema: BenchmarkComparisonOutputSchema},
  prompt: `You are a seasoned SaaS industry analyst. Your task is to provide an in-depth, professional competitive benchmark analysis for a SaaS company based on the following metrics and its AI-estimated valuation.
Your analysis should be highly detailed and professional. Use all available data points, including optional ones, to draw comparisons and provide insights. Specifically, compare the company to its likely peer group based on its funding stage, industry vertical, target market, and ARR scale. Explain how it stands relative to these peers.
If significant optional data is missing, briefly note how this could limit the precision of the benchmark analysis and what general assumptions were made.

Company Details & Metrics:
{{#if softwareName}}- Software Name: {{{softwareName}}}{{/if}}
- Estimated Average Valuation: {{{estimatedAverageValuation}}} USD

Current Core Metrics:
- Annual Recurring Revenue (ARR): {{{arr}}} USD
- New Business ARR Growth Rate (annual): {{{newBusinessARRGrowthRate}}}
- Expansion ARR Growth Rate (annual): {{{expansionARRGrowthRate}}}
- Annual Churn Rate: {{{churnRate}}}
- Net Revenue Retention (NRR/DBNER): {{{netRevenueRetention}}}
- Gross Margin: {{{grossMargin}}}

{{#if historicalFinancials.length}}
Historical Financial Performance (up to 5 years):
{{#each historicalFinancials}}
- Year: {{{this.year}}}
  {{#if this.arr}}- ARR: {{{this.arr}}} USD{{/if}}
  {{#if this.revenue}}- Total Revenue: {{{this.revenue}}} USD{{/if}}
  {{#if this.expenses}}- Total Expenses: {{{this.expenses}}} USD{{/if}}
  {{#if this.netProfitOrLoss}}- Net Profit/Loss: {{{this.netProfitOrLoss}}} USD{{/if}}
  {{#if this.customerCount}}- Customer Count: {{{this.customerCount}}}{{/if}}
{{/each}}
{{/if}}

P&L and Operational Costs:
{{#if costOfGoodsSold}}- Cost of Goods Sold (COGS): {{{costOfGoodsSold}}} USD (Optional){{/if}}
- Sales & Marketing Spend (% of ARR): {{{salesMarketingSpendPercentage}}}
- Research & Development Spend (% of ARR): {{{researchDevelopmentSpendPercentage}}}
{{#if generalAdministrativeSpendPercentage}}- General & Administrative Spend (% of ARR): {{{generalAdministrativeSpendPercentage}}} (Optional){{/if}}
{{#if ebitda}}- EBITDA: {{{ebitda}}} USD (Optional){{/if}}

Customer Segmentation & Unit Economics:
{{#if totalCustomers}}- Total Customers: {{{totalCustomers}}} (Optional){{/if}}
- Customer Acquisition Cost (CAC): {{{customerAcquisitionCost}}} USD
- LTV to CAC Ratio: {{{ltvToCacRatio}}}
{{#if cacByChannel}}- CAC by Channel: {{{cacByChannel}}} (Optional){{/if}}
{{#if cohortAnalysisSummary}}- Cohort Analysis Summary: {{{cohortAnalysisSummary}}} (Optional){{/if}}

Pricing Strategy:
{{#if pricingTiers}}- Pricing Tiers: {{{pricingTiers}}} (Optional){{/if}}
{{#if averageDealSize}}- Average Deal Size (ACV): {{{averageDealSize}}} USD (Optional){{/if}}
{{#if averageContractLengthMonths}}- Average Contract Length: {{{averageContractLengthMonths}}} months (Optional){{/if}}

Sales & Marketing Details:
{{#if salesCycleLengthDays}}- Average Sales Cycle: {{{salesCycleLengthDays}}} days (Optional){{/if}}
{{#if customerAcquisitionChannels}}- Customer Acquisition Channels: {{{customerAcquisitionChannels}}} (Optional){{/if}}
{{#if marketingSpendBreakdown}}- Marketing Spend Breakdown: {{{marketingSpendBreakdown}}} (Optional){{/if}}

Team & Operations:
{{#if totalEmployees}}- Total Employees: {{{totalEmployees}}} (Optional){{/if}}
{{#if salesTeamSize}}- Sales Team Size: {{{salesTeamSize}}} (Optional){{/if}}
{{#if marketingTeamSize}}- Marketing Team Size: {{{marketingTeamSize}}} (Optional){{/if}}
{{#if engineeringTeamSize}}- Engineering Team Size: {{{engineeringTeamSize}}} (Optional){{/if}}

Capital Efficiency:
{{#if cashBurnRateMonthly}}- Monthly Cash Burn Rate: {{{cashBurnRateMonthly}}} USD (Optional){{/if}}
{{#if cashRunwayMonths}}- Cash Runway: {{{cashRunwayMonths}}} months (Optional){{/if}}

Debt & Equity Structure:
{{#if totalDebt}}- Total Debt: {{{totalDebt}}} USD (Optional){{/if}}
{{#if equityStructureSummary}}- Equity Structure Summary: {{{equityStructureSummary}}} (Optional){{/if}}

Product Usage Data:
{{#if dailyActiveUsers}}- Daily Active Users (DAU): {{{dailyActiveUsers}}} (Optional){{/if}}
{{#if monthlyActiveUsers}}- Monthly Active Users (MAU): {{{monthlyActiveUsers}}} (Optional){{/if}}
{{#if keyFeatureAdoptionRate}}- Key Feature Adoption Rate: {{{keyFeatureAdoptionRate}}} (Optional){{/if}}

Contextual Information:
{{#if fundingStage}}- Funding Stage: {{{fundingStage}}}{{/if}}
{{#if industryVertical}}- Industry Vertical: {{{industryVertical}}}{{/if}}
{{#if targetMarket}}- Target Market: {{{targetMarket}}}{{/if}}
{{#if customerGeographicConcentration}}- Customer Geographic Concentration: {{{customerGeographicConcentration}}} (Optional){{/if}}

Instructions:
1.  **Overall Benchmark Analysis**: Provide a comprehensive qualitative analysis comparing the company's key metrics and its estimated valuation against typical industry benchmarks and its likely peer group (defined by stage, industry, market, ARR scale). Structure this analysis with clear subheadings (e.g., "Executive Summary of Benchmarking", "Financial Performance vs Peers", "Operational Efficiency vs Peers", "Market Positioning & Growth Potential"). If a software name is provided, refer to the company by name.
    For each relevant area, state whether metrics are generally strong, average, or an area for concern compared to general expectations for its profile:
    *   **Current Financials**: ARR, Growth components (NewBiz, Expansion), NRR, Churn, Gross Margin.
    *   **Historical Trends** (if provided): Consistency of growth, margin evolution, profitability trends.
    *   **P&L Structure**: COGS, S&M, R&D, G&A spend percentages. EBITDA margins.
    *   **Unit Economics**: CAC, LTV/CAC ratio. ARR per customer (if total customers provided). Efficiency of CAC by channel (if provided). Insights from cohort analysis (if provided).
    *   **Pricing & Sales**: Average deal size, contract length, sales cycle length compared to typicals for the target market.
    *   **Team & Operational Efficiency**: Employee counts (overall and by department) relative to ARR (e.g. ARR per employee) or industry norms.
    *   **Capital Efficiency**: Burn rate and runway compared to stage and growth rate. Impact of debt.
    *   **Product Engagement**: DAU/MAU, feature adoption rates in context of product type and market.
    *   **Acquisition Strategy**: Channel mix diversity, scalability, spend efficiency (if channels/breakdown provided).
Explain how these factors collectively influence its valuation relative to peers.
2.  **Strength Areas**: Identify 2-4 key strength areas based on the benchmark comparison. These should be metrics or aspects where the company performs notably well compared to general industry expectations for its profile.
3.  **Improvement Areas**: Identify 2-4 key areas where the company could improve relative to benchmarks. These should be actionable or highlight potential risks.
4.  **Limitations and Assumptions**: If significant optional data is missing, briefly note how this could impact the precision of the benchmark and what general assumptions were made.

Focus on providing insights that would be valuable to founders or investors. Be realistic and acknowledge that benchmarks can vary significantly. Base your analysis on general SaaS industry knowledge, cross-referencing with typical performance for the company's profile.

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
    const augmentedInput = {
      ...input,
      historicalFinancials: input.historicalFinancials?.filter(hf => hf.year) || [],
    };
    const {output} = await benchmarkComparisonPrompt(augmentedInput);
    if (!output) {
      throw new Error('The AI failed to generate a benchmark comparison.');
    }
    return output;
  }
);
