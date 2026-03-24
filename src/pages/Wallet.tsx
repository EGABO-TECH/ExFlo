import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Wallet() {
  const transactions = [
    {
      title: "Murchison Falls Safari",
      date: "Mar 25, 2026",
      amount: "1,450 cUSD",
      type: "out",
      status: "Confirmed"
    },
    {
      title: "Flight to Tokyo",
      date: "Mar 15, 2026",
      amount: "$890.00",
      type: "out",
      status: "Confirmed"
    },
    {
      title: "Top-up via USDC",
      date: "Mar 14, 2026",
      amount: "+$2,000.00",
      type: "in",
      status: "Completed"
    },
    {
      title: "Park Hyatt Tokyo",
      date: "Mar 14, 2026",
      amount: "$1,540.00",
      type: "out",
      status: "Confirmed"
    },
    {
      title: "Top-up via cUSD",
      date: "Mar 10, 2026",
      amount: "+$1,500.00",
      type: "in",
      status: "Completed"
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold mb-3 tracking-tight">MiniPay Wallet</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your travel liquidity and authenticated on-chain transactions.
        </p>
      </div>

      {/* Balance Card - Refined Parity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] bg-gradient-to-br from-card/80 via-card/40 to-background border border-border/50 p-10 shadow-2xl relative overflow-hidden mb-16"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-10 justify-between items-start lg:items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <WalletIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest opacity-80">Available Balance</span>
            </div>
            <div className="flex items-baseline gap-4">
                <div className="font-display text-6xl font-bold tracking-tighter text-foreground">
                    $1,535.00
                </div>
                <div className="text-xl font-medium text-muted-foreground opacity-60 italic">
                    ≈ 1,535 cUSD
                </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">MiniPay Network Active</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground opacity-50">Addr: 0x82...fA12</span>
            </div>
          </div>
          
          <button className="flex items-center gap-3 bg-gradient-primary text-primary-foreground px-8 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] w-full lg:w-auto justify-center">
            <Plus className="h-5 w-5" /> Top Up Wallet
          </button>
        </div>
      </motion.div>

      {/* Transactions - Full Parity List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h3 className="font-display text-xl font-bold flex items-center gap-3">
                <History className="h-5 w-5 text-primary" /> Transaction History
            </h3>
            <button className="text-xs font-bold text-primary hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {transactions.map((tx, i) => (
            <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-6 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary uppercase'
                }`}>
                  {tx.type === 'in' ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-bold text-foreground tracking-tight">{tx.title}</p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">{tx.date} • {tx.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${tx.type === 'in' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.amount}
                </p>
                <span className="text-[10px] font-mono opacity-30">Confirmed</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
