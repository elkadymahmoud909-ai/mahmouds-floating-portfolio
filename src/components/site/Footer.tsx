import { Copy, Send } from "lucide-react";

import { CONTACT_CONFIG, NAV_ITEMS, PROFILE } from "@/config/site";
import { cn } from "@/lib/utils";

import { CHANNEL_TONE, ContactIcon } from "./BrandIcons";
import { CHANNELS, copyEmail, linkProps, notifyPending } from "./contact-actions";
import { Monogram } from "./Monogram";
import { scrollToSection } from "./Motion";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-border pt-24 pb-28 md:pb-12">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-primary opacity-60" />
      <div className="container-page">
        <p
          aria-hidden
          className="font-display pointer-events-none text-[clamp(3rem,12.5vw,10rem)] leading-none font-bold text-silver opacity-[0.07] select-none"
        >
          MAHMOUD
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram className="size-11" />
              <span className="font-display tracking-[0.3em] text-silver">MAHMOUD</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A {PROFILE.age}-year-old young programmer from {PROFILE.location}, learning, experimenting and building
              with code — one project at a time.
            </p>
            <div className="mt-6 flex gap-3">
              {CHANNELS.map((c) =>
                c.href ? (
                  <a
                    key={c.id}
                    href={c.href}
                    {...linkProps(c)}
                    aria-label={c.label}
                    className={cn(
                      "glass grid size-11 place-items-center rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glow",
                      CHANNEL_TONE[c.id],
                    )}
                  >
                    <ContactIcon id={c.id} className="size-[1.1rem]" />
                  </a>
                ) : (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`${c.label} (not available yet)`}
                    aria-disabled="true"
                    onClick={() => notifyPending(c)}
                    className="glass grid size-11 cursor-not-allowed place-items-center rounded-xl text-muted-foreground opacity-70"
                  >
                    <ContactIcon id={c.id} className="size-[1.1rem]" />
                  </button>
                ),
              )}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-muted-foreground">Navigate</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(n.id);
                    }}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-muted-foreground">Say hello</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-center gap-2">
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="truncate hover:text-electric">
                  {CONTACT_CONFIG.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Copy className="size-3.5" />
                </button>
              </li>
              <li>
                <a
                  href={CONTACT_CONFIG.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-telegram"
                >
                  <Send className="size-4" />
                  t.me/MahmoudCodeX
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Mahmoud. All rights reserved.</p>
          <p>Built with code &amp; curiosity in {PROFILE.location}.</p>
        </div>
      </div>
    </footer>
  );
}
