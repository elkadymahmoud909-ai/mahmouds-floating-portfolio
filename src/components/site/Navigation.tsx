import { AnimatePresence, motion } from "framer-motion";
import { FolderKanban, Home, Menu, Route as RouteIcon, Send, Sparkles, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import { NAV_ITEMS, type NavId } from "@/config/site";
import { cn } from "@/lib/utils";

import { Monogram } from "./Monogram";
import { scrollToSection } from "./Motion";

const ICONS: Record<NavId, typeof Home> = {
  home: Home,
  about: User,
  skills: Sparkles,
  projects: FolderKanban,
  journey: RouteIcon,
  contact: Send,
};

function useActiveSection() {
  const [active, setActive] = useState<NavId>("home");
  useEffect(() => {
    const els = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as NavId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Navigation({ ready, onMenuChange }: { ready: boolean; onMenuChange?: (open: boolean) => void }) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    onMenuChange?.(open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, onMenuChange]);

  const go = (id: NavId) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the mobile menu close before scrolling.
    window.setTimeout(() => scrollToSection(id), open ? 250 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            "glass-strong flex w-full max-w-5xl items-center justify-between rounded-full py-2 pr-2 pl-3 transition-shadow duration-500",
            scrolled && "shadow-float",
          )}
        >
          <a href="#home" onClick={go("home")} className="flex items-center gap-2.5" aria-label="Mahmoud — back to top">
            <Monogram className="size-9" />
            <span className="font-display text-sm tracking-[0.3em] text-silver">MAHMOUD</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.id];
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-electric/40 bg-electric/10 shadow-glow"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon className="relative size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <a href="#contact" onClick={go("contact")} className="btn-hero hidden !px-5 !py-2.5 !text-[0.7rem] lg:inline-flex">
            Let's talk
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full border border-border bg-secondary/60 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-strong fixed inset-0 z-40 flex flex-col justify-center px-8 lg:hidden"
          >
            <ul className="space-y-2">
              {NAV_ITEMS.map((item, i) => {
                const Icon = ICONS[item.id];
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors",
                        active === item.id ? "bg-electric/10 text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span className="font-mono text-xs text-electric">0{i + 1}</span>
                      <Icon className="size-5" />
                      <span className="font-display text-2xl font-semibold">{item.label}</span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
