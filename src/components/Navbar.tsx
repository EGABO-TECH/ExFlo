import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ExFlo Logo" className="h-10 w-auto" />
          <span className="font-display text-2xl font-bold tracking-tight">
            Ex<span className="text-gradient-primary">Flo</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["AI Pilot", "MiniPay", "Architecture", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <button className="rounded-lg bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary">
          Get Started
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
