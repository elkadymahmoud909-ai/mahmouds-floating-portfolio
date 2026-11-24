import { motion } from "framer-motion";
import { BrainCircuit, Code2, MapPin, Palette, Sparkles } from "lucide-react";

import { PROFILE } from "@/config/site";

import { Monogram } from "./Monogram";
import { Reveal, TiltCard } from "./Motion";
import { SectionTitle } from "./SectionTitle";

const FACTS = [
  { icon: Sparkles, label: "Age", value: `${PROFILE.age} years old` },
  { icon: MapPin, label: "Based in", value: PROFILE.location },
  { icon: Code2, label: "Learning", value: "Python & the web" },
  { icon: BrainCircuit, label: "Curious about", value: "AI & design" },
];

const CHIPS = [
  { label: "Python", className: "top-6 -left-3 md:-left-10", delay: 0 },
  { label: "AI", className: "top-1/3 -right-3 md:-right-8", delay: 1.2 },
  { label: "Design", className: "bottom-28 -left-3 md:-left-12", delay: 2.1 },
];

export function About() {
  return (
    <section id="about" className="relative overflow-x-clip py-28 md:py-40">
      <div className="container-page grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        {/* Profile visual */}
        <Reveal className="relative mx-auto w-full max-w-sm">
          <TiltCard intensity={12} className="glass aspect-[4/5] overflow-hidden rounded-[2rem] shadow-card">
            <div className="absolute inset-0 bg-aurora opacity-80" />
            <div className="grid-lines absolute inset-0" />
            <div className="absolute inset-0 grid place-items-center" style={{ transform: "translateZ(40px)" }}>
              <div className="relative grid size-52 place-items-center">
                <span className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-electric/40" />
                <span className="animate-spin-reverse absolute inset-6 rounded-full border border-violet/40" />
                <span className="absolute inset-12 rounded-full bg-gradient-primary opacity-30 blur-2xl" />
                <Monogram className="relative size-24" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
              <div>
                <p className="font-display text-xl font-semibold">{PROFILE.name}</p>
                <p className="eyebrow mt-1 text-[0.6rem] text-muted-foreground">Photo coming soon</p>
              </div>
              <Palette className="size-5 text-violet" />
            </div>
          </TiltCard>
          {CHIPS.map((c) => (
            <motion.span
              key={c.label}
              className={`glass font-mono absolute rounded-full px-4 py-2 text-xs tracking-widest text-foreground shadow-float ${c.className}`}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
            >
              {c.label}
            </motion.span>
          ))}
        </Reveal>

        {/* Bio */}
        <div>
          <SectionTitle index="01" label="About" title="BEYOND THE CODE." />
          <Reveal delay={0.1}>
            <p className="font-display text-xl leading-snug text-foreground md:text-2xl">
              I'm Mahmoud, a 13-year-old technology enthusiast from Egypt who loves finding out how things work — and
              then trying to build them myself.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              Right now I'm learning programming with Python, building web pages with HTML and CSS, designing logos in
              Canva, and exploring the world of artificial intelligence. I'm still at the beginning of my journey — and
              that's the exciting part. Every small project teaches me something new.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {FACTS.map((f, i) => (
              <Reveal key={f.label} delay={0.15 + i * 0.08}>
                <TiltCard className="glass h-full rounded-2xl p-5">
                  <f.icon className="size-5 text-electric" />
                  <p className="eyebrow mt-4 text-[0.6rem] text-muted-foreground">{f.label}</p>
                  <p className="mt-1 font-semibold">{f.value}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
