import { Building2 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">MortgagePro</h1>
          <p className="text-sm text-muted-foreground">Professional Document Analysis Platform</p>
        </div>
      </div>
    </header>
  );
};