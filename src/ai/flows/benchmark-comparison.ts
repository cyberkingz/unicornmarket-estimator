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
  arr: z.number().describe('Annual Recurring Revenue (ARR) in USD.'),
  growthRate: z.number().describe('Year-over-year growth rate (as a decimal, e.g., 0.3 for 30%).'),
  churnRate: z.number().describe('Annual churn rate (as a decimal, e.g., 0.1 for 10%).'),
  grossMargin: z.number().describe('Gross margin (as a decimal, e.g., 0.8 for 80%).'),
  estimatedAverageValuation: z.number().describe('The AI-estimated average valuation of the company in USD.'),
});
export type BenchmarkComparisonInput = z.infer<typeof BenchmarkComparisonInputSchema>;

const BenchmarkComparisonOutputSchema = z.object({
  benchmarkAnalysis: z.string().describe('A concise qualitative analysis comparing the company to typical industry benchmarks for key metrics (ARR, Growth, Churn, Gross Margin) and overall valuation. Mention if metrics are above, below, or in line with general expectations for a SaaS company with the given ARR, and how this impacts valuation.'),
  strengthAreas: z.array(z.string()).describe('A list of key strengths based on the benchmark comparison (e.g., "Growth rate significantly above average for ARR level").'),
  improvementAreas: z.array(z.string()).describe('A list of key areas for improvement based on the benchmark comparison (e.g., "Churn rate is higher than typical for well-performing SaaS companies").'),
});
export type BenchmarkComparisonOutput = z.infer<typeof BenchmarkComparisonOutputSchema>;

export async function benchmarkComparison(input: BenchmarkComparisonInput): Promise<BenchmarkComparisonOutput> {
  return benchmarkComparisonFlow(input);
}

const benchmarkComparisonPrompt = ai.definePrompt({
  name: 'benchmarkComparisonPrompt',
  input: {schema: BenchmarkComparisonInputSchema},
  output: {schema: BenchmarkComparisonOutputSchema},
  prompt: `You are a seasoned SaaS industry analyst. Your task is to provide a competitive benchmark analysis for a SaaS company based on the following metrics and its AI-estimated valuation.

Company Metrics:
- Annual Recurring Revenue (ARR): {{{arr}}} USD
- Year-over-Year Growth Rate: {{{growthRate}}} (decimal format)
- Annual Churn Rate: {{{churnRate}}} (decimal format)
- Gross Margin: {{{grossMargin}}} (decimal format)
- Estimated Average Valuation: {{{estimatedAverageValuation}}} USD

Instructions:
1.  **Overall Benchmark Analysis**: Provide a concise qualitative analysis comparing the company's key metrics (ARR size context, Growth Rate, Churn Rate, Gross Margin) and its estimated valuation against typical industry benchmarks for SaaS companies. For each metric, state whether it's generally considered strong, average, or an area for concern for a company of this ARR level. Explain how these factors collectively influence its valuation.
2.  **Strength Areas**: Identify 2-3 key strength areas. These should be metrics or aspects where the company performs notably well compared to general industry expectations.
3.  **Improvement Areas**: Identify 2-3 key areas where the company could improve relative to benchmarks. These should be actionable or highlight potential risks.

Focus on providing insights that would be valuable to founders or investors. Be realistic and acknowledge that benchmarks can vary. Base your analysis on general SaaS industry knowledge.

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
