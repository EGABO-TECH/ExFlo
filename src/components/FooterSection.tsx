const cofounders = [
  "ALIMPA ANNE HILLARY",
  "EGABO AARON",
  "NATOZO PATIENCE MARTHA",
  "NIWASIIMA ASHELYCOLE",
  "ONYANGO JOHN STEVEN",
  "RWOTHOMIO EVANS . E."
];

const FooterSection = () => {
  return (
    <footer className="border-t border-border/50 bg-secondary/10 py-16">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2">
          
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <img src="/logo.png" alt="ExFlo Logo" className="h-10 w-auto" />
              <span className="font-display text-2xl font-bold tracking-tight">
                Ex<span className="text-gradient-primary">Flo</span>
              </span>
            </div>
            <p className="max-w-md mx-auto lg:mx-0 text-sm text-muted-foreground">
              The agentic AI ecosystem revolutionizing global tourism through
              autonomous orchestration and decentralized payments.
            </p>
            <div className="flex justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="https://github.com/EGABO-TECH/ExFlo" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Community</a>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-center lg:text-right">
            <h4 className="font-display text-lg font-bold text-gradient-primary mb-2">
              Visionary Co-Founders
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
              {cofounders.map((name) => (
                <div key={name} className="flex flex-col items-center lg:items-end">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 mt-4">
              © 2026 ExFlo by EGABO-TECH. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
