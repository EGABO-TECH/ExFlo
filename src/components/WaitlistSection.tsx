import { useState } from "react";
import { motion } from "framer-motion";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-32 border-t border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Join the <span className="text-gradient-primary">Waitlist</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Be among the first to experience autonomous travel. Early access
            opens soon.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 rounded-xl border border-primary/30 bg-card p-8 glow-primary"
            >
              <div className="text-2xl mb-2">🎉</div>
              <p className="font-display font-semibold text-foreground">
                You're on the list!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll notify you when early access launches.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-0 mx-auto max-w-md"
            >
              <input
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-lg sm:rounded-r-none border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="rounded-lg sm:rounded-l-none bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
              >
                Get Early Access
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistSection;
