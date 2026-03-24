import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ShieldCheck, CreditCard, CheckCircle2, Loader2, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "assistant" | "user";
  content: string;
  type?: "text" | "checkout" | "success";
  amount?: string;
  txId?: string;
};

export default function Plan() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Pilot. Where would you like to go? Tell me your destination, dates, and any preferences.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "confirming" | "paid">("pending");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showCheckout]);

  const handleCheckout = () => {
    setPaymentStatus("confirming");
  };

  const handleFinalPayment = () => {
    setPaymentStatus("paid");
    setTimeout(() => {
        setMessages(prev => [...prev, {
            role: "assistant",
            content: "Payment successful! Your Uganda Safari Experience has been securely booked on-chain via MiniPay. You can view your itinerary in 'My Trips'.",
            type: "success",
            txId: "0x" + Math.random().toString(16).slice(2, 10).toUpperCase()
        }]);
        setShowCheckout(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    const isUganda = userMsg.toLowerCase().includes("uganda") || userMsg.toLowerCase().includes("safari") || userMsg.toLowerCase().includes("entebbe");

    // Realistic Agent Orchestration Logic
    setTimeout(() => {
      setIsTyping(false);
      
      const response1 = isUganda 
        ? "Excellent! I'm initializing the Uganda Tourism Protocol. Scanning flights from Entebbe International (EBB) and checking availability at Kampala Serena Hotel..."
        : "I'm orchestrating your Flow. Scanning global flight databases and premium accommodation providers for your journey...";
      
      setMessages((prev) => [...prev, { role: "assistant", content: response1 }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        const response2 = isUganda
          ? "I've locked in an exquisite 5-day itinerary: Flight UR402, 3 nights at Chobe Safari Lodge, and a private game drive in Murchison Falls. Everything is ready for checkout."
          : "I've optimized your itinerary for zero friction. Routes and stays are reserved. Would you like to proceed to secure this Flow via MiniPay?";
        
        setMessages((prev) => [...prev, { role: "assistant", content: response2 }]);

        if (isUganda) {
            setTimeout(() => {
                setShowCheckout(true);
            }, 800);
        }
      }, 2500);

    }, 1200);
  };

  const suggestions = [
      "Plan a 5-day Uganda Safari",
      "Tokyo Spiritual Retreat",
      "Beach vacation in Bali",
      "3-day trip to Barcelona"
  ];

  return (
    <div className="h-full flex flex-col bg-background/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="h-16 flex items-center border-b border-border/50 px-6 bg-card/30 backdrop-blur-sm sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground leading-tight">AI Pilot</h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
              Online — Ready to plan
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-40">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "assistant" ? "bg-primary/20 text-primary border border-primary/20" : "bg-secondary text-secondary-foreground border border-border"
                }`}>
                  {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] text-sm leading-relaxed ${
                  msg.role === "assistant" 
                    ? "bg-secondary/50 text-secondary-foreground rounded-tl-none border border-border/50 backdrop-blur-sm" 
                    : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10"
                }`}>
                  {msg.content}
                  {msg.type === 'success' && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">
                          TX: {msg.txId}
                      </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4 flex-row"
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-5 py-3.5 bg-secondary/50 text-secondary-foreground rounded-tl-none border border-border/50 flex flex-col gap-1 items-start">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-xs font-semibold text-primary/70">Pilot is Orchestrating...</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {showCheckout && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[400px] ml-12 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-xl p-6 shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <CreditCard className="h-20 w-20" />
                    </div>

                    <h4 className="font-display font-bold text-lg mb-4 text-foreground">Checkout via MiniPay</h4>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm py-2 border-b border-border/50">
                            <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" /> Uganda Safari</span>
                            <span className="font-semibold">1,450 cUSD</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            Smart contracts will be deployed to Entebbe International & Chobe Safari Lodge endpoints.
                        </p>
                    </div>

                    {paymentStatus === "pending" && (
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-gradient-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                        >
                            Pay 1,450 cUSD
                        </button>
                    )}

                    {paymentStatus === "confirming" && (
                        <div className="space-y-4">
                            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <p className="text-xs font-semibold text-primary mb-1">Confirm Transaction?</p>
                                <p className="text-[10px] text-muted-foreground">Approve payment out of your MiniPay Wallet.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setPaymentStatus("pending")} className="flex-1 py-2 rounded-lg border border-border text-xs font-medium hover:bg-secondary">Cancel</button>
                                <button onClick={handleFinalPayment} className="flex-1 py-2 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 flex items-center justify-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Agree & Pay
                                </button>
                            </div>
                        </div>
                    )}

                    {paymentStatus === "paid" && (
                        <div className="text-center py-2 text-emerald-500 font-bold flex items-center justify-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4" /> Transaction Authorized
                        </div>
                    )}
                </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {suggestions.map(s => (
                      <button 
                        key={s} 
                        onClick={() => { setInput(s); }}
                        className="px-3 py-1.5 rounded-full border border-border bg-card/30 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-primary transition-all backdrop-blur-sm"
                      >
                          {s}
                      </button>
                  ))}
              </div>
          )}
          <form onSubmit={handleSubmit} className="relative flex items-center group">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || showCheckout}
              placeholder="Tell me where you want to go..."
              className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur-xl px-6 py-4.5 pr-14 text-sm outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50 shadow-2xl placeholder:text-muted-foreground/70 disabled:opacity-50 border-primary/10 group-focus-within:border-primary/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || showCheckout}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4 mr-0.5" />
            </button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground/40 mt-3 uppercase tracking-widest font-medium">
             Agentic AI Tourism Protocol v1.0 • Built for EGABO-TECH
          </p>
        </div>
      </div>
    </div>
  );
}
