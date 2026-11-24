import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Lock, ShieldCheck } from "lucide-react";

import { CONTACT_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";

import { CHANNEL_TONE, ContactIcon } from "./BrandIcons";
import { CHANNELS, copyEmail, linkProps, notifyPending } from "./contact-actions";
import { Magnetic, TiltCard } from "./Motion";
import { SectionTitle } from "./SectionTitle";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-x-clip py-28 md:py-40">
      <div className="container-page">
        <SectionTitle
          index="05"
          label="Contact"
          title="LET'S CONNECT."
          subtitle="Have an idea, a question, or just want to say hi? Send me a message."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c, i) => {
            const pending = c.href === null;
            const body = (
              <>
                <span
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl border border-border bg-background/50 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
                    pending ? "text-muted-foreground" : CHANNEL_TONE[c.id],
                  )}
                >
                  <ContactIcon id={c.id} className="size-6" />
                </span>
                <p className="font-display mt-8 text-xl font-semibold">{c.label}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground">{c.display}</p>
                <span className="absolute top-6 right-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                  {pending ? <Lock className="size-4" /> : <ArrowUpRight className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                </span>
              </>
            );
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard className={cn("glass group h-full rounded-3xl shadow-card", pending && "opacity-75")}>
                  {pending ? (
                    <button
                      type="button"
                      aria-disabled="true"
                      onClick={() => notifyPending(c)}
                      className="relative block w-full cursor-not-allowed p-6 text-left"
                    >
                      {body}
                    </button>
                  ) : (
                    <a href={c.href ?? undefined} {...linkProps(c)} className="relative block p-6">
                      {body}
                    </a>
                  )}
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="glass glow-border mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl p-6 md:flex-row md:items-center md:p-8"
        >
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">Email me directly</p>
            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="font-display mt-2 block truncate text-xl font-semibold text-gradient sm:text-2xl md:text-3xl"
            >
              {CONTACT_CONFIG.email}
            </a>
          </div>
          <Magnetic>
            <button type="button" onClick={copyEmail} className="btn-glass shrink-0">
              <Copy className="size-4" />
              Copy email
            </button>
          </Magnetic>
        </motion.div>

        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-electric" />
          WhatsApp and phone will be switched on once a parent or guardian approves public contact.
        </p>
      </div>
    </section>
  );
}
