import { motion } from "framer-motion";
import { Plane, Hotel, MapPin, CheckCircle2, Navigation } from "lucide-react";

interface RoadmapEvent {
  type: 'flight' | 'hotel' | 'activity' | 'done';
  title: string;
  details: string;
  agent: string;
  time?: string;
}

export const JourneyRoadmap = ({ events }: { events: RoadmapEvent[] }) => {
  return (
    <div className="relative py-8 pl-8 pr-4 overflow-hidden bg-card/40 rounded-3xl border border-border/40 backdrop-blur-2xl shadow-2xl mt-6">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Navigation className="h-40 w-40" />
      </div>
      
      <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-emerald-500 rounded-full opacity-30 shadow-[0_0_10px_rgba(14,165,233,0.3)]" />

      <div className="space-y-10 relative z-10">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex gap-8 relative group"
          >
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative z-20 transition-transform group-hover:scale-110 ${
              event.type === 'flight' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              event.type === 'hotel' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              event.type === 'activity' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              'bg-primary/20 text-primary border border-primary/30'
            }`}>
                {event.type === 'flight' && <Plane className="h-4 w-4" />}
                {event.type === 'hotel' && <Hotel className="h-4 w-4" />}
                {event.type === 'activity' && <MapPin className="h-4 w-4" />}
                {event.type === 'done' && <CheckCircle2 className="h-4 w-4" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-display font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {event.title}
                </h4>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-primary/10 text-primary/70 border border-primary/10">
                    {event.agent}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80 decoration-primary/20 hover:opacity-100 transition-opacity">
                {event.details}
              </p>
              {event.time && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40">
                      <span>{event.time} UTC</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span>Verified Node</span>
                  </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
