import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { useCallback, useState } from "react";

import { About } from "@/components/site/About";
import { CursorLight, ScrollProgress } from "@/components/site/Ambient";
import { Backdrop } from "@/components/site/Backdrop";
import { Contact } from "@/components/site/Contact";
import { ContactDock } from "@/components/site/ContactDock";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { IntroLoader } from "@/components/site/IntroLoader";
import { Journey } from "@/components/site/Journey";
import { Navigation } from "@/components/site/Navigation";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";

const TITLE = "Mahmoud — Young Programmer & Web Developer from Egypt";
const DESCRIPTION =
  "Mahmoud's digital world: a 13-year-old programmer from Egypt learning Python, HTML, CSS, design and AI — and building with code.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <IntroLoader onDone={onDone} />
      <Backdrop ready={ready} />
      <CursorLight />
      <ScrollProgress />
      <Navigation ready={ready} onMenuChange={setMenuOpen} />
      <ContactDock visible={ready && !menuOpen} />

      <main className="grain relative z-10">
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </MotionConfig>
  );
}
