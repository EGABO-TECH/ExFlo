import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, Activity, Shield, Cpu, Database, Network, MapPin, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { MiniPayService } from "../blockchain/minipay";
import { SmartEscrowService, EscrowDetails } from "../blockchain/escrow";
import { TripStore, FlowTrip } from "../store";
import { LocationVerifier } from "../components/LocationVerifier";

export default function Wallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);


  const [transactions, setTransactions] = useState<FlowTrip[]>([]);

  useEffect(() => {
      const load = () => setTransactions(TripStore.getTrips().reverse());
      load();
      window.addEventListener('exflo_trips_updated', load);
      return () => window.removeEventListener('exflo_trips_updated', load);
  }, []);

  const activeEscrow = transactions.find(t => t.status === "pending_payment");
  const destLat = activeEscrow ? activeEscrow.destinationLat : 2.2289;
  const destLon = activeEscrow ? activeEscrow.destinationLon : 31.6569;

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const accounts = await MiniPayService.connectWallet();
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (e) {
      console.error("Failed to connect MiniPay wallet. Using fallback mock address for testing.", e);
      setTimeout(() => setWalletAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"), 1000);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Externalized to LocationVerifier.tsx

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h1 className="font-display text-5xl font-bold mb-3 tracking-tighter">Verification Center</h1>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" /> Connected to MiniPay Mainnet • Layer 2 Verified
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {walletAddress ? (
            <div className="text-sm font-bold bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/30 shadow-sm flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="text-sm font-bold bg-primary text-primary-foreground px-6 py-2 rounded-full hover:scale-105 transition-all shadow-md disabled:opacity-50"
            >
              {isConnecting ? "Connecting MiniPay..." : "Connect MiniPay"}
            </button>
          )}
          <div className="flex bg-card/40 border border-border/50 rounded-2xl p-1 px-4 gap-6 items-center backdrop-blur-xl">
              <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Syncing</span>
              </div>
              <span className="text-xs font-mono text-primary font-bold">Block 14,892,109</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Main Wallet Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 rounded-[40px] bg-gradient-to-br from-[#0EA5E9]/20 via-background to-[#8B5CF6]/10 border border-primary/20 p-12 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 text-muted-foreground mb-8">
              <div className="h-12 w-12 rounded-[20px] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">Verified Liquidity</span>
                <p className="text-[10px] font-mono opacity-40">{walletAddress || "0x••••••••••••"}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 mb-10">
                <div className="font-display text-7xl font-bold tracking-tighter text-foreground leading-none">
                    $1,535.00
                </div>
                <div className="text-2xl font-medium text-muted-foreground/40 font-display">
                    ≈ 1,535 cUSD
                </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-border/20">
              <button className="flex-1 sm:flex-none flex items-center gap-3 bg-gradient-primary text-primary-foreground px-10 py-5 rounded-[22px] font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] justify-center">
                <Plus className="h-5 w-5" /> Top Up
              </button>
              <button className="flex-1 sm:flex-none flex items-center gap-3 bg-card/40 border border-border/50 text-foreground px-10 py-5 rounded-[22px] font-bold text-sm hover:bg-card/60 transition-all active:scale-[0.98] justify-center">
                <ArrowUpRight className="h-5 w-5 opacity-40" /> Transfer
              </button>
            </div>
          </div>
        </motion.div>

        {/* Feature Interaction Controls */}
        <div className="space-y-6">
            <div className="p-8 rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-xl transition-all">
                {activeEscrow ? (
                    <LocationVerifier 
                        bookingId={activeEscrow.id} 
                        onVerified={() => window.dispatchEvent(new Event('exflo_trips_updated'))} 
                    />
                ) : (
                    <div className="text-center text-muted-foreground font-medium py-12 flex flex-col items-center gap-4">
                        <Lock className="h-8 w-8 opacity-20" />
                        No pending escrows requiring presence verification at this time.
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h3 className="font-display text-2xl font-bold flex items-center gap-4 italic">
                <History className="h-6 w-6 text-primary" /> Audit Trail <span className="h-px w-32 bg-border/30 inline-block align-middle ml-2" />
            </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {transactions.map((tx) => (
            <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[32px] border border-border/40 bg-card/20 hover:bg-card/40 hover:border-primary/10 transition-all group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 ${
                  tx.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
                }`}>
                  {tx.status === 'active' ? <ArrowDownLeft className="h-7 w-7" /> : <ArrowUpRight className="h-7 w-7" />}
                </div>
                <div>
                  <p className="font-bold text-xl text-foreground tracking-tight mb-1">{tx.destination}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{tx.dates.split(' ')[0]}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-[10px] font-mono text-primary font-bold">TX {tx.txHash ? tx.txHash.slice(0,10) : 'Pending'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 border-border/20 pt-4 md:pt-0">
                <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${tx.status === 'pending_payment' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'pending_payment' ? 'text-amber-500' : 'text-emerald-500'}`}>{tx.status}</span>
                    </div>
                    <p className={`text-2xl font-display font-bold ${tx.status === 'active' ? 'text-emerald-500' : tx.status === 'pending_payment' ? 'text-foreground/60' : 'text-foreground'}`}>
                        {tx.amount} cUSD
                    </p>
                </div>
                <button className="h-10 w-10 rounded-xl bg-background border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shadow-sm">
                    <Database className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
