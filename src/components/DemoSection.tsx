import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Compass, ShieldCheck } from "lucide-react";

const DemoSection = () => {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "complete">("idle");
  const [step, setStep] = useState(0);

  const steps = [
    "Initializing AI Pilot Agent...",
    "Scanning 5,200 global flights and 12,000 hotels...",
    "Drafting instant smart contracts on MiniPay...",
    "Flow Ready."
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setStatus("loading");
    setStep(0);

    // Simulate agentic steps
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setStatus("complete");
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <section id="demo-section" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Test the <span className="text-gradient-primary">One-Booking Engine</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Experience the power of our agentic orchestration. Just tell the AI Pilot where you want to go.
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="e.g., A 5-day spiritual retreat to Kyoto, using MiniPay..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-xl border border-border bg-background px-5 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || !prompt}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Flow
                </>
              )}
            </button>
          </form>

          <div className="mt-12 min-h-[200px]">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-muted-foreground/50 h-full py-10"
                >
                  <Compass className="h-16 w-16 mb-4 opacity-20" />
                  <p>Awaiting your destination prompt...</p>
                </motion.div>
              )}

              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 py-6"
                >
                  {steps.map((text, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: index <= step ? 1 : 0.3,
                        x: 0,
                      }}
                      className="flex items-center gap-4"
                    >
                      {index < step ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : index === step ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted" />
                      )}
                      <span className={`text-lg transition-colors ${index === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {status === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2">Tokyo Spiritual Retreat</h3>
                      <p className="text-muted-foreground">Oct 12 - Oct 17 • 2 Travelers • Premium Economy</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gradient-primary">1,450 cUSD</div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                        <ShieldCheck className="h-3 w-3 text-primary" /> Settled via MiniPay
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-xl">✈️</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">ANA Airways Flight 802</h4>
                        <p className="text-xs text-muted-foreground mt-1">Direct • 11h 20m</p>
                      </div>
                      <div className="text-primary text-sm font-medium">Booked</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-xl">🏨</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Aman Tokyo Hotel</h4>
                        <p className="text-xs text-muted-foreground mt-1">5 Nights • Breakfast Included</p>
                      </div>
                      <div className="text-primary text-sm font-medium">Booked</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPrompt("");
                      setStatus("idle");
                      setStep(0);
                    }}
                    className="mt-8 w-full rounded-lg border border-primary/50 text-primary py-3 font-medium transition-all hover:bg-primary/10"
                  >
                    Generate another flow
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
