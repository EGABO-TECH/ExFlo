import { motion } from "framer-motion";
import { Plane, Clock, DollarSign, Zap, Gem, TrendingDown } from "lucide-react";

interface FlightOption {
  tier: "Prime" | "Economic" | "Elite";
  id: string;
  airline: string;
  price: number;
  currency: string;
  duration: string;
  origin: string;
  destination: string;
}

interface FlightManifestData {
  type: "flight_manifest";
  origin: string;
  destination: string;
  options: FlightOption[];
}

interface HotelOption {
  tier: "Prime" | "Economic" | "Elite";
  name: string;
  price: number;
  rating: number;
  amenities: string[];
}

interface HotelBriefingData {
  type: "hotel_briefing";
  city: string;
  options: HotelOption[];
}

type ManifestData = FlightManifestData | HotelBriefingData;

interface Props {
  manifest: ManifestData;
  onSelectFlight?: (option: FlightOption) => void;
  onSelectHotel?: (option: HotelOption) => void;
}

const TIER_CONFIG = {
  Prime: {
    icon: Zap,
    gradient: "from-sky-500/10 to-blue-600/5",
    border: "border-sky-500/30",
    accent: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    glow: "shadow-sky-500/10",
    label: "Balanced",
  },
  Economic: {
    icon: TrendingDown,
    gradient: "from-emerald-500/10 to-green-600/5",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "shadow-emerald-500/10",
    label: "Best Value",
  },
  Elite: {
    icon: Gem,
    gradient: "from-purple-500/10 to-violet-600/5",
    border: "border-purple-500/30",
    accent: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glow: "shadow-purple-500/10",
    label: "Fastest",
  },
};

export const FlightManifestCard = ({ manifest, onSelectFlight, onSelectHotel }: Props) => {
  if (manifest.type === "flight_manifest") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 space-y-3"
      >
        {/* Route Header */}
        <div className="flex items-center gap-3 px-1 mb-4">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/60">
            Flight Manifest
          </span>
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20 text-xs">
              {manifest.origin}
            </span>
            <Plane className="h-3.5 w-3.5 text-primary/60" />
            <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20 text-xs">
              {manifest.destination}
            </span>
          </div>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 gap-3">
          {manifest.options.map((option, i) => {
            const cfg = TIER_CONFIG[option.tier];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative rounded-2xl border bg-gradient-to-br ${cfg.gradient} ${cfg.border} p-5 shadow-lg ${cfg.glow} hover:shadow-xl transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${cfg.badge} border`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{option.tier}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-muted-foreground font-medium">{option.airline}</span>
                        <span className="text-[9px] text-muted-foreground/50">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground/50" />
                          <span className="text-[11px] text-muted-foreground">{option.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xl font-display font-black ${cfg.accent}`}>
                        ${option.price}
                      </div>
                      <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">
                        {option.currency}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectFlight?.(option)}
                      className={`h-9 px-4 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all active:scale-95 border ${cfg.badge} hover:opacity-80`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Hotel Briefing
  if (manifest.type === "hotel_briefing") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 space-y-3"
      >
        <div className="flex items-center gap-3 px-1 mb-4">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/60">
            Hotel Briefing
          </span>
          <span className="text-sm font-bold text-foreground">{manifest.city}</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {manifest.options.map((option, i) => {
            const cfg = TIER_CONFIG[option.tier];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative rounded-2xl border bg-gradient-to-br ${cfg.gradient} ${cfg.border} p-5 shadow-lg ${cfg.glow} hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${cfg.badge} border`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{option.name}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                          {option.tier}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {option.amenities.map(a => (
                          <span key={a} className="text-[9px] text-muted-foreground/60 bg-white/5 px-1.5 py-0.5 rounded-md border border-border/20">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xl font-display font-black ${cfg.accent}`}>${option.price}</div>
                      <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">/night</div>
                    </div>
                    <button
                      onClick={() => onSelectHotel?.(option)}
                      className={`h-9 px-4 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all active:scale-95 border ${cfg.badge} hover:opacity-80`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return null;
};
