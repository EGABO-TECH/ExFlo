import { MapPin, Calendar, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function Trips() {
  const trips = [
    {
      destination: "Uganda Safari",
      dates: "Oct 12 – Oct 17, 2026",
      cost: "1,450 cUSD",
      status: "active",
      id: "TRP-UG502"
    },
    {
      destination: "Tokyo, Japan",
      dates: "Apr 15 – Apr 22, 2026",
      cost: "$2,840",
      status: "active",
      id: "TRP-TYO10"
    },
    {
      destination: "Barcelona, Spain",
      dates: "May 10 – May 16, 2026",
      cost: "$1,920",
      status: "upcoming",
      id: "TRP-BCN04"
    },
    {
      destination: "Bali, Indonesia",
      dates: "Feb 1 – Feb 10, 2026",
      cost: "$2,150",
      status: "completed",
      id: "TRP-BAL88"
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold mb-3 tracking-tight">My Trips</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Your AI Pilot is monitoring all active journeys and upcoming Flows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {trips.map((trip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-[28px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all hover:bg-card/60 hover:border-primary/20 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display text-2xl font-bold text-foreground">
                        {trip.destination}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        trip.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : trip.status === "upcoming"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-secondary/50 text-muted-foreground border-border/50"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-5 mt-3 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary/60" /> {trip.dates}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono opacity-50">ID: {trip.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-10 pt-6 lg:pt-0 border-t lg:border-t-0 border-border/20">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Cost</p>
                  <p className="text-2xl font-display font-bold text-foreground">{trip.cost}</p>
                </div>
                <button className="h-12 px-6 rounded-xl bg-secondary/50 border border-border/50 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                    Manage Flow
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
