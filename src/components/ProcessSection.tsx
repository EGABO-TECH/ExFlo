import { motion } from "framer-motion";

const ProcessSection = () => {
  const steps = [
    {
      id: "01",
      title: "Tell the Pilot",
      description: "Share your destination, dates, and any unique preferences."
    },
    {
      id: "02",
      title: "Review Your Flow",
      description: "Your AI Pilot crafts a full itinerary with flights, stays, and experiences."
    },
    {
      id: "03",
      title: "Book & Go",
      description: "One checkout, one confirmation. The Pilot monitors everything."
    }
  ];

  return (
    <section className="py-24 bg-secondary/10 relative overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md relative overflow-hidden group hover:border-primary/20 transition-all"
            >
              <div className="font-display text-4xl font-bold text-primary mb-6 animate-pulse-glow">
                {step.id}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
