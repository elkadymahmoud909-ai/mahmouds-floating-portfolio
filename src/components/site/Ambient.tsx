import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Thin gradient bar showing how far you have travelled down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-primary shadow-glow"
    />
  );
}

/** Soft light that follows the mouse, plus a ring that grows over clickable things. Desktop only. */
export function CursorLight() {
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const g = { ...target };
    const r = { ...target };
    let hover = false;
    let scale = 1;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as Element | null;
      hover = !!el?.closest("a, button, [role='button']");
    };
    const loop = () => {
      g.x += (target.x - g.x) * 0.08;
      g.y += (target.y - g.y) * 0.08;
      r.x += (target.x - r.x) * 0.25;
      r.y += (target.y - r.y) * 0.25;
      scale += ((hover ? 1.7 : 1) - scale) * 0.18;
      if (glow.current) glow.current.style.transform = `translate3d(${g.x - 300}px, ${g.y - 300}px, 0)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${r.x - 18}px, ${r.y - 18}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[1] size-[600px] rounded-full cursor-glow opacity-[0.08]"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] size-9 rounded-full border border-electric/60 mix-blend-screen"
      />
    </>
  );
}
