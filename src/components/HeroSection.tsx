import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-sm uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Powered by Agentic AI
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl text-foreground">
            Your <span className="text-gradient-primary">AI Pilot</span> for <br className="hidden sm:block" />
            Seamless Travel
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium px-4">
            ExFlo replaces static search engines with an autonomous orchestration layer 
            that plans, books, and coordinates entire journeys in a single Flow.
          </p>

          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center px-4">
            <button 
              onClick={() => navigate('/plan')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-10 py-5 text-lg font-bold text-primary-foreground transition-all hover:opacity-90 glow-primary active:scale-95"
            >
              Start Your Flow <ArrowRight className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate('/trips')}
              className="w-full sm:w-auto rounded-2xl border border-border/50 bg-secondary/30 px-10 py-5 text-lg font-bold text-foreground transition-all hover:bg-secondary/50 backdrop-blur-md active:scale-95"
            >
              View Demo Trips
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
