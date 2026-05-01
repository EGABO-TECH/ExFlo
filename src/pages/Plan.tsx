import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ShieldCheck, Sparkles, Plane, WifiOff } from "lucide-react";
import { JourneyRoadmap } from "../components/JourneyRoadmap";
import { ItineraryCard } from "../components/ItineraryCard";
import { CheckoutModal } from "../components/CheckoutModal";
import { FlowConfirmation } from "../components/FlowConfirmation";
import { FlightManifestCard } from "../components/FlightManifestCard";
import { useNavigate } from "react-router-dom";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────
type ManifestData = {
  type: "flight_manifest" | "hotel_briefing";
  origin?: string;
  destination?: string;
  city?: string;
  options: any[];
};

type Message = {
  role: "assistant" | "user";
  content: string;
  type?: "text" | "checkout" | "success";
  amount?: string;
  txId?: string;
  isStreaming?: boolean;
  roadmap?: any[];
  itinerary?: any;
  manifest?: ManifestData | null;
};

const BACKEND_URL = "http://localhost:8001";

// ──────────────────────────────────────────────
// TYPEWRITER HOOK
// ──────────────────────────────────────────────
const useTypewriter = (text: string, speed: number = 18, active: boolean = false) => {
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

// ──────────────────────────────────────────────
// CHAT BUBBLE
// ──────────────────────────────────────────────
const ChatBubble = ({
  msg,
  onSelectFlight,
  onSelectHotel,
}: {
  msg: Message;
  onSelectFlight: (opt: any) => void;
  onSelectHotel: (opt: any) => void;
}) => {
  const { displayedText, isDone } = useTypewriter(
    msg.content,
    15,
    msg.role === "assistant" && !!msg.isStreaming
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-5 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          msg.role === "assistant"
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-card text-muted-foreground border border-border/50"
        }`}
      >
        {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>

      {/* Bubble */}
      <div
        className={`rounded-2xl px-6 py-4 max-w-[88%] text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${
          msg.role === "assistant"
            ? "bg-card/50 text-foreground border border-border/40 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60"
            : "bg-primary text-primary-foreground shadow-lg shadow-primary/5 hover:opacity-95"
        }`}
      >
        {/* Message text — with typewriter for streaming */}
        <span className="whitespace-pre-wrap">
          {msg.role === "assistant" ? displayedText : msg.content}
        </span>
        {msg.role === "assistant" && !isDone && (
          <span className="inline-block w-1.5 h-4 bg-primary/40 ml-1 animate-pulse align-middle" />
        )}

        {/* On-chain verification badge */}
        {msg.type === "success" && isDone && (
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

        {/* Journey Roadmap */}
        {msg.roadmap && isDone && !msg.itinerary && (
          <JourneyRoadmap events={msg.roadmap} />
        )}

        {/* Itinerary Card */}
        {msg.itinerary && isDone && (
          <ItineraryCard
            items={msg.itinerary.items}
            total={msg.itinerary.total}
            onBook={() => msg.itinerary.onBook()}
          />
        )}

        {/* ✈️ Flight Manifest / Hotel Briefing Cards */}
        {msg.manifest && isDone && (
          <FlightManifestCard
            manifest={msg.manifest}
            onSelectFlight={onSelectFlight}
            onSelectHotel={onSelectHotel}
          />
        )}
      </div>
    </motion.div>
  );
};

// ──────────────────────────────────────────────
// PLAN PAGE
// ──────────────────────────────────────────────
export default function Plan() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to ExFlo. I am Ashley, your dedicated pilot. It is a pleasure to have you with us. How may I elevate your journey today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeStep, setActiveStep] = useState<"chat" | "checkout" | "confirmed">("chat");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [pendingItinerary, setPendingItinerary] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [orchestrationStatus, setOrchestrationStatus] = useState("Ashley Orchestrating");

  const statusInterval = useRef<NodeJS.Timeout | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showCheckoutModal]);

  useEffect(() => {
    return () => {
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, []);

  // ── Build itinerary from a selected flight ──
  const buildItineraryFromFlight = useCallback(
    (option: any) => ({
      items: [
        {
          type: "flight",
          title: `Flight: ${option.origin} → ${option.destination}`,
          details: `${option.airline} · ${option.duration} · ${option.tier} Class`,
          price: option.price,
        },
      ],
      total: option.price,
    }),
    []
  );

  const buildItineraryFromHotel = useCallback(
    (option: any) => ({
      items: [
        {
          type: "hotel",
          title: option.name,
          details: `${option.amenities?.join(" · ")} · ${option.tier} Tier`,
          price: option.price,
        },
      ],
      total: option.price,
    }),
    []
  );

  const handleBook = useCallback((itinerary: any) => {
    setPendingItinerary(itinerary);
    setShowCheckoutModal(true);
  }, []);

  const handleFinalConfirm = () => {
    setShowCheckoutModal(false);
    setActiveStep("confirmed");
  };

  // ── Flight selection from manifest card ──
  const handleSelectFlight = useCallback(
    (option: any) => {
      handleBook(buildItineraryFromFlight(option));
    },
    [handleBook, buildItineraryFromFlight]
  );

  // ── Hotel selection from briefing card ──
  const handleSelectHotel = useCallback(
    (option: any) => {
      handleBook(buildItineraryFromHotel(option));
    },
    [handleBook, buildItineraryFromHotel]
  );

  // ──────────────────────────────────────────────
  // SUBMIT — calls the live backend
  // ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setIsOffline(false);

    // Freeze previous streaming flags and append user message
    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, isStreaming: false })),
      { role: "user", content: userMsg },
    ]);
    setIsTyping(true);
    setOrchestrationStatus("Ashley Orchestrating");

    const statuses = [
      "Accessing Global Grids",
      "Scanning Flight Inventories",
      "Analyzing Best Value Flows",
      "Curating Hotel Briefings",
      "Synchronizing Agentic Loop"
    ];
    let sIdx = 0;
    statusInterval.current = setInterval(() => {
      sIdx = (sIdx + 1) % statuses.length;
      setOrchestrationStatus(statuses[sIdx]);
    }, 1800);

    // Build history for multi-turn memory (exclude manifest/roadmap blobs)
    const historyForApi = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: historyForApi }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (statusInterval.current) clearInterval(statusInterval.current);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          isStreaming: true,
          manifest: data.manifest ?? null,
        },
      ]);
    } catch (err) {
      console.error("Ashley backend unreachable:", err);
      if (statusInterval.current) clearInterval(statusInterval.current);
      setIsTyping(false);
      setIsOffline(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm encountering a disruption on the orchestration layer — it appears the ExFlo node is temporarily offline. Please ensure the backend is running and try again. I will be standing by. 🛡️",
          isStreaming: true,
        },
      ]);
    }
  };

  const suggestions = [
    "Fly from Nairobi to London on June 15th",
    "Find me a hotel in Tokyo",
    "Plan a 5-day Uganda Safari",
    "Flight from Dubai to Barcelona on July 20th",
  ];

  return (
    <div className="h-full flex flex-col bg-[#0A0A0B] relative overflow-hidden font-sans">
      {/* Ambient glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="h-16 flex items-center border-b border-border/10 px-6 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground leading-tight">Ashley</h1>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {isOffline ? (
                <>
                  <WifiOff className="h-2.5 w-2.5 text-amber-500" />
                  <span className="text-amber-500">Reconnecting…</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online — Ready to plan
                </>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-[380px] scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatBubble
                key={i}
                msg={msg}
                onSelectFlight={handleSelectFlight}
                onSelectHotel={handleSelectHotel}
              />
            ))}

            {/* Ashley Typing Indicator */}
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
                <div className="rounded-2xl px-6 py-4 bg-card/30 text-muted-foreground border border-border/40 backdrop-blur-sm flex flex-col gap-1.5 items-start min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80 min-w-[140px]">
                      {orchestrationStatus}
                    </span>
                  </div>
                  <div className="flex gap-2.5 mt-2">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Checkout Modal inline */}
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
                <FlowConfirmation onNavigate={() => navigate("/trips")} />
              )}
            </AnimatePresence>
          </AnimatePresence>

          <div className="h-40" />
          <div ref={endRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {/* Suggestion chips (show on first message only) */}
          {messages.length === 1 && !isTyping && (
            <div className="flex flex-wrap gap-2.5 mb-6 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-4 py-2 rounded-2xl border border-border/30 bg-card/50 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all backdrop-blur-xl shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input box */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[30px] opacity-0 group-focus-within:opacity-100 blur transition duration-500" />
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end gap-3 bg-card border border-border/60 rounded-[28px] p-2 pl-6 pr-2 shadow-2xl backdrop-blur-3xl overflow-hidden min-h-[64px]"
            >
              <textarea
                autoFocus
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                disabled={isTyping}
                placeholder="Tell me where you want to go…"
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
