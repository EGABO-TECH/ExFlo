import { motion } from "framer-motion";
import { Globe, ShieldCheck, Zap } from "lucide-react";

const StatsSection = () => {
  const stats = [
    { label: "Countries", value: "190+", icon: Globe, color: "text-blue-400" },
    { label: "Uptime", value: "99.9%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "Re-plan Time", value: "<2s", icon: Zap, color: "text-purple-400" }
  ];

  return (
    <section className="py-20 border-y border-border/50 bg-card/10 backdrop-blur-sm">
      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <stat.icon className={`h-8 w-8 mb-4 ${stat.color} opacity-80`} />
              <div className="font-display text-5xl font-bold tracking-tighter mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
