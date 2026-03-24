import { motion } from "framer-motion";
import { Bot, Link, CreditCard } from "lucide-react";

export default function FeaturesSection() {
  const innovations = [
    {
      title: "AI Pilot",
      description: "Autonomous Execution",
      detail: "The Pilot doesn't just suggest; it executes complex travel maneuvers automatically.",
      icon: Bot,
      color: "bg-cyan-500/10 text-cyan-400"
    },
    {
      title: "One-Booking Engine",
      description: "Universal Connectors",
      detail: "Direct integration with global airline and hospitality APIs for frictionless booking.",
      icon: Link,
      color: "bg-purple-500/10 text-purple-400"
    },
    {
      title: "MiniPay Integration",
      description: "Celo Blockchain",
      detail: "Secure, stable payments via the Celo blockchain for transparent on-chain settlement.",
      icon: CreditCard,
      color: "bg-emerald-500/10 text-emerald-400"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
            Key <span className="text-gradient-primary">Innovations</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Three pillars that make ExFlo the future of travel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {innovations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border border-border/50 bg-card/20 backdrop-blur-sm group hover:border-primary/30 transition-all"
            >
              <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{item.title}</h3>
              <p className="text-xl font-bold mb-3">{item.description}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
