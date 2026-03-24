import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";

export default function Wallet() {
  const transactions = [
    {
      title: "Murchison Falls Safari",
      date: "Mar 25, 2026",
      amount: "1450 cUSD",
      type: "out",
    },
    {
      title: "Flight to Tokyo",
      date: "Mar 15, 2026",
      amount: "$890",
      type: "out",
    },
    {
      title: "Top-up via USDC",
      date: "Mar 14, 2026",
      amount: "+$2000",
      type: "in",
    },
    {
      title: "Park Hyatt Tokyo",
      date: "Mar 14, 2026",
      amount: "$1540",
      type: "out",
    },
    {
      title: "Top-up via cUSD",
      date: "Mar 10, 2026",
      amount: "+$1500",
      type: "in",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold mb-2">MiniPay Wallet</h1>
        <p className="text-muted-foreground text-sm">
          Manage your crypto balance for seamless travel payments.
        </p>
      </div>

      {/* Balance Card */}
      <div className="rounded-3xl bg-gradient-to-br from-card/80 to-background border border-border/50 p-8 shadow-xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end relative z-10">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <WalletIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Available Balance</span>
            </div>
            <div className="font-display text-5xl font-bold tracking-tight text-foreground">
              $1,535.00
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-muted-foreground">
              <span className="px-2 py-1 rounded bg-secondary">≈ 1,535 cUSD</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> MiniPay Network
              </span>
            </div>
          </div>
          
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity glow-primary w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" /> Top Up
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          Recent Transactions
        </h3>
        
        <div className="flex flex-col gap-3">
          {transactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/20 hover:bg-card/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {tx.type === 'in' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{tx.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tx.date}</p>
                </div>
              </div>
              <div className={`font-bold ${tx.type === 'in' ? 'text-emerald-500' : 'text-foreground'}`}>
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
