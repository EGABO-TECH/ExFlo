import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-background/50">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-3">
          <img src="/ExFlo/logo.png" alt="ExFlo Logo" className="h-6 w-auto" />
          <span className="font-display text-lg font-bold tracking-tight">
            Ex<span className="text-gradient-primary">Flo</span>
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground font-medium text-center md:text-right">
          © 2026 ExFlo. The Agentic AI Ecosystem for Travel.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
