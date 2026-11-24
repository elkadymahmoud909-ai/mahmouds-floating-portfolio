import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import { JOURNEY } from "@/config/site";
import { cn } from "@/lib/utils";

import { SectionTitle } from "./SectionTitle";

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="journey" className="relative overflow-x-clip py-28 md:py-40">
      <div className="container-page">
        <SectionTitle
          index="04"
          label="Journey"
          title="THE JOURNEY HAS JUST BEGUN."
          align="center"
          subtitle="Every step so far — and the many still to come."
        />

        <ol ref={ref} className="relative mx-auto max-w-4xl">
          {/* Track + animated glowing line */}
          <span aria-hidden className="absolute top-0 bottom-0 left-5 w-px bg-border md:left-1/2" />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-5 w-px origin-top bg-gradient-to-b from-electric via-violet to-electric shadow-glow md:left-1/2"
          />

          {JOURNEY.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <li key={step.title} className="relative grid pb-14 pl-16 md:grid-cols-2 md:pl-0 last:pb-0">
                <motion.span
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="animate-pulse-glow absolute top-1 left-5 z-10 grid size-4 -translate-x-1/2 place-items-center rounded-full bg-gradient-primary md:left-1/2"
                >
                  <span className="size-1.5 rounded-full bg-void" />
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, x: right ? 50 : -50, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "md:max-w-sm",
                    right ? "md:col-start-2 md:pl-14" : "md:col-start-1 md:justify-self-end md:pr-14 md:text-right",
                  )}
                >
                  <p className="eyebrow">Step {String(i + 1).padStart(2, "0")}</p>
                  <div className="glass glow-border mt-3 rounded-2xl p-5 transition-transform duration-500 hover:-translate-y-1">
                    <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="font-display mt-16 text-center text-lg text-gradient"
        >
          To be continued…
        </motion.p>
      </div>
    </section>
  );
}
