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
  growthRate: z.number().describe('Year-over-year growth rate (as a decimal).'),
  churnRate: z.number().describe('Annual churn rate (as a decimal).'),
  grossMargin: z.number().describe('Gross margin (as a decimal).'),
});
export type ValuationEstimationInput = z.infer<typeof ValuationEstimationInputSchema>;

const ValuationEstimationOutputSchema = z.object({
  lowValuation: z.number().describe('Low end of the estimated valuation range in USD.'),
  highValuation: z.number().describe('High end of the estimated valuation range in USD.'),
  averageValuation: z.number().describe('Average of the estimated valuation range in USD.'),
  analysis: z.string().describe('Qualitative analysis supporting the valuation range.'),
});
export type ValuationEstimationOutput = z.infer<typeof ValuationEstimationOutputSchema>;

export async function valuationEstimation(input: ValuationEstimationInput): Promise<ValuationEstimationOutput> {
  return valuationEstimationFlow(input);
}

const valuationEstimationPrompt = ai.definePrompt({
  name: 'valuationEstimationPrompt',
  input: {schema: ValuationEstimationInputSchema},
  output: {schema: ValuationEstimationOutputSchema},
  prompt: `You are an expert in SaaS company valuation. Given the following metrics, estimate a valuation range (low, high, and average) for the company in USD. Also, provide a brief qualitative analysis supporting your valuation range.

ARR: {{{arr}}}
Growth Rate: {{{growthRate}}}
Churn Rate: {{{churnRate}}}
Gross Margin: {{{grossMargin}}}

Format your output as a JSON object with the following keys: lowValuation, highValuation, averageValuation, analysis. All currency values should be in USD.
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
    return output!;
  }
);
