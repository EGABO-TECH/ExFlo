import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FlowConfirmation = ({ onNavigate }: { onNavigate: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[500px] aspect-square bg-[#0B0F1A] border border-slate-800 rounded-[48px] flex flex-col items-center justify-center p-12 text-center shadow-2xl"
      >
        <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-8 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            <Check className="h-12 w-12 text-emerald-500" strokeWidth={3} />
        </div>

        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Flow Confirmed!</h2>
        <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12 max-w-[320px]">
            Your AI Pilot is now monitoring your trip. You'll receive real-time updates.
        </p>

        <button 
          onClick={onNavigate}
          className="w-full h-16 bg-cyan-500 text-slate-900 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/10"
        >
          View My Trips <ArrowRight className="h-6 w-6" />
        </button>
      </motion.div>
    </motion.div>
  );
};
