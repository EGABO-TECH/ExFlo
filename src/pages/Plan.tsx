import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ShieldCheck, Sparkles, Plane, SendHorizontal, CreditCard, CheckCircle2, MapPin } from "lucide-react";
import { JourneyRoadmap } from "../components/JourneyRoadmap";
import { ItineraryCard } from "../components/ItineraryCard";
import { CheckoutModal } from "../components/CheckoutModal";
import { FlowConfirmation } from "../components/FlowConfirmation";
import { useNavigate } from "react-router-dom";

type Message = {
  role: "assistant" | "user";
  content: string;
  type?: "text" | "checkout" | "success";
  amount?: string;
  txId?: string;
  isStreaming?: boolean;
  roadmap?: any[];
  itinerary?: any;
};

// Custom Typewriter Hook
const useTypewriter = (text: string, speed: number = 20, active: boolean = false) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    setDisplayedText("");
    setIsDone(false);
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, active]);

  return { displayedText, isDone };
};

const ChatBubble = ({ msg, isLast }: { msg: Message, isLast: boolean }) => {
  const { displayedText, isDone } = useTypewriter(msg.content, 15, msg.role === "assistant" && !!msg.isStreaming);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-5 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-primary/10 text-primary border border-primary/20" : "bg-card text-muted-foreground border border-border/50"
        }`}>
        {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <div className={`rounded-2xl px-6 py-4 max-w-[85%] text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${msg.role === "assistant"
          ? "bg-card/50 text-foreground border border-border/40 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60"
          : "bg-primary text-primary-foreground shadow-lg shadow-primary/5 hover:opacity-95"
        }`}>
        {msg.role === "assistant" ? displayedText : msg.content}
        {msg.role === "assistant" && !isDone && <span className="inline-block w-1.5 h-4 bg-primary/40 ml-1 animate-pulse align-middle" />}

        {msg.type === 'success' && isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
          >
            <div className="flex items-center gap-2 mb-1 opacity-70">
              <ShieldCheck className="h-3 w-3" /> ON-CHAIN VERIFIED
            </div>
            TX: {msg.txId}
          </motion.div>
        )}

        {msg.roadmap && isDone && !msg.itinerary && (
          <JourneyRoadmap events={msg.roadmap} />
        )}

        {msg.itinerary && isDone && (
            <ItineraryCard 
                items={msg.itinerary.items} 
                total={msg.itinerary.total} 
                onBook={() => msg.itinerary.onBook()} 
            />
        )}
      </div>
    </motion.div>
  );
};

export default function Plan() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Pilot. Where would you like to go? Tell me your destination, dates, and any preferences.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeStep, setActiveStep] = useState<"chat" | "checkout" | "confirmed">("chat");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [pendingItinerary, setPendingItinerary] = useState<any>(null);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showCheckoutModal]);

  const handleBook = (itinerary: any) => {
    setPendingItinerary(itinerary);
    setShowCheckoutModal(true);
  };

  const handleFinalConfirm = () => {
    setShowCheckoutModal(false);
    setActiveStep("confirmed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev.map(m => ({ ...m, isStreaming: false })), { role: "user", content: userMsg }]);
    setIsTyping(true);

    const isUganda = userMsg.toLowerCase().includes("uganda") || userMsg.toLowerCase().includes("safari") || userMsg.toLowerCase().includes("entebbe");

    // Ultimate Multi-Agent Orchestration Logic
    setTimeout(() => {
      setIsTyping(false);
      
      const response1 = isUganda 
        ? "SkyFlow Agent initializing Uganda Protocol. Scanning Entebbe International (EBB) flight corridor and StayBot verifying Serena Hotel suites..."
        : "Agentic Cluster initializing. Global orchestration layer scanning multi-modal logistics for your Flow...";
      
      setMessages((prev) => [...prev, { role: "assistant", content: response1, isStreaming: true }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        const itinerary = isUganda ? {
            items: [
                { type: 'flight', title: 'Flight to Murchison', details: 'Direct flight — 8h 30m • Day 1, 09:00', price: 680 },
                { type: 'hotel', title: 'Boutique Hotel', details: 'Deluxe Suite — 5 nights • Day 1 – Day 6', price: 950 },
                { type: 'activity', title: 'City Walking Tour', details: 'Guided 3-hour historical tour • Day 2, 10:00', price: 45 },
                { type: 'activity', title: 'Local Cuisine Experience', details: 'Food tasting with a local chef • Day 3, 19:00', price: 85 },
                { type: 'flight', title: 'Return Flight', details: 'Direct flight — 9h 10m • Day 6, 18:00', price: 620 }
            ],
            total: 2380,
            onBook: () => handleBook({
                items: [
                    { type: 'flight', title: 'Flight to Murchison', details: 'Direct flight — 8h 30m • Day 1, 09:00', price: 680 },
                    { type: 'hotel', title: 'Boutique Hotel', details: 'Deluxe Suite — 5 nights • Day 1 – Day 6', price: 950 },
                    { type: 'activity', title: 'City Walking Tour', details: 'Guided 3-hour historical tour • Day 2, 10:00', price: 45 },
                    { type: 'activity', title: 'Local Cuisine Experience', details: 'Food tasting with a local chef • Day 3, 19:00', price: 85 },
                    { type: 'flight', title: 'Return Flight', details: 'Direct flight — 9h 10m • Day 6, 18:00', price: 620 }
                ],
                total: 2380
            })
        } : null;

        const response2 = isUganda
          ? "Great choice! I've crafted a complete Flow for your trip. Here's your itinerary:"
          : "Flow convergence achieved. Logistics are locked and verified across the network. Review your personalized journey Roadmap below.";
        
        const roadmap = !isUganda ? [
            { type: 'flight', title: 'Global Route', details: 'Optimized flight path found with zero-friction connections.', agent: 'SKYFLOW' },
            { type: 'hotel', title: 'Premium Stay', details: 'Accommodation verified via verified network providers.', agent: 'STAYBOT' },
            { type: 'done', title: 'Ready for Flow', details: 'Agentic sequence complete.', agent: 'AI PILOT' }
        ] : null;

        setMessages((prev) => [
            ...prev.map((m, idx) => idx === prev.length - 1 ? { ...m, isStreaming: false } : m), 
            { role: "assistant", content: response2, isStreaming: true, roadmap: roadmap as any, itinerary: itinerary as any }
        ]);

      }, 3500);

    }, 1200);
  };

  const suggestions = [
    "Plan a 5-day Uganda Safari",
    "Tokyo Spiritual Retreat",
    "Beach vacation in Bali",
    "3-day trip to Barcelona"
  ];

  return (
    <div className="h-full flex flex-col bg-[#0A0A0B] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="h-16 flex items-center border-b border-border/10 px-6 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground leading-tight">AI Pilot</h1>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online — Ready to plan
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-[380px] scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} isLast={i === messages.length - 1} />
            ))}

            {isTyping && (
                <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-5 flex-row"
                >
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl px-6 py-4 bg-card/30 text-muted-foreground border border-border/40 backdrop-blur-sm flex flex-col gap-1.5 items-start min-w-[140px]">
                    <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80">Pilot Orchestrating</span>
                    </div>
                    <div className="flex gap-2.5 mt-2">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                    </div>
                </div>
                </motion.div>
            )}

            <AnimatePresence>
                {showCheckoutModal && pendingItinerary && (
                    <CheckoutModal 
                        items={pendingItinerary.items} 
                        total={pendingItinerary.total} 
                        onConfirm={handleFinalConfirm}
                        onClose={() => setShowCheckoutModal(false)}
                    />
                )}
                {activeStep === "confirmed" && (
                    <FlowConfirmation onNavigate={() => navigate('/trips')} />
                )}
            </AnimatePresence>
          </AnimatePresence>
          <div className="h-40" /> {/* Dedicated visibility spacer */}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input Container - Redesigned for Ergonomics */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {messages.length === 1 && !isTyping && (
            <div className="flex flex-wrap gap-2.5 mb-6 justify-center">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="px-4 py-2 rounded-2xl border border-border/30 bg-card/50 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all backdrop-blur-xl shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            {/* Glossy Wrapper */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[30px] opacity-0 group-focus-within:opacity-100 blur transition duration-500" />

            <form onSubmit={handleSubmit} className="relative flex items-end gap-3 bg-card border border-border/60 rounded-[28px] p-2 pl-6 pr-2 shadow-2xl backdrop-blur-3xl overflow-hidden min-h-[64px]">
              <textarea
                autoFocus
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                disabled={isTyping}
                placeholder="Tell me where you want to go..."
                className="flex-1 bg-transparent border-none outline-none py-3.5 text-[15px] resize-none max-h-32 text-foreground placeholder:text-muted-foreground/60 leading-relaxed scrollbar-hide"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-all glow-primary active:scale-90 shrink-0"
              >
                <Plane className="h-5 w-5 -rotate-45 relative right-[1px] bottom-[1px]" />
              </button>
            </form>
          </div>

          <p className="text-[9px] text-center text-muted-foreground/30 mt-5 uppercase tracking-[0.3em] font-bold">
            Agentic Protocol • Synchronized with EXFLO NODES
          </p>
        </div>
      </div>
    </div>
  );
}
