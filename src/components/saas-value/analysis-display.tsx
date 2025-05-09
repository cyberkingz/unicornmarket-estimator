import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

type AnalysisDisplayProps = {
  analysis: string;
};

// Helper function to sanitize HTML (basic example, consider a more robust library for production)
// For now, we'll trust the AI output or assume it's markdown-like that can be handled.
// A more robust solution might involve a markdown parser.
const processAnalysisText = (text: string) => {
  // Simple replacement for newlines to <br /> for basic paragraphing
  // And bolding for text between **...**
  let processedText = text
    .replace(/\n/g, '<br />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Assuming subheadings might be like "### Subheading" or "## Subheading" from AI
  // This is a very basic conversion, more robust markdown processing would be better.
  processedText = processedText.replace(/^#{2,3}\s*(.*?)(\r?\n|<br\s*\/?>)/gm, (match, p1) => {
      const headingLevel = match.startsWith('###') ? 'h4' : 'h3';
      return `<${headingLevel} class="text-lg font-semibold mt-4 mb-2 text-foreground/90">${p1.trim()}</${headingLevel}>`;
  });
  
  return processedText;
};


export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  // If the AI is expected to return structured HTML or markdown that needs specific parsing:
  // For now, we'll assume the analysis string might have newlines for paragraphs.
  // If it includes markdown for subheadings, more processing would be needed here or via a library.
  // The prompt asks for structured output with subheadings.
  // A simple approach is to trust AI to provide clean "pseudo-HTML" or use a markdown library.
  // For now, replacing newlines with <br /> and basic bolding.
  // And basic ## or ### to <h3> / <h4>
  const formattedAnalysis = processAnalysisText(analysis);


  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Lightbulb className="mr-2 h-7 w-7 text-accent" />
          Valuation Analysis
        </CardTitle>
        <CardDescription>Qualitative insights into the valuation estimation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-md leading-relaxed text-foreground/90 space-y-3" dangerouslySetInnerHTML={{ __html: formattedAnalysis }} />
      </CardContent>
    </Card>
  );
}
