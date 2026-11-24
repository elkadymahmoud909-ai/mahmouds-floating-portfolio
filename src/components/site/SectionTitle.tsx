import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { WordReveal } from "./Motion";

export function SectionTitle({
  index,
  label,
  title,
  subtitle,
  align = "left",
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={cn("mb-14 md:mb-20", align === "center" && "mx-auto text-center")}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={cn("eyebrow mb-5 flex items-center gap-3", align === "center" && "justify-center")}
      >
        <span className="text-muted-foreground">{index}</span>
        <motion.span
          className="h-px w-10 origin-left bg-gradient-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {label}
      </motion.div>
      <h2 className="font-display text-4xl leading-[1.02] font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
        <WordReveal text={title} wordClassName="text-silver" />
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className={cn("mt-6 max-w-xl text-base text-muted-foreground md:text-lg", align === "center" && "mx-auto")}
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}
