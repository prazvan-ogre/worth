"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDownUp, Pause, Play, Square, StepForward } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Scene } from "@/components/ui/Scene";
import { Avatar, Pill, Window } from "@/components/ui/primitives";
import { PRODUCT, sceneById } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;
const BUDGET = 120_000; // this quarter

type Status = "Proposed" | "In progress" | "Live";
type Decision = "Start" | "Continue" | "Pause" | "Stop";

type Row = {
  name: string;
  status: Status;
  owner: string;
  hue: number;
  value: string; // expected value, in words
  score: number; // expected value score, 0–10
  quarterCost: number; // cost this quarter if it goes ahead
  costLabel: string;
  progress: number | null; // % towards goal, null when not started
  suggested: Decision;
};

const ROWS: Row[] = [
  {
    name: "RFP Drafting Agent",
    status: "Proposed",
    owner: "DO",
    hue: 20,
    value: "≈120 h saved / quarter",
    score: 8.4,
    quarterCost: 8_400,
    costLabel: "$6k + 0.8k/mo",
    progress: null,
    suggested: "Start",
  },
  {
    name: "Self-serve Billing",
    status: "In progress",
    owner: "LP",
    hue: 160,
    value: "−30% billing tickets",
    score: 7.6,
    quarterCost: 34_000,
    costLabel: "$34k / qtr",
    progress: 55,
    suggested: "Continue",
  },
  {
    name: "Support Assistant",
    status: "Live",
    owner: "MR",
    hue: 245,
    value: "First reply < 2 hours",
    score: 7.9,
    quarterCost: 29_400,
    costLabel: "$9.8k/mo",
    progress: 82,
    suggested: "Continue",
  },
  {
    name: "Customer Health Score",
    status: "Proposed",
    owner: "AS",
    hue: 30,
    value: "Churn −2 points",
    score: 5.8,
    quarterCost: 26_000,
    costLabel: "$22k + 1.3k/mo",
    progress: null,
    suggested: "Pause",
  },
  {
    name: "Smart Search v2",
    status: "In progress",
    owner: "JK",
    hue: 200,
    value: "−30% support tickets",
    score: 4.2,
    quarterCost: 18_000,
    costLabel: "$18k / qtr",
    progress: 12,
    suggested: "Pause",
  },
  {
    name: "Meeting Notes Agent",
    status: "Live",
    owner: "TB",
    hue: 300,
    value: "Notes within the hour",
    score: 1.5,
    quarterCost: 3_700,
    costLabel: "$1.2k/mo",
    progress: 0,
    suggested: "Stop",
  },
];

const OPTIONS: Record<Status, Decision[]> = {
  Proposed: ["Start", "Pause"],
  "In progress": ["Continue", "Pause", "Stop"],
  Live: ["Continue", "Stop"],
};

const DECISION_ICON = { Start: Play, Continue: StepForward, Pause: Pause, Stop: Square } as const;
const DECISION_LABEL: Record<Decision, string> = { Start: "Start", Continue: "Continue", Pause: "Put on hold", Stop: "Stop" };

const funded = (d: Decision | null, status: Status) =>
  d === "Start" || d === "Continue" || (d === null && status !== "Proposed");

const money = (n: number) => `$${Math.round(n / 1000)}k`;

