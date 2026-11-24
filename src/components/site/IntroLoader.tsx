import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Monogram } from "./Monogram";

const STAGES = ["Initializing world", "Loading light", "Compiling dreams", "Welcome"];

/** Cinematic opening: the "M" draws itself while a counter fills, then the curtain lifts. */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 250 : 2300;
    const start = performance.now();
    let raf = 0;
    let timeout = 0;
    document.documentElement.style.overflow = "hidden";
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        timeout = window.setTimeout(() => {
          setVisible(false);
          document.documentElement.style.overflow = "";
          onDone();
        }, reduce ? 0 : 350);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(progress / 26))] ?? "";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          role="status"
          aria-live="polite"
          aria-label={`Loading Mahmoud's digital world, ${progress}%`}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="absolute inset-0 bg-aurora opacity-70" />
          <div className="grid-lines absolute inset-0" />

          <motion.div
            className="relative flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)", transition: { duration: 0.6 } }}
          >
            <div className="relative grid size-44 place-items-center">
              <span className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-electric/40" />
              <span className="animate-spin-reverse absolute inset-4 rounded-full border border-violet/30" />
              <span className="absolute inset-10 rounded-full bg-gradient-primary opacity-25 blur-2xl" />
              <Monogram draw className="relative size-20" />
            </div>

            <p className="font-display mt-10 text-sm tracking-[0.5em] text-silver">MAHMOUD</p>
            <p className="eyebrow mt-3 h-4 text-muted-foreground">{stage}</p>

            <div className="mt-8 h-px w-56 overflow-hidden bg-border">
              <div
                className="h-full origin-left bg-gradient-primary shadow-glow"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <p className="font-mono mt-4 text-xs tabular-nums text-muted-foreground">
              {String(progress).padStart(3, "0")}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
