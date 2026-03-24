import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 backdrop-blur-xl bg-background/40"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/ExFlo/logo.png" alt="ExFlo Logo" className="h-8 w-auto" />
          <span className="font-display text-xl font-bold tracking-tight">
            Ex<span className="text-gradient-primary">Flo</span>
          </span>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/plan')} 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Plan a Trip
          </button>
          <button 
            onClick={() => navigate('/plan')}
            className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 glow-primary active:scale-95"
          >
            Start Your Flow
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
