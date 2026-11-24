import { AnimatePresence, motion } from "framer-motion";
import { Lock, MessageCircle, X } from "lucide-react";
import { useId, useState } from "react";

import type { ContactChannel } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { CHANNEL_TONE, ContactIcon } from "./BrandIcons";
import { CHANNELS, linkProps, notifyPending } from "./contact-actions";

function DockButton({
  channel,
  index,
  tooltipSide = "left",
  alwaysShowLabel = false,
}: {
  channel: ContactChannel;
  index: number;
  tooltipSide?: "left";
  alwaysShowLabel?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [ripple, setRipple] = useState(0);
  const tipId = useId();
  const pending = channel.href === null;
  const tip = pending ? `${channel.label} · awaiting approval` : `${channel.label} · ${channel.display}`;

  const inner = (
    <>
      {/* Rotating outline */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-500",
          hover && "opacity-100",
        )}
      >
        <span className="animate-spin-slow conic-ring absolute -inset-1/2" />
      </span>
      <span aria-hidden className="absolute inset-px rounded-[15px] bg-card" />
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500",
          hover && "opacity-60",
          channel.id === "whatsapp" && "bg-whatsapp",
          channel.id === "telegram" && "bg-telegram",
          channel.id === "phone" && "bg-electric",
          channel.id === "email" && "bg-violet",
        )}
      />
      <ContactIcon id={channel.id} className={cn("relative size-5", pending ? "text-muted-foreground" : CHANNEL_TONE[channel.id])} />
      {pending && (
        <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full border border-border bg-secondary">
          <Lock className="size-2.5 text-muted-foreground" />
        </span>
      )}
      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            aria-hidden
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-2xl border border-electric"
          />
        )}
      </AnimatePresence>
    </>
  );

  const common = {
    "aria-describedby": tipId,
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    whileHover: { scale: 1.14 },
    whileTap: { scale: 0.88 },
    className: cn(
      "relative grid size-12 place-items-center rounded-2xl shadow-float outline-none",
      pending && "cursor-not-allowed",
    ),
  };

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.2 + index * 0.45, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
    >
      {pending ? (
        <motion.button
          type="button"
          aria-label={`${channel.label} (not available yet)`}
          aria-disabled="true"
          onClick={() => {
            setRipple((r) => r + 1);
            notifyPending(channel);
          }}
          {...common}
        >
          {inner}
        </motion.button>
      ) : (
        <motion.a
          href={channel.href ?? undefined}
          aria-label={`${channel.label}: ${channel.display}`}
          onClick={() => setRipple((r) => r + 1)}
          {...linkProps(channel)}
          {...common}
        >
          {inner}
        </motion.a>
      )}
      <motion.span
        id={tipId}
        role="tooltip"
        initial={false}
        animate={hover || alwaysShowLabel ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "glass-strong pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 font-mono text-[0.7rem] whitespace-nowrap text-foreground shadow-float",
          tooltipSide === "left" && "right-full mr-3",
        )}
      >
        {alwaysShowLabel ? channel.label : tip}
      </motion.span>
    </motion.div>
  );
}

/** Floating contact dock: vertical rail on desktop, expandable bubble on mobile. */
export function ContactDock({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop rail */}
          <motion.aside
            key="dock-desktop"
            aria-label="Contact Mahmoud"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 md:block"
          >
            <div className="glass relative flex flex-col items-center gap-4 rounded-[1.75rem] p-3 shadow-float">
              <span className="eyebrow mb-1 text-[0.55rem] text-muted-foreground [writing-mode:vertical-rl]">Contact</span>
              {CHANNELS.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
                >
                  <DockButton channel={c} index={i} />
                </motion.div>
              ))}
            </div>
          </motion.aside>

          {/* Mobile bubble */}
          <motion.aside
            key="dock-mobile"
            aria-label="Contact Mahmoud"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
            className="fixed right-4 bottom-5 z-40 flex flex-col items-end gap-3 md:hidden"
          >
            <AnimatePresence>
              {open &&
                CHANNELS.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.6, transition: { delay: (3 - i) * 0.04 } }}
                    transition={{ delay: (3 - i) * 0.06, type: "spring", stiffness: 320, damping: 22 }}
                  >
                    <DockButton channel={c} index={i} alwaysShowLabel />
                  </motion.div>
                ))}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close contact options" : "Open contact options"}
              whileTap={{ scale: 0.9 }}
              animate={open ? { y: 0 } : { y: [0, -5, 0] }}
              transition={open ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "grid size-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow",
                !open && "animate-pulse-glow",
              )}
            >
              <motion.span animate={{ rotate: open ? 90 : 0 }}>
                {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
              </motion.span>
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
