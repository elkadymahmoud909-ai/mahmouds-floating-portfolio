import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts content in when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 40,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Splits text into words that rise out of a mask. */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  play,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** When given, animates on this flag instead of on scroll-in. */
  play?: boolean;
}) {
  const words = text.split(" ");
  const variants = {
    hidden: { y: "110%", rotate: 4 },
    show: (i: number) => ({
      y: "0%",
      rotate: 0,
      transition: { duration: 1, delay: delay + i * 0.08, ease: EASE },
    }),
  };
  const trigger =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } }
      : { initial: "hidden", animate: play ? "show" : "hidden" };
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span custom={i} variants={variants} {...trigger} className={cn("inline-block", wordClassName)}>
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** 3D tilt card with mouse-following spotlight and gradient glow border. */
export function TiltCard({
  children,
  className,
  intensity = 9,
  ...rest
}: { children: ReactNode; className?: string; intensity?: number } & Omit<HTMLMotionProps<"div">, "children">) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    ry.set((x / r.width - 0.5) * intensity * 2);
    rx.set(-(y / r.height - 0.5) * intensity * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={cn("spotlight glow-border relative", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Wrapper that gently pulls its child toward the cursor. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "home" ? window.location.pathname : `#${id}`);
}
