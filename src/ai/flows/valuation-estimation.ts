// src/ai/flows/valuation-estimation.ts
'use server';
/**
 * @fileOverview Estimates the valuation range of a SaaS company based on key metrics.
 *
 * - valuationEstimation - A function that estimates the valuation range.
 * - ValuationEstimationInput - The input type for the valuationEstimation function.
 * - ValuationEstimationOutput - The return type for the valuationEstimation function.
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

const ValuationEstimationInputSchema = z.object({
  softwareName: z.string().optional().describe('The name of the SaaS software or company.'),
  
  // Core Current Metrics
  arr: z.number().describe('Current Annual Recurring Revenue (ARR) in USD.'),
  newBusinessARRGrowthRate: z.coerce.number().min(0).max(5).describe('Current annual growth rate from new business (e.g., 0.25 for 25%).'),
  expansionARRGrowthRate: z.coerce.number().min(-1).max(5).describe('Current annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%). Can be negative for contraction.'),
  churnRate: z.number().describe('Current annual churn rate (as a decimal, e.g., 0.05 for 5%).'),
  netRevenueRetention: z.coerce.number().min(0).max(3).describe('Current Net Revenue Retention (NRR) or Dollar-Based Net Expansion Rate (DBNER) as a decimal (e.g., 1.1 for 110%).'),
  grossMargin: z.number().describe('Current gross margin (as a decimal, e.g., 0.8 for 80%).'),
  
  // Historical Financial Data (Optional)
  historicalFinancials: z.array(HistoricalFinancialItemSchema).max(5, {message: "Please provide data for up to the last 5 years."}).optional().describe('Optional: Array of historical financial data for up to 5 previous years.'),

  // Detailed P&L / Operational Costs (Optional)
  costOfGoodsSold: z.coerce.number().min(0).optional().describe('Optional: Annual Cost of Goods Sold (COGS) in USD. Includes hosting, third-party software, customer support directly related to service delivery.'),
  salesMarketingSpendPercentage: z.coerce.number().min(0).max(1).describe('Current Sales & Marketing spend as a percentage of ARR (e.g., 0.4 for 40%).'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0).max(1).describe('Current Research & Development spend as a percentage of ARR (e.g., 0.2 for 20%).'),
  generalAdministrativeSpendPercentage: z.coerce.number().min(0).max(1).optional().describe('Optional: Current General & Administrative (G&A) spend as a percentage of ARR (e.g., 0.15 for 15%).'),
  ebitda: z.coerce.number().optional().describe('Optional: Current Annual Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) in USD. Can be negative.'),

  // Customer Segmentation & Unit Economics
  totalCustomers: z.coerce.number().int().positive().optional().describe('Optional: Total number of active customers.'),
  customerAcquisitionCost: z.coerce.number().positive().describe('Average Customer Acquisition Cost (CAC) in USD.'),
  ltvToCacRatio: z.coerce.number().positive().describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1).'),
  cacByChannel: z.string().max(500).optional().describe('Optional: Approximate CAC for key acquisition channels (e.g., "Google Ads: $500, SEO: $200").'),
  cohortAnalysisSummary: z.string().max(1000).optional().describe('Optional: Brief summary of cohort retention trends and LTV insights, if available (e.g., "12-month net retention for 2022 cohort was 115%").'),
  
  // Pricing Strategy (Optional)
  pricingTiers: z.string().max(500).optional().describe('Optional: Description of pricing tiers (e.g., "Basic: $29/mo, Pro: $99/mo, Enterprise: Custom").'),
  averageDealSize: z.coerce.number().positive().optional().describe('Optional: Average Annual Contract Value (ACV) or deal size in USD.'),
  averageContractLengthMonths: z.coerce.number().int().positive().optional().describe('Optional: Average contract length in months.'),
  
  // Sales & Marketing (Optional)
  salesCycleLengthDays: z.coerce.number().int().positive().optional().describe('Optional: Average sales cycle length in days.'),
  customerAcquisitionChannels: z.string().max(500).optional().describe('Optional: Main customer acquisition channels (e.g., Google Ads, SEO, Content Marketing, Sales Team). Listing key channels and their approximate contribution can provide more context.'),
  marketingSpendBreakdown: z.string().max(500).optional().describe('Optional: Breakdown of marketing spend across key channels or categories. This can give insights into spend efficiency and channel dependency.'),

  // Team & Operations (Optional)
  totalEmployees: z.coerce.number().int().positive().optional().describe('Optional: Total number of full-time employees.'),
  salesTeamSize: z.coerce.number().int().positive().optional().describe('Optional: Number of employees in sales roles.'),
  marketingTeamSize: z.coerce.number().int().positive().optional().describe('Optional: Number of employees in marketing roles.'),
  engineeringTeamSize: z.coerce.number().int().positive().optional().describe('Optional: Number of employees in engineering/R&D roles.'),
  
  // Capital Efficiency (Optional)
  cashBurnRateMonthly: z.coerce.number().optional().describe('Optional: Average monthly net cash burn in USD. Can be positive if cash flow positive (net cash inflow).'),
  cashRunwayMonths: z.coerce.number().positive().optional().describe('Optional: Estimated months of cash runway remaining based on current burn rate.'),
  
  // Debt & Equity Structure (Optional)
  totalDebt: z.coerce.number().min(0).optional().describe('Optional: Total outstanding debt in USD.'),
  equityStructureSummary: z.string().max(1000).optional().describe('Optional: Brief summary of equity structure (e.g., "Common stock only", "Series A preferred with 1x liquidation preference, participating preferred").'),

  // Product Usage Data (Optional)
  dailyActiveUsers: z.coerce.number().int().positive().optional().describe('Optional: Daily Active Users (DAU).'),
  monthlyActiveUsers: z.coerce.number().int().positive().optional().describe('Optional: Monthly Active Users (MAU).'),
  keyFeatureAdoptionRate: z.string().max(500).optional().describe('Optional: Adoption rate of 1-2 key product features (e.g., "Feature X: 60% of MAU, Feature Y: 30% of MAU").'),
  
  // Contextual Information (Optional)
  fundingStage: z.string().max(100).optional().describe('Current funding stage (e.g., Bootstrap, Seed, Series A, Growth Stage, Public).'),
  industryVertical: z.string().max(100).optional().describe('Primary industry vertical (e.g., FinTech, HealthTech, Enterprise SaaS, MarTech).'),
  targetMarket: z.string().max(100).optional().describe('Primary target market segment (e.g., SMB, Mid-Market, Enterprise).'),
  customerGeographicConcentration: z.string().max(500).optional().describe('Optional: Primary geographic markets and their approximate revenue contribution (e.g., "North America: 70%, Europe: 20%, APAC: 10%").'),
});
export type ValuationEstimationInput = z.infer<typeof ValuationEstimationInputSchema>;

const ValuationEstimationOutputSchema = z.object({
  lowValuation: z.number().describe('Low end of the estimated valuation range in USD.'),
  highValuation: z.number().describe('High end of the estimated valuation range in USD.'),
  averageValuation: z.number().describe('Average of the estimated valuation range in USD.'),
  impliedARRMultiple: z.number().describe('Implied ARR multiple (Average Valuation / ARR).'),
  analysis: z.string().describe('Comprehensive qualitative analysis supporting the valuation range. This should detail how current key metrics (ARR, growth components, NRR, margins, CAC, LTV/CAC, spend efficiency), historical trends (if provided), customer insights (segmentation, pricing, sales cycle), operational aspects (team size, P&L structure, COGS, G&A, EBITDA), capital position (burn, runway, debt, equity), product engagement, and contextual factors (funding stage, industry, market, geography) contribute to the estimate. Discuss typical ranges and how the company\'s metrics compare. Highlight specific strengths and weaknesses derived from the input data that significantly influence the valuation.'),
});
export type ValuationEstimationOutput = z.infer<typeof ValuationEstimationOutputSchema>;

export async function valuationEstimation(input: ValuationEstimationInput): Promise<ValuationEstimationOutput> {
  return valuationEstimationFlow(input);
}

const valuationEstimationPrompt = ai.definePrompt({
  name: 'valuationEstimationPrompt',
  input: {schema: ValuationEstimationInputSchema},
  output: {schema: ValuationEstimationOutputSchema},
  prompt: `You are an expert SaaS company valuation analyst providing a professional, in-depth valuation. Given the following detailed metrics, estimate a valuation range (low, high, and average) for the company in USD. Provide a comprehensive qualitative analysis supporting your valuation and calculate the implied ARR multiple.

Company Details & Metrics:
{{#if softwareName}}- Software Name: {{{softwareName}}}{{/if}}

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
{{#if cashBurnRateMonthly}}- Monthly Cash Burn Rate: {{{cashBurnRateMonthly}}} USD (Optional, positive if cash flow positive){{/if}}
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

Analysis Instructions:
Your analysis should be detailed and professional, covering:
1.  **Overall Valuation Rationale**: Explain the primary drivers for the estimated valuation range. Refer to the company by its name if provided.
2.  **Impact of Key Metrics**:
    *   **ARR Size & Growth**: Contextualize ARR. Analyze current growth (New Business vs. Expansion) and NRR. If historical data is provided, discuss growth trends, consistency, and trajectory. High, efficient, and sustainable growth (strong NRR, good expansion) is critical.
    *   **Profitability & Margins**: Discuss gross margin. If COGS provided, link it. Analyze operating margins considering S&M, R&D, G&A spend percentages. If EBITDA provided, evaluate its level (positive, negative, breakeven) and implications for cash flow, sustainability, and scalability. Strong margins relative to growth stage are highly valued.
    *   **Unit Economics & Customer Health**: Evaluate CAC, LTV/CAC ratio, and churn rate. If total customers provided, calculate ARR per customer. If CAC by channel or cohort analysis provided, comment on acquisition efficiency and customer value trends. Healthy unit economics (LTV/CAC > 3, low churn) are vital.
    *   **Pricing & Sales Efficiency**: If pricing tiers, average deal size, contract length, or sales cycle provided, comment on their implications for revenue predictability, customer stickiness, and sales motion efficiency.
    *   **Team & Operational Scale**: If employee data provided (total, sales, marketing, R&D), comment on operational leverage, efficiency (e.g., ARR per employee), and capacity for growth.
    *   **Capital Position & Efficiency**: If cash burn, runway, debt, or equity structure details provided, discuss financial health, runway risk, impact of debt on valuation, and potential implications of equity structure (e.g., liquidation preferences).
    *   **Product Engagement**: If DAU/MAU or feature adoption rates provided, comment on user engagement and product stickiness.
    *   **Contextual Factors**: Briefly discuss how funding stage, industry vertical, target market, and geographic concentration might influence valuation expectations and applicable multiples.
3.  **Valuation Multiples**: Calculate and include the implied ARR multiple (Average Valuation / ARR). Discuss typical ARR multiples for companies with similar profiles (considering all provided data points: growth, profitability, market, etc.) to justify this multiple. Explain how the detailed financial and operational picture might affect this multiple compared to a simple ARR-based view.
4.  **Strengths & Weaknesses**: Explicitly list 2-3 key strengths and 2-3 key weaknesses derived from the input data that significantly influence the valuation.

Output Format:
Format your output as a JSON object with the following keys: lowValuation, highValuation, averageValuation, impliedARRMultiple, analysis. All currency values should be in USD. The impliedARRMultiple should be a number. The analysis should be a comprehensive, well-structured string.
`,
});

const valuationEstimationFlow = ai.defineFlow(
  {
    name: 'valuationEstimationFlow',
    inputSchema: ValuationEstimationInputSchema,
    outputSchema: ValuationEstimationOutputSchema,
  },
  async input => {
    // Basic input validation or transformation can happen here if needed
    // For example, ensuring historicalFinancials is an array if passed.
    const augmentedInput = {
      ...input,
      historicalFinancials: input.historicalFinancials || [], // Ensure it's an array
    };

    const {output} = await valuationEstimationPrompt(augmentedInput);
    if (!output) {
      throw new Error('The AI failed to generate a valuation estimation.');
    }
    
    if (output.averageValuation && input.arr && (output.impliedARRMultiple === undefined || output.impliedARRMultiple === null || isNaN(output.impliedARRMultiple))) {
        output.impliedARRMultiple = input.arr !== 0 ? parseFloat((output.averageValuation / input.arr).toFixed(2)) : 0;
    } else if (output.impliedARRMultiple) {
        output.impliedARRMultiple = parseFloat(output.impliedARRMultiple.toFixed(2));
    }
    return output;
  }
);
