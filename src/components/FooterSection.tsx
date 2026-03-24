const FooterSection = () => {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-primary" />
            <span className="font-display text-lg font-bold tracking-tight">
              Ex<span className="text-gradient-primary">Flo</span>
            </span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            The agentic AI ecosystem revolutionizing global tourism through
            autonomous orchestration and decentralized payments.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Community</a>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © 2026 ExFlo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
