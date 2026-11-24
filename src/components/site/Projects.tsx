import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

import { PROJECTS } from "@/config/site";

import { scrollToSection, TiltCard } from "./Motion";
import { SectionTitle } from "./SectionTitle";

export function Projects() {
  return (
    <section id="projects" className="relative overflow-x-clip py-28 md:py-40">
      <div className="container-page">
        <SectionTitle
          index="03"
          label="Projects"
          title="THINGS I'M BUILDING."
          subtitle="My first projects and ideas. More will appear here as I build them."
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {PROJECTS.map((p, i) => {
            const isInternal = p.url?.startsWith("#");
            return (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: (i % 2) * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={i % 2 === 1 ? "md:mt-24" : ""}
              >
                <TiltCard intensity={6} className="group glass overflow-hidden rounded-[2rem] shadow-card">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <motion.img
                      src={p.image}
                      alt={`${p.name} preview artwork`}
                      loading="lazy"
                      decoding="async"
                      width={1100}
                      height={756}
                      initial={{ clipPath: "inset(12% 12% 12% 12% round 24px)", scale: 1.25 }}
                      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                    <span className="glass font-mono absolute top-5 left-5 rounded-full px-3 py-1.5 text-[0.65rem] tracking-widest uppercase">
                      {p.status}
                    </span>
                    <span className="font-display absolute top-4 right-6 text-5xl font-bold text-foreground/10">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="relative p-6 md:p-8">
                    <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{p.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                      {p.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[0.7rem] text-silver"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7">
                      {p.url ? (
                        <a
                          href={p.url}
                          {...(isInternal
                            ? {
                                onClick: (e: React.MouseEvent) => {
                                  e.preventDefault();
                                  scrollToSection(p.url!.slice(1));
                                },
                              }
                            : { target: "_blank", rel: "noopener noreferrer" })}
                          className="btn-glass group/btn !py-3"
                        >
                          View project
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="btn-glass !cursor-not-allowed !py-3 text-muted-foreground opacity-70"
                        >
                          <Clock className="size-4" />
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
