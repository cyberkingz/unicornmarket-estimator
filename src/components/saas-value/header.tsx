import { Gem } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full max-w-4xl py-6 text-center border-b border-border/80">
      <div className="flex items-center justify-center space-x-3">
        <div className="p-3 bg-accent rounded-lg shadow-md">
           <Gem className="h-8 w-8 text-accent-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          SaaSValue
        </h1>
      </div>
      <p className="mt-3 text-lg text-muted-foreground">
        Estimate your SaaS company's valuation with AI-powered insights.
      </p>
    </header>
  );
}
