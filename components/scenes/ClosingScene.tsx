"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { useRef } from "react";
import { Logo } from "@/components/ui/Chrome";
import { useRegisterScene } from "@/components/ui/Scene";
import { PRODUCT, sceneById } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;
const scene = sceneById("closing");

export function ClosingScene() {
  const ref = useRef<HTMLElement>(null);
  useRegisterScene(ref, "closing");

  return (
    <section ref={ref} id="closing" aria-labelledby="closing-title" className="relative px-5 pb-40 pt-28 sm:px-8 lg:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease }}
            className="mb-10 flex justify-center"
          >
            <Logo className="scale-150 text-ink" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease }}
            className="mx-auto max-w-xl text-balance text-[17px] leading-relaxed text-ink-muted sm:text-lg"
          >
            {scene.narration}
          </motion.p>
          <motion.h2
            id="closing-title"
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease, delay: 0.3 }}
            className="mt-8 text-display font-semibold"
          >
            Build only what <span className="text-gradient">matters.</span>
          </motion.h2>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="relative mx-auto mt-24 max-w-4xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-paper sm:px-12 sm:py-20"
        >
          <div aria-hidden className="pointer-events-none absolute -top-1/2 left-1/2 h-[140%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.45),transparent_60%)] blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.15] invert" />
          <div className="relative">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-glow">{PRODUCT.status}</p>
            <h3 className="mx-auto max-w-2xl text-balance text-[clamp(1.8rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Want to explore Worth with your team? Let’s talk.
            </h3>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-paper/60">
              We’re shaping {PRODUCT.name} with a small group of product, innovation and operations teams. Thirty minutes, no slides.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={PRODUCT.bookingUrl}
                className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-[15px] font-medium text-ink transition-all duration-300 ease-cine hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(165,180,252,0.7)]"
              >
                Book a conversation
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={`mailto:${PRODUCT.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[14px] text-paper/70 transition-colors hover:text-paper"
              >
                <Mail size={15} />
                {PRODUCT.contactEmail}
              </a>
            </div>
          </div>
        </motion.div>

        <footer className="mx-auto mt-20 flex max-w-4xl flex-col items-center justify-between gap-4 border-t border-line pt-8 text-[12px] text-ink-faint sm:flex-row">
          <Logo className="text-ink" />
          <span>{PRODUCT.tagline} · © {new Date().getFullYear()}</span>
        </footer>
      </div>
    </section>
  );
}
