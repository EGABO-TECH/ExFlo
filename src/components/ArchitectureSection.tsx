import { motion } from "framer-motion";

const stack = [
  { component: "Frontend", tech: "Next.js / React", role: "Responsive & Fluid UX", color: "primary" },
  { component: "AI Engine", tech: "LangChain", role: "Agentic Loops & Decision Logic", color: "primary" },
  { component: "Blockchain", tech: "MiniPay", role: "Secure, Instant Transactions", color: "accent" },
  { component: "Storage", tech: "IPFS / Filecoin", role: "Decentralized Data Layer", color: "accent" },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-32 border-t border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Technical <span className="text-gradient-accent">Architecture</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A modular, future-proof stack built for scale and decentralization.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-4">
          {stack.map((s, i) => (
            <motion.div
              key={s.component}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex items-center gap-6 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
                  s.color === "primary"
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-gradient-accent text-accent-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-semibold text-foreground">
                    {s.component}
                  </span>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {s.tech}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
