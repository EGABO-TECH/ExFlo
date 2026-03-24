import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Plan() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Pilot. Where would you like to go? Tell me your destination, dates, and any preferences.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    const isUganda = userMsg.toLowerCase().includes("uganda") || userMsg.toLowerCase().includes("safari");

    // Dynamic Agent Thinking Responses
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isUganda 
            ? "Splendid choice! Uganda is beautiful. I'm orchestrating your Flow. Scanning flights from Entebbe International Airport to find the perfect itinerary..."
            : "I'm orchestrating your Flow. Scanning thousands of global flights to find the optimal route for your destination...",
        },
      ]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Everything is aligned. I've drafted an instant smart contract for this journey.",
          },
        ]);
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: isUganda
                ? "Your booking at Kampala Serena Hotel and Chobe Safari Lodge is pending. You can review the details on your 'My Trips' dashboard or head to your 'Wallet' to settle the **1,450 cUSD** payment via MiniPay!"
                : "The trip is securely reserved. Please review the details on your 'My Trips' dashboard or visit your 'Wallet' to finalize the crypto payment via MiniPay when you're ready.",
            },
          ]);
        }, 1200);

      }, 2000);

    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-background/50 relative">
      <header className="h-16 flex items-center border-b border-border/50 px-6 bg-card/30 backdrop-blur-sm sticky top-0 z-10 shrink-0">
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

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
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
                  msg.role === "assistant" ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] text-sm leading-relaxed ${
                  msg.role === "assistant" 
                    ? "bg-secondary/50 text-secondary-foreground rounded-tl-none border border-border/50" 
                    : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                }`}>
                  {msg.content}
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
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-5 py-3.5 bg-secondary/50 text-secondary-foreground rounded-tl-none border border-border/50 flex flex-col gap-1 items-start">
                  <span className="text-xs font-semibold text-primary/70 animate-pulse">Pilot is Orchestrating...</span>
                  <div className="flex gap-1.5 mt-1">
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                     <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Tell me where you want to go..."
              className="w-full rounded-2xl border border-border bg-card/50 backdrop-blur-md px-6 py-4 pr-14 text-sm outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50 shadow-lg placeholder:text-muted-foreground/70 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4 mr-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
