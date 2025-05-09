import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

type AnalysisDisplayProps = {
  analysis: string;
};

export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
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
        <p className="text-md leading-relaxed text-foreground/90 whitespace-pre-line">{analysis}</p>
      </CardContent>
    </Card>
  );
}
