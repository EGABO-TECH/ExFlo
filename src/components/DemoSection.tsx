import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Compass, ShieldCheck, CreditCard } from "lucide-react";

const DemoSection = () => {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "complete">("idle");
  const [step, setStep] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "confirming" | "paid">("pending");

  const steps = [
    "Initializing AI Pilot Agent...",
    "Scanning flights from Entebbe International Airport (EBB)...",
    "Checking availability at Kampala Serena Hotel & Chobe Safari Lodge...",
    "Drafting instant smart contracts on MiniPay...",
    "Flow Ready."
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setStatus("loading");
    setStep(0);
    setPaymentStatus("pending");

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
              placeholder="e.g., A 5-day safari to Murchison Falls using MiniPay..."
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
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2">Uganda Safari Experience</h3>
                      <p className="text-muted-foreground">Oct 12 - Oct 17 • 2 Travelers • Murchison Falls</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gradient-primary">1,450 cUSD</div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                        <ShieldCheck className="h-3 w-3 text-primary" /> Multi-Provider Quote
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-xl">✈️</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Uganda Airlines Flight UR402</h4>
                        <p className="text-xs text-muted-foreground mt-1">Arrival at Entebbe International (EBB) • 14:00 EAT</p>
                      </div>
                      <div className="text-primary text-sm font-medium">Reserved</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-xl">🏨</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Chobe Safari Lodge</h4>
                        <p className="text-xs text-muted-foreground mt-1">3 Nights • River View Safari Tent • All Meals Included</p>
                      </div>
                      <div className="text-primary text-sm font-medium">Reserved</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-xl">🚙</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Murchison Falls Game Drive</h4>
                        <p className="text-xs text-muted-foreground mt-1">Guided 4x4 Tour • Includes Park Entrance Fees</p>
                      </div>
                      <div className="text-primary text-sm font-medium">Reserved</div>
                    </div>
                  </div>

                  {paymentStatus === "pending" && (
                    <button 
                      onClick={() => setPaymentStatus("confirming")}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-primary text-primary-foreground py-4 font-bold transition-all hover:opacity-90 glow-primary"
                    >
                      <CreditCard className="h-5 w-5" />
                      Pay 1,450 cUSD with MiniPay
                    </button>
                  )}

                  {paymentStatus === "confirming" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-primary bg-background/80 p-6 text-center shadow-lg backdrop-blur-md"
                    >
                      <h4 className="text-lg font-bold mb-2">Approve Transaction?</h4>
                      <p className="text-sm text-muted-foreground mb-6">You are about to securely transfer 1,450 cUSD using MiniPay. This will automatically execute the smart contracts to finalize your bookings.</p>
                      <div className="flex gap-4 justify-center">
                        <button 
                          onClick={() => setPaymentStatus("pending")}
                          className="px-6 py-2 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => setPaymentStatus("paid")}
                          className="px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors text-sm font-bold flex items-center gap-2"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Agree & Pay
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {paymentStatus === "paid" && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-lg bg-green-500/10 border border-green-500/20 p-6 text-center"
                    >
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h4 className="text-xl font-bold text-green-500 mb-1">Payment Successful!</h4>
                      <p className="text-sm text-muted-foreground">Smart contracts executed. Your Flow is securely booked and recorded on-chain.</p>
                    </motion.div>
                  )}

                  {paymentStatus !== "confirming" && (
                    <button 
                      onClick={() => {
                        setPrompt("");
                        setStatus("idle");
                        setStep(0);
                        setPaymentStatus("pending");
                      }}
                      className="mt-6 w-full rounded-lg border border-border text-muted-foreground hover:text-foreground py-3 font-medium transition-all hover:bg-secondary/50"
                    >
                      Reset & Plan another trip
                    </button>
                  )}
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
