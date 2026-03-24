import { motion } from "framer-motion";
import { Brain, Wallet, ShoppingCart } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "The AI Pilot",
    accent: true,
    description:
      "An autonomous agent that provides real-time trip monitoring and automated re-planning. Flight delayed? Booking failed? The Pilot triggers a re-planning loop instantly.",
    bullets: [
      "Agentic decision loops via LangChain",
      "Real-time disruption handling",
      "Context-aware re-routing",
    ],
  },
  {
    icon: Wallet,
    title: "MiniPay Integration",
    accent: false,
    description:
      "Native integration with the MiniPay ecosystem enables frictionless, low-fee cryptocurrency transactions for tourists worldwide.",
    bullets: [
      "Near-zero transaction fees",
      "Global accessibility",
      "Secure blockchain settlement",
    ],
  },
  {
    icon: ShoppingCart,
    title: "One-Booking Engine",
    accent: false,
    description:
      "A unified checkout system. No more jumping between 10 different tabs — ExFlo handles the entire transaction layer through a single orchestration point.",
    bullets: [
      "Single-click trip checkout",
      "Multi-provider aggregation",
      "Unified confirmation & receipts",
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FeaturesSection = () => {
  return (
    <section id="ai-pilot" className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Key <span className="text-gradient-primary">Innovations</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Three pillars that make ExFlo the definitive orchestration layer for
            global tourism.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group relative rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:glow-primary"
            >
              <div
                className={`mb-5 inline-flex rounded-lg p-3 ${
                  f.accent
                    ? "bg-gradient-primary"
                    : "bg-secondary"
                }`}
              >
                <f.icon
                  className={`h-6 w-6 ${
                    f.accent ? "text-primary-foreground" : "text-primary"
                  }`}
                />
              </div>

              <h3 className="font-display text-xl font-semibold mb-3">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {f.description}
              </p>

              <ul className="space-y-2">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-secondary-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
