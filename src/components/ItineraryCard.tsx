import { motion } from "framer-motion";
import { Plane, Hotel, MapPin, Search } from "lucide-react";

interface ItineraryItem {
  type: 'flight' | 'hotel' | 'activity';
  title: string;
  details: string;
  price: number;
}

export const ItineraryCard = ({ items, total, onBook }: { items: ItineraryItem[], total: number, onBook: () => void }) => {
  return (
    <div className="w-full max-w-2xl bg-[#0F172A]/40 border border-slate-800 rounded-[32px] p-8 mt-6 shadow-2xl backdrop-blur-xl group">
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                {item.type === 'flight' && <Plane className="h-5 w-5" />}
                {item.type === 'hotel' && <Hotel className="h-5 w-5" />}
                {item.type === 'activity' && <MapPin className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-lg">{item.title}</h4>
                <p className="text-sm text-slate-400 font-medium">{item.details}</p>
              </div>
            </div>
            <div className="text-xl font-bold text-cyan-400 tracking-tight">
              ${item.price}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
        <div className="text-slate-400 font-medium text-lg">
          Total: <span className="text-2xl font-bold text-slate-100 ml-2">${total}</span>
        </div>
        <button 
          onClick={onBook}
          className="bg-cyan-500 text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/10"
        >
          Book This Flow
        </button>
      </div>
    </div>
  );
};
