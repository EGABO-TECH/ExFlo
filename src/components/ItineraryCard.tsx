import { motion } from "framer-motion";
import { Plane, Hotel, MapPin, Search } from "lucide-react";

interface ItineraryItem {
  type: 'flight' | 'hotel' | 'activity';
  title: string;
  details: string;
  price: number;
  image?: string;
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
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all relative overflow-hidden group/item ${
                item.image ? "bg-slate-900 border-slate-800" : "bg-slate-900/50 border-slate-800/50 hover:border-cyan-500/30"
            }`}
          >
            {/* Rich Media Background Glow Layer */}
            {item.image && (
                <div 
                    className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none transition-transform duration-700 group-hover/item:scale-105 group-hover/item:opacity-30" 
                    style={{ backgroundImage: `url(${item.image})` }}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 pointer-events-none" />

            <div className="flex items-center gap-5 relative z-10 w-full pl-2">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 shrink-0 backdrop-blur-md">
                {item.type === 'flight' && <Plane className="h-5 w-5" />}
                {item.type === 'hotel' && <Hotel className="h-5 w-5" />}
                {item.type === 'activity' && <MapPin className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-100 text-lg drop-shadow-md">{item.title}</h4>
                <p className="text-sm text-slate-300 font-medium drop-shadow-md">{item.details}</p>
              </div>
              
              {/* Rich Media Image Display */}
              {item.image && (
                  <div className="hidden sm:block h-14 w-24 rounded-lg overflow-hidden shrink-0 border border-slate-700 shadow-xl ml-4 mr-4">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                  </div>
              )}

              <div className="text-xl font-bold text-cyan-400 tracking-tight ml-auto text-right min-w-[80px]">
                ${item.price}
              </div>
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
