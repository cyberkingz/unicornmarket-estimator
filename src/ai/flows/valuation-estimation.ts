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

const ValuationEstimationInputSchema = z.object({
  arr: z.number().describe('Annual Recurring Revenue (ARR) in USD.'),
  newBusinessARRGrowthRate: z.coerce.number().min(0).max(5).describe('Annual growth rate from new business (e.g., 0.25 for 25%).'),
  expansionARRGrowthRate: z.coerce.number().min(-1).max(5).describe('Annual growth rate from existing customer expansion/upsell (e.g., 0.1 for 10%). Can be negative for contraction.'),
  churnRate: z.number().describe('Annual churn rate (as a decimal, e.g., 0.05 for 5%).'),
  netRevenueRetention: z.coerce.number().min(0).max(3).describe('Net Revenue Retention (NRR) or Dollar-Based Net Expansion Rate (DBNER) as a decimal (e.g., 1.1 for 110%).'),
  grossMargin: z.number().describe('Gross margin (as a decimal, e.g., 0.8 for 80%).'),
  customerAcquisitionCost: z.coerce.number().positive().describe('Average Customer Acquisition Cost (CAC) in USD.'),
  ltvToCacRatio: z.coerce.number().positive().describe('Customer Lifetime Value (LTV) to CAC ratio (e.g., 3 for 3:1).'),
  salesMarketingSpendPercentage: z.coerce.number().min(0).max(1).describe('Sales & Marketing spend as a percentage of ARR (e.g., 0.4 for 40%).'),
  researchDevelopmentSpendPercentage: z.coerce.number().min(0).max(1).describe('Research & Development spend as a percentage of ARR (e.g., 0.2 for 20%).'),
  fundingStage: z.string().optional().describe('Current funding stage (e.g., Bootstrap, Seed, Series A, Growth Stage, Public).'),
  industryVertical: z.string().optional().describe('Primary industry vertical (e.g., FinTech, HealthTech, Enterprise SaaS, MarTech).'),
  targetMarket: z.string().optional().describe('Primary target market segment (e.g., SMB, Mid-Market, Enterprise).'),
});
export type ValuationEstimationInput = z.infer<typeof ValuationEstimationInputSchema>;

const ValuationEstimationOutputSchema = z.object({
  lowValuation: z.number().describe('Low end of the estimated valuation range in USD.'),
  highValuation: z.number().describe('High end of the estimated valuation range in USD.'),
  averageValuation: z.number().describe('Average of the estimated valuation range in USD.'),
  impliedARRMultiple: z.number().describe('Implied ARR multiple (Average Valuation / ARR).'),
  analysis: z.string().describe('Qualitative analysis supporting the valuation range, detailing how key metrics (ARR, growth components, NRR, margins, CAC, LTV/CAC, spend efficiency, funding stage, industry, market) contribute to the estimate. Discuss typical ranges and how the company\'s metrics compare.'),
});
export type ValuationEstimationOutput = z.infer<typeof ValuationEstimationOutputSchema>;

export async function valuationEstimation(input: ValuationEstimationInput): Promise<ValuationEstimationOutput> {
  return valuationEstimationFlow(input);
}

const valuationEstimationPrompt = ai.definePrompt({
  name: 'valuationEstimationPrompt',
  input: {schema: ValuationEstimationInputSchema},
  output: {schema: ValuationEstimationOutputSchema},
  prompt: `You are an expert in SaaS company valuation. Given the following detailed metrics, estimate a valuation range (low, high, and average) for the company in USD. Also, provide a comprehensive qualitative analysis supporting your valuation range and calculate the implied ARR multiple (Average Valuation / ARR).

Company Metrics:
- Annual Recurring Revenue (ARR): {{{arr}}} USD
- New Business ARR Growth Rate (annual): {{{newBusinessARRGrowthRate}}} (decimal, e.g., 0.25 for 25%)
- Expansion ARR Growth Rate (annual, from existing customers): {{{expansionARRGrowthRate}}} (decimal, e.g., 0.10 for 10%)
- Annual Churn Rate: {{{churnRate}}} (decimal, e.g., 0.05 for 5%)
- Net Revenue Retention (NRR/DBNER): {{{netRevenueRetention}}} (decimal, e.g., 1.1 for 110%)
- Gross Margin: {{{grossMargin}}} (decimal, e.g., 0.8 for 80%)
- Customer Acquisition Cost (CAC): {{{customerAcquisitionCost}}} USD
- LTV to CAC Ratio: {{{ltvToCacRatio}}} (e.g., 3 for 3:1)
- Sales & Marketing Spend (% of ARR): {{{salesMarketingSpendPercentage}}} (decimal, e.g., 0.4 for 40%)
- Research & Development Spend (% of ARR): {{{researchDevelopmentSpendPercentage}}} (decimal, e.g., 0.2 for 20%)
{{#if fundingStage}}- Funding Stage: {{{fundingStage}}}{{/if}}
{{#if industryVertical}}- Industry Vertical: {{{industryVertical}}}{{/if}}
{{#if targetMarket}}- Target Market: {{{targetMarket}}}{{/if}}

Analysis Instructions:
Your analysis should be detailed, covering:
1.  **Overall Valuation Rationale**: Explain the primary drivers for the estimated valuation range.
2.  **Impact of Key Metrics**:
    *   **ARR Size**: Contextualize the ARR.
    *   **Growth Dynamics**: Discuss the combined impact of new business vs. expansion ARR growth. Higher, more efficient growth (strong expansion) is positive.
    *   **Retention & Churn**: Analyze NRR and churn. NRR > 100% is a strong positive. High churn is a major risk.
    *   **Profitability**: Discuss gross margin. Higher is better.
    *   **Unit Economics**: Evaluate CAC and LTV/CAC ratio. A ratio > 3 is generally good. High CAC can be a concern.
    *   **Spend Efficiency**: Comment on S&M and R&D spend relative to growth and benchmarks.
    *   **Contextual Factors**: If provided, briefly discuss how funding stage, industry vertical, and target market might influence valuation expectations (e.g., high-growth tech verticals might command higher multiples).
3.  **Valuation Multiples**: Calculate and include the implied ARR multiple (Average Valuation / ARR). Briefly touch upon typical ARR multiples for companies with similar profiles, if possible, to justify this multiple.

Format your output as a JSON object with the following keys: lowValuation, highValuation, averageValuation, impliedARRMultiple, analysis. All currency values should be in USD. The impliedARRMultiple should be a number.
`,
});

const valuationEstimationFlow = ai.defineFlow(
  {
    name: 'valuationEstimationFlow',
    inputSchema: ValuationEstimationInputSchema,
    outputSchema: ValuationEstimationOutputSchema,
  },
  async input => {
    const {output} = await valuationEstimationPrompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a valuation estimation.');
    }
    // Ensure impliedARRMultiple is calculated if AI somehow misses it, though prompt asks for it.
    // This is a fallback, ideally the model returns it directly.
    if (output.averageValuation && input.arr && (output.impliedARRMultiple === undefined || output.impliedARRMultiple === null || isNaN(output.impliedARRMultiple))) {
        output.impliedARRMultiple = input.arr !== 0 ? output.averageValuation / input.arr : 0;
    }
    return output!;
  }
);

