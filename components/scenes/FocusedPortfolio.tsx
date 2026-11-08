"use client";

import { AnimatePresence, LayoutGroup, motion, useInView } from "framer-motion";
import { RotateCcw, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRegisterScene } from "@/components/ui/Scene";
import { Avatar } from "@/components/ui/primitives";

const ease = [0.22, 1, 0.36, 1] as const;

const KEEP = [
  { name: "Support Assistant", goal: "First reply under 2 hours", outcome: "1 h 40 min today", owner: "MR", hue: 245 },
  { name: "Proposal Writer", goal: "Proposals in half the time", outcome: "−41% prep time", owner: "JK", hue: 200 },
  { name: "Invoice Matcher", goal: "Half the matching errors", outcome: "−52% errors", owner: "LP", hue: 160 },
  { name: "Onboarding Hub", goal: "New hires ramped in 30 days", outcome: "36 days, improving", owner: "PN", hue: 280 },
];

const NOISE = [
  "Slack summariser", "Meeting Notes Agent", "Smart Search v2", "Lead scorer", "Expense bot", "Docs copilot",
  "Churn predictor", "Contract Q&A Bot", "FAQ generator", "Pricing widget", "Survey analyser", "Ticket tagger",
  "HR helpdesk", "Release notes AI", "Dark mode", "CSV export", "Forecast agent", "Email drafter", "Translator",
  "Status page", "Sales coach", "Data cleaner", "Persona bot", "Calendar agent", "Alt-text tool", "Quiz builder",
  "Recap emails", "Brand checker", "Feedback wall", "KPI bot",
];

// deterministic scatter so server and client agree
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
const ALL = [
  ...NOISE.map((n, i) => ({ name: n, keep: false, i })),
  ...KEEP.map((k, i) => ({ name: k.name, keep: true, i: NOISE.length + i })),
].sort((a, b) => rand(a.i + 3) - rand(b.i + 3));

function Portfolio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [focused, setFocused] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || focused) return;
    const t = window.setTimeout(() => setFocused(true), 1800);
    return () => window.clearTimeout(t);
  }, [inView, focused, run]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-5xl">
      <LayoutGroup>
        <div className={`relative ${focused ? "" : "min-h-[420px] sm:min-h-[200px]"}`}>
          <AnimatePresence mode="popLayout">
            {!focused ? (
              <motion.div
                key="chaos"
                exit={{ opacity: 1 }}
                className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
              >
                {ALL.map((t) => {
                  const keep = KEEP.find((k) => k.name === t.name);
                  return (
                    <motion.span
                      key={t.name}
                      layoutId={keep ? `keep-${t.name}` : undefined}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1, rotate: (rand(t.i) - 0.5) * 6, y: (rand(t.i + 7) - 0.5) * 10 }}
                      exit={keep ? undefined : { opacity: 0, scale: 0.6, filter: "blur(6px)", transition: { duration: 0.6, delay: rand(t.i) * 0.4 } }}
                      transition={{ duration: 0.6, ease, delay: rand(t.i + 1) * 0.4 }}
                      className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[11.5px] text-ink-muted shadow-card"
                    >
                      {t.name}
                    </motion.span>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div key="focus" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {KEEP.map((k, i) => (
                  <motion.div
                    key={k.name}
                    layoutId={`keep-${k.name}`}
                    transition={{ type: "spring", stiffness: 110, damping: 20, delay: 0.1 * i }}
                    className="rounded-2xl border border-line bg-paper p-5 shadow-float"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                    >
                      <p className="text-[15px] font-semibold tracking-tight text-ink">{k.name}</p>
                      <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-snug text-ink-soft">
                        <Target size={13} className="mt-0.5 shrink-0 text-accent" />
                        {k.goal}
                      </p>
                      <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-3">
                        <Avatar initials={k.owner} hue={k.hue} />
                        <span className="text-[11px] text-ink-faint">Owner</span>
                        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-ok">
                          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                          {k.outcome}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      <div className="mt-6 flex items-center justify-center gap-4 font-mono text-[11px] text-ink-faint">
        <span>{focused ? `${KEEP.length} initiatives · each with a goal, an owner and a measured outcome` : `${ALL.length} initiatives · unclear goals`}</span>
        {focused && (
          <button
            type="button"
            onClick={() => {
              setFocused(false);
              setRun((r) => r + 1);
            }}
            className="inline-flex items-center gap-1 text-ink-muted transition-colors hover:text-ink"
          >
            <RotateCcw size={11} /> Replay
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * The result of Focus: a crowded portfolio collapses into a few initiatives,
 * each with a goal, an owner and a measured outcome. Sits between Focus and Measure.
 */
export function FocusedPortfolio() {
  const ref = useRef<HTMLElement>(null);
  useRegisterScene(ref, "focus");
  return (
    <section ref={ref} aria-label="A focused portfolio" className="relative px-5 py-16 sm:px-8 lg:py-24">
      <Portfolio />
    </section>
  );
}
