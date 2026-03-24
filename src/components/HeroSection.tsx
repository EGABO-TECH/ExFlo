import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-gradient-primary animate-pulse-glow" />
            Autonomous Travel Orchestration
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your Journey.{" "}
            <span className="text-gradient-primary">One Flow.</span>
            <br />
            Zero Friction.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            ExFlo replaces static search engines with an AI Pilot that plans,
            books, and coordinates your entire journey — from flights to hotels
            to crypto payments — in a single, seamless Flow.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-lg bg-gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary">
              Start Your Flow
            </button>
            <button className="rounded-lg border border-border bg-secondary/50 px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-secondary">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-8 border-t border-border/50 pt-10"
        >
          {[
            { value: "< 30s", label: "Full trip planning" },
            { value: "0.01%", label: "Transaction fees" },
            { value: "24/7", label: "Real-time monitoring" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-primary">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
