"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Copy, Rocket, Sparkles, TrendingUp, Archive, Combine, Wrench, Target, Activity, Timer, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Scene } from "@/components/ui/Scene";
import { Avatar, Pill, Sparkline, Window, useTicker } from "@/components/ui/primitives";
import { PRODUCT, sceneById } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

type Decision = "Improve" | "Scale" | "Combine" | "Retire";
const DECISIONS: { key: Decision; icon: typeof Rocket }[] = [
  { key: "Improve", icon: Wrench },
  { key: "Scale", icon: Rocket },
  { key: "Combine", icon: Combine },
  { key: "Retire", icon: Archive },
];

const ALERTS: {
  icon: typeof Copy;
  tone: "warn" | "ok";
  title: string;
  item: string;
  expected: string;
  actual: string;
  spark: number[];
  suggested: Decision;
}[] = [
  {
    icon: TrendingUp,
    tone: "warn",
    title: "Running costs are increasing, but usage remains unchanged.",
    item: "Meeting Notes Agent · Ops",
    expected: "40 weekly users",
    actual: "3 weekly users · cost +46% in 90 days",
    spark: [3, 4, 4, 5, 6, 7, 8, 9],
    suggested: "Retire",
  },
  {
    icon: Timer,
    tone: "warn",
    title: "This agent has saved less time than expected.",
    item: "Proposal Writer · Sales",
    expected: "6 h saved per proposal",
    actual: "2.5 h saved per proposal",
    spark: [2, 3, 3, 3, 4, 3, 4, 4],
    suggested: "Improve",
  },
  {
    icon: Copy,
    tone: "warn",
    title: "Two teams are using similar solutions.",
    item: "Contract Q&A Bot · Legal",
    expected: "One shared tool",
    actual: "86% overlap with Proposal Writer · both $2.1k/mo",
    spark: [4, 5, 5, 6, 6, 7, 7, 8],
    suggested: "Combine",
  },
  {
    icon: CheckCircle2,
    tone: "ok",
    title: "This feature has reached its expected adoption target.",
    item: "Self-serve Billing · Finance",
    expected: "60% of customers",
    actual: "64% of customers, 3 weeks early",
    spark: [1, 2, 3, 4, 5, 6, 7, 8],
    suggested: "Scale",
  },
];

function LiveStrip({ active }: { active: boolean }) {
  const t = useTicker(1000, active);
  const stats = [
    { icon: Activity, label: "Initiatives monitored", value: "38" },
    { icon: TrendingUp, label: "Running cost this month", value: `$${(61_240 + t * 7).toLocaleString("en-US")}` },
    { icon: Target, label: "On track to goal", value: "24 of 31" },
  ];
  return (
    <div className="grid grid-cols-3 gap-px border-b border-line-soft bg-line-soft">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-paper px-4 py-3">
          <p className="flex items-center gap-1.5 truncate text-[11px] text-ink-muted">
            <Icon size={11} />
            <span className="truncate">{label}</span>
          </p>
          <p className="font-mono text-[14px] tabular-nums text-ink sm:text-[15px]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function Monitor() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [shown, setShown] = useState(0);
  const [decided, setDecided] = useState<(Decision | null)[]>(ALERTS.map(() => null));
  const [touched, setTouched] = useState(false);

  // alerts arrive one by one, then the team reviews and decides
  useEffect(() => {
    if (!inView) return;
    const timers: number[] = [];
    ALERTS.forEach((_, i) => timers.push(window.setTimeout(() => setShown((s) => Math.max(s, i + 1)), 600 + i * 1100)));
    if (!touched) {
      ALERTS.forEach((a, i) =>
        timers.push(
          window.setTimeout(
            () => setDecided((d) => d.map((x, j) => (j === i && !x ? a.suggested : x))),
            5600 + i * 800,
          ),
        ),
      );
    }
    return () => timers.forEach(window.clearTimeout);
  }, [inView, touched]);

  const doneCount = decided.filter(Boolean).length;

  return (
    <div ref={ref}>
      <Window title={`${PRODUCT.name} · Monitoring`} right={<Pill tone="accent"><Sparkles size={11} /> 4 new insights</Pill>}>
        <LiveStrip active={inView} />
        <ul className="space-y-2.5 p-3 sm:p-4">
          <AnimatePresence>
            {ALERTS.slice(0, shown).map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.li
                  key={a.title}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease }}
                  className="rounded-xl border border-line bg-paper p-3.5 sm:p-4"
                >
                  <div className="flex gap-3">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${a.tone === "ok" ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}>
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold leading-snug">{a.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-ink-soft">{a.item}</p>
                      <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11.5px]">
                        <span className="text-ink-faint">
                          Expected <span className="text-ink-soft">{a.expected}</span>
                        </span>
                        <span className="text-ink-faint">
                          Actual <span className={a.tone === "ok" ? "text-ok" : "text-warn"}>{a.actual}</span>
                        </span>
                      </p>
                    </div>
                    <Sparkline points={a.spark} stroke={a.tone === "ok" ? "#059669" : i === 0 ? "#D97706" : "#A1A1AA"} className="hidden h-6 w-16 shrink-0 sm:block" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5 pl-11" role="group" aria-label={`Decision for ${a.item}`}>
                    {DECISIONS.map(({ key, icon: DIcon }) => {
                      const on = decided[i] === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setTouched(true);
                            setDecided((d) => d.map((x, j) => (j === i ? (x === key ? null : key) : x)));
                          }}
                          aria-pressed={on}
                          className={`relative inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ease-cine ${
                            on ? "border-ink bg-ink text-paper" : "border-line text-ink-muted hover:border-ink-faint hover:text-ink"
                          }`}
                        >
                          <DIcon size={11} />
                          {key}
                        </button>
                      );
                    })}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        <div className="flex items-center gap-3 border-t border-line-soft px-4 py-3">
          <div className="flex -space-x-1.5">
            <Avatar initials="MR" hue={245} />
            <Avatar initials="JK" hue={200} />
            <Avatar initials="LP" hue={160} />
          </div>
          <p className="flex-1 text-[12px] text-ink-muted">
            Portfolio review ·{" "}
            <span className="text-ink">
              {doneCount} of {ALERTS.length} decided
            </span>
          </p>
          <AnimatePresence>
            {doneCount === ALERTS.length && (
              <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Pill tone="ok">Review complete</Pill>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Window>
    </div>
  );
}

export function MeasureScene() {
  return (
    <Scene
      scene={sceneById("measure")}
      aside={
        <div className="flex flex-wrap gap-2">
          {DECISIONS.map(({ key, icon: Icon }) => (
            <span key={key} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-soft">
              <Icon size={12} className="text-accent" />
              {key}
            </span>
          ))}
        </div>
      }
    >
      <Monitor />
    </Scene>
  );
}
