import { MapPin, Calendar, CreditCard, Activity, Leaf, Zap, Globe, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Trips() {
  const stats = [
    { label: "AI Planning Time", value: "14m", sub: "Saved 6h manual search", icon: Clock, color: "text-blue-400" },
    { label: "Carbon Offset", value: "240kg", sub: "Verified BlueCarbon", icon: Leaf, color: "text-emerald-400" },
    { label: "Network Rewards", value: "85 ExF", sub: "Stake: 1,200 EXF", icon: Zap, color: "text-purple-400" }
  ];

  const trips = [
    {
      destination: "Uganda Safari",
      dates: "Oct 12 – Oct 17, 2026",
      cost: "1,450 cUSD",
      status: "active",
      agents: ["SkyFlow", "StayBot", "LocalGuide"]
    },
    {
      destination: "Murchison Falls (Reserve)",
      dates: "Oct 12 – Oct 17, 2026",
      cost: "1,450 cUSD",
      status: "pending_payment",
      id: "RES-UG991",
      agents: ["SkyFlow", "StayBot", "LocalGuide"]
    },
    {
      destination: "Tokyo, Japan",
      dates: "Apr 15 – Apr 22, 2026",
      cost: "$2,840",
      status: "active",
      id: "TRP-TYO10",
      agents: ["SkyFlow", "StayBot"]
    },
    {
      destination: "Barcelona, Spain",
      dates: "May 10 – May 16, 2026",
      cost: "$1,920",
      status: "upcoming",
      id: "TRP-BCN04",
      agents: ["SkyFlow"]
    },
    {
      destination: "Bali, Indonesia",
      dates: "Feb 1 – Feb 10, 2026",
      cost: "$2,150",
      status: "completed",
      id: "TRP-BAL88",
      agents: ["SkyFlow", "StayBot", "LocalGuide"]
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="font-display text-5xl font-bold mb-3 tracking-tighter">Journey Discovery</h1>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Multi-Agent Orchestration Active Across 4 Nodes.
          </p>
        </div>
        <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-border/50 bg-card/40 text-xs font-bold hover:bg-card/60 transition-all">Export Itineraries</button>
            <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 glow-primary transition-all flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> Optimize Upcoming
            </button>
        </div>
      </div>

      {/* Hero Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-xl relative overflow-hidden group hover:border-primary/20 transition-all"
            >
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <stat.icon className="h-32 w-32" />
                </div>
                <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-4xl font-display font-bold mb-1 tracking-tight">{stat.value}</div>
                <div className="text-[11px] font-medium text-muted-foreground/60">{stat.sub}</div>
            </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <h3 className="font-display text-2xl font-bold px-2 flex items-center gap-3 italic">
            Active Flows <span className="h-px flex-1 bg-border/30" />
        </h3>
        <div className="grid grid-cols-1 gap-6">
            {trips.map((trip, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[32px] border border-border/40 bg-card/40 backdrop-blur-xl p-10 transition-all hover:bg-card/50 hover:border-primary/20 shadow-sm overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-700">
                    <Globe className="h-40 w-40" />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                <div className="flex items-start gap-8">
                    <div className="h-16 w-16 rounded-[22px] bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-colors shadow-lg">
                    <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-display text-3xl font-bold text-foreground tracking-tight">
                            {trip.destination}
                        </h3>
                        <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${
                            trip.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : trip.status === "upcoming"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : trip.status === "pending_payment"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-secondary/50 text-muted-foreground border-border/50"
                        }`}
                        >
                        {trip.status === "pending_payment" ? "Pending Payment" : trip.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-6 mt-4 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-primary/60" /> {trip.dates}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono opacity-50 bg-secondary/30 px-2 py-0.5 rounded uppercase tracking-wider">Node: {trip.id}</span>
                        </div>
                        <div className="flex gap-1.5 ml-2">
                            {trip.agents.map(a => (
                                <div key={a} className="h-5 w-5 rounded-full border border-border/50 bg-background flex items-center justify-center" title={a}>
                                    <Sparkles className="h-2 w-2 text-primary" />
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-12 pt-8 lg:pt-0 border-t lg:border-t-0 border-border/20">
                    <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2 opacity-50">{trip.status === 'pending_payment' ? 'Pending Settlement' : 'Authorized Cost'}</p>
                    <p className="text-3xl font-display font-bold text-foreground leading-none">{trip.cost}</p>
                    </div>
                    {trip.status === 'pending_payment' ? (
                        <button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground border border-primary text-xs font-bold hover:opacity-90 shadow-lg glow-primary transition-all active:scale-95 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Finalize Payment
                        </button>
                    ) : (
                        <button className="h-14 px-8 rounded-2xl bg-secondary/50 border border-border/50 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group-hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] active:scale-95">
                            Action Center
                        </button>
                    )}
                </div>
                </div>
            </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
