import { motion } from "framer-motion";
import { BrainCircuit, Code2, Globe, LayoutTemplate, Paintbrush, PenTool, Plus, Terminal } from "lucide-react";

import { SKILLS, type SkillLevel } from "@/config/site";
import { cn } from "@/lib/utils";

import { TiltCard } from "./Motion";
import { SectionTitle } from "./SectionTitle";

const ICONS = {
  python: Terminal,
  html: Code2,
  css: Paintbrush,
  web: Globe,
  logo: PenTool,
  canva: LayoutTemplate,
  ai: BrainCircuit,
} as const;

const LEVEL_TONE: Record<SkillLevel, string> = {
  Beginner: "bg-silver",
  "Currently Learning": "bg-electric",
  Exploring: "bg-violet",
};

export function Skills() {
  return (
    <section id="skills" className="relative overflow-x-clip py-28 md:py-40">
      <div className="container-page">
        <SectionTitle
          index="02"
          label="Skills"
          title="WHAT I'M LEARNING."
          subtitle="No fake percentages — just an honest look at where I am right now with each skill."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, i) => {
            const Icon = ICONS[skill.icon];
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 60, rotateX: -25 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: (i % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 900 }}
              >
                <TiltCard className="group glass h-full rounded-3xl p-6 shadow-card transition-colors duration-500 hover:bg-secondary/50">
                  <div className="relative mb-8 flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
                    <span className="relative grid size-14 place-items-center rounded-2xl border border-electric/30 bg-electric/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow">
                      <Icon className="size-6 text-electric transition-colors duration-500 group-hover:text-foreground" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold" style={{ transform: "translateZ(20px)" }}>
                    {skill.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{skill.description}</p>
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 font-mono text-[0.65rem] tracking-widest uppercase">
                    <span className={cn("size-1.5 rounded-full", LEVEL_TONE[skill.level])} />
                    {skill.level}
                  </p>
                </TiltCard>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-border p-6 text-center"
          >
            <div>
              <Plus className="mx-auto size-6 animate-pulse text-violet" />
              <p className="eyebrow mt-4 text-muted-foreground">More skills loading…</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
