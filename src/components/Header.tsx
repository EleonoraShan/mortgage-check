export const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <img 
          src="/valora-logo-simple.svg" 
          alt="Valora" 
          className="h-8 w-auto"
        />
        <div className="text-xs text-muted-foreground font-medium">
          Mortgage Intelligence
        </div>
      </div>
    </header>
  );
};