function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [decisions, setDecisions] = useState<(Decision | null)[]>(ROWS.map(() => null));
  const [touched, setTouched] = useState(false);
  const [sort, setSort] = useState<"value" | "cost">("value");

  // Leadership works through the list, one decision at a time, until the viewer takes over.
  useEffect(() => {
    if (!inView || touched) return;
    const order = ROWS.map((r, i) => ({ r, i })).sort((a, b) => b.r.score - a.r.score);
    const timers = order.map(({ r, i }, k) =>
      window.setTimeout(() => setDecisions((d) => d.map((x, j) => (j === i && !x ? r.suggested : x))), 1400 + k * 750),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [inView, touched]);

  const rows = useMemo(
    () =>
      ROWS.map((r, i) => ({ ...r, i })).sort((a, b) =>
        sort === "value" ? b.score - a.score : b.quarterCost - a.quarterCost,
      ),
    [sort],
  );

  const allocated = ROWS.reduce((sum, r, i) => sum + (funded(decisions[i], r.status) ? r.quarterCost : 0), 0);
  const pct = Math.round((allocated / BUDGET) * 100);
  const decided = decisions.filter(Boolean).length;

  return (
    <div ref={ref}>
      <Window
        title={`${PRODUCT.name} · Portfolio review`}
        right={<span className="font-mono text-[11px] text-ink-faint">Q1 planning</span>}
      >
        {/* budget allocation */}
        <div className="border-b border-line-soft px-5 py-4">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <p className="text-[12px] text-ink-muted">
              Quarterly budget allocated
              <span className="ml-2 font-mono text-ink">
                {money(allocated)} / {money(BUDGET)}
              </span>
            </p>
            <span className={`font-mono text-[12px] tabular-nums ${pct > 100 ? "text-warn" : "text-ink"}`}>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line-soft">
            <motion.div
              className={`h-full rounded-full ${pct > 100 ? "bg-warn" : "bg-accent"}`}
              animate={{ width: `${Math.min(100, pct)}%` }}
              transition={{ duration: 0.8, ease }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-line-soft px-4 py-2">
          <div className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
            <ArrowDownUp size={12} />
            Compare by
          </div>
          <div className="flex gap-1" role="tablist" aria-label="Sort initiatives">
            {(["value", "cost"] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={sort === k}
                onClick={() => setSort(k)}
                className={`relative rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  sort === k ? "text-ink" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {sort === k && (
                  <motion.span layoutId="focus-sort" className="absolute inset-0 rounded-full bg-canvas ring-1 ring-line" />
                )}
                <span className="relative">{k === "value" ? "Expected value" : "Cost"}</span>
              </button>
            ))}
          </div>
        </div>

        <ul>
          {rows.map((r) => {
            const d = decisions[r.i];
            const dim = d === "Pause" || d === "Stop";
            return (
              <motion.li
                layout
                key={r.name}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="border-t border-line-soft px-4 py-3 first:border-t-0"
              >
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_100px_96px]">
                  <div className={`min-w-0 transition-opacity duration-500 ${dim ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Avatar initials={r.owner} hue={r.hue} />
                      <span className="truncate text-[13px] font-medium">{r.name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 pl-8">
                      <Pill tone={r.status === "Proposed" ? "accent" : r.status === "Live" ? "ok" : "neutral"}>{r.status}</Pill>
                      <span className="truncate text-[11px] text-ink-faint sm:hidden">{r.value}</span>
                    </div>
                  </div>
                  <div className={`hidden min-w-0 sm:block ${dim ? "opacity-50" : ""}`}>
                    <p className="truncate text-[12px] text-ink-soft">{r.value}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-line-soft">
                        <div className="h-full rounded-full bg-ink" style={{ width: `${r.score * 10}%` }} />
                      </div>
                      <span className="whitespace-nowrap font-mono text-[10.5px] text-ink-faint">value {r.score.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className={`hidden text-right sm:block ${dim ? "opacity-50" : ""}`}>
                    <p className="whitespace-nowrap font-mono text-[11.5px] text-ink">{r.costLabel}</p>
                    <p className="whitespace-nowrap text-[10.5px] text-ink-faint">
                      {r.progress === null ? "not started" : `${r.progress}% to goal`}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1" role="group" aria-label={`Decision for ${r.name}`}>
                    {OPTIONS[r.status].map((o) => {
                      const Icon = DECISION_ICON[o];
                      const on = d === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={on}
                          title={DECISION_LABEL[o]}
                          aria-label={DECISION_LABEL[o]}
                          onClick={() => {
                            setTouched(true);
                            setDecisions((prev) => prev.map((x, j) => (j === r.i ? (x === o ? null : o) : x)));
                          }}
                          className={`inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-full border px-2 text-[11px] font-medium transition-all duration-300 ease-cine ${
                            on
                              ? o === "Stop"
                                ? "border-warn bg-warn text-paper"
                                : "border-ink bg-ink text-paper"
                              : "border-line text-ink-muted hover:border-ink-faint hover:text-ink"
                          }`}
                        >
                          <Icon size={10} />
                          <span className="hidden 2xl:inline">{DECISION_LABEL[o]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-line-soft px-4 py-3 text-[12px]">
          <span className="text-ink-muted">
            {decided} of {ROWS.length} decided
          </span>
          <AnimatePresence>
            {decided === ROWS.length && (
              <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Pill tone={pct > 100 ? "warn" : "ok"}>{pct > 100 ? "Over budget" : "Within budget"}</Pill>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Window>
    </div>
  );
}

export function FocusScene() {
  return (
    <Scene
      scene={sceneById("focus")}
      layout="reverse"
      aside={
        <div className="flex flex-wrap gap-2">
          {(["Start", "Continue", "Pause", "Stop"] as const).map((d) => {
            const Icon = DECISION_ICON[d];
            return (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-soft"
              >
                <Icon size={11} className="text-accent" />
                {DECISION_LABEL[d]}
              </span>
            );
          })}
        </div>
      }
    >
      <Dashboard />
    </Scene>
  );
}
