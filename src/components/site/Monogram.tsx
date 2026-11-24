import { motion } from "framer-motion";
import { useId } from "react";

import { cn } from "@/lib/utils";

/** The "M" mark. `draw` animates the stroke like it is being written in light. */
export function Monogram({ className, draw = false }: { className?: string; draw?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--electric)" }} />
          <stop offset="100%" style={{ stopColor: "var(--violet)" }} />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="none" stroke={`url(#g${id})`} strokeOpacity="0.45" />
      <motion.path
        d="M13 34 V14 L24 27 L35 14 V34"
        fill="none"
        stroke={`url(#g${id})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
