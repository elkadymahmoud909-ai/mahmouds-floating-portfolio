import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Send } from "lucide-react";
import { useRef } from "react";

import { PROFILE } from "@/config/site";

import { Magnetic, scrollToSection, WordReveal } from "./Motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const TAGLINES = ["13 YEARS OLD.", "DREAMING BIG.", "BUILDING WITH CODE."];

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.75], ["blur(0px)", "blur(10px)"]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24">
      <motion.div style={{ y, opacity, filter: blur }} className="container-page relative z-10 w-full">
        <motion.p {...fade(0.2)} className="eyebrow mb-8 flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-electric opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-electric" />
          </span>
          Young programmer · {PROFILE.location}
        </motion.p>

        <h1 className="font-display text-[clamp(2.6rem,9vw,8.5rem)] leading-[0.92] font-bold">
          <WordReveal text="HELLO, I'M" play={ready} delay={0.3} wordClassName="text-silver" />
          <br />
          <WordReveal text="MAHMOUD." play={ready} delay={0.5} wordClassName="text-gradient" />
        </h1>

        <div className="mt-8 flex flex-col gap-1 sm:mt-10">
          {TAGLINES.map((line, i) => (
            <motion.p
              key={line}
              {...fade(0.9 + i * 0.12)}
              className="font-mono text-sm tracking-[0.28em] text-muted-foreground sm:text-base"
            >
              <span className="mr-3 text-electric">0{i + 1}</span>
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p {...fade(1.3)} className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {PROFILE.description}
        </motion.p>

        <motion.div {...fade(1.5)} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="btn-hero group"
            >
              Explore my world
              <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="btn-glass group"
            >
              Let's connect
              <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* HUD corners */}
      <motion.dl
        {...fade(1.7)}
        className="font-mono absolute right-6 bottom-10 z-10 hidden gap-6 text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase md:flex lg:right-24"
      >
        {[
          ["Age", String(PROFILE.age)],
          ["Loc", PROFILE.location],
          ["Status", "Learning"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-electric">{k}</dt>
            <dd className="mt-1 text-foreground">{v}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("about");
        }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-label="Scroll to About"
      >
        <span className="flex h-11 w-7 justify-center rounded-full border border-silver/30 pt-2">
          <span className="animate-scroll-dot block size-1.5 rounded-full bg-electric" />
        </span>
        <span className="eyebrow text-[0.6rem] text-muted-foreground">Scroll</span>
      </motion.a>
    </section>
  );
}
