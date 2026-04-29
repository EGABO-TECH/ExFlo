import { motion, AnimatePresence } from "framer-motion";
import { Plane, Hotel, MapPin, X, CreditCard, Wallet, CheckCircle2 } from "lucide-react";

interface ItineraryItem {
  type: 'flight' | 'hotel' | 'activity';
  title: string;
  details: string;
  price: number;
}

export const CheckoutModal = ({ items, total, onConfirm, onClose }: { items: ItineraryItem[], total: number, onConfirm: () => void, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-[#0B0F1A] border border-slate-800 rounded-[32px] md:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
            <X className="h-8 w-8" />
        </button>

        {/* Left Side: Review */}
        <div className="flex-1 p-8 md:p-14 md:overflow-y-auto border-b md:border-b-0 md:border-r border-slate-800/50">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">One-Booking Checkout</h2>
          <p className="text-slate-400 font-medium mb-12">Review your complete Flow and book everything at once.</p>

          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-900/30 border border-slate-800/30">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    {item.type === 'flight' && <Plane className="h-6 w-6" />}
                    {item.type === 'hotel' && <Hotel className="h-6 w-6" />}
                    {item.type === 'activity' && <MapPin className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xl mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.details}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-cyan-400 tracking-tight">${item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Payment */}
        <div className="w-full md:w-[400px] bg-slate-900/20 p-8 md:p-14 flex flex-col justify-between md:overflow-y-auto shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white mb-8">Summary</h3>
            <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">{item.title}</span>
                        <span className="text-slate-300 font-bold">${item.price}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-slate-800 mb-12">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-3xl font-display font-bold text-cyan-400">${total}</span>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Financial Orchestration</h3>
            <div className="space-y-4 mb-10">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-white text-sm">Regional Excellence</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Instant settlement via MTN MoMo or Airtel Money for local convenience.
                    </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-cyan-500/50 bg-cyan-500/10 text-white cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <CreditCard className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-sm">International Standards</span>
                    </div>
                    <p className="text-[10px] text-cyan-200/50 leading-relaxed">
                        Secured with world-class encryption via Stripe or PayPal.
                    </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Wallet className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-white text-sm">Web3 & Cross-Border</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Optimized conversion path via MiniPay or Wise.
                    </p>
                </div>
            </div>
          </div>

          <button 
            onClick={onConfirm}
            className="w-full bg-cyan-500 text-slate-900 py-6 rounded-[22px] font-black text-lg shadow-2xl shadow-cyan-500/20 hover:bg-cyan-400 hover:scale-[1.01] transition-all active:scale-[0.98]"
          >
            Confirm & Book — ${total}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
