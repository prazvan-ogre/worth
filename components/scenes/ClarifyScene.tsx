"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bot, Check, FileCheck2, HelpCircle, Lightbulb, Search, Send, Target, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Scene } from "@/components/ui/Scene";
import { Avatar, Pill, Window } from "@/components/ui/primitives";
import { PRODUCT, sceneById } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;
const STEPS = ["Idea", "Define", "Similar", "Proposal"] as const;

function IdeaStep() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -60, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="w-full max-w-sm rounded-2xl border border-line bg-paper p-5 shadow-float"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-soft text-accent">
            <Lightbulb size={14} />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">New idea</span>
        </div>
        <p className="text-[17px] font-semibold leading-snug tracking-tight">An agent that drafts answers to RFPs</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
          “Our team spends days copying answers from old proposals. Could AI do the first draft?”
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-3">
          <Avatar initials="DO" hue={20} />
          <span className="text-[12px] text-ink-soft">Dana Okafor · Sales</span>
          <span className="ml-auto font-mono text-[11px] text-ink-faint">just now</span>
        </div>
      </motion.div>
    </div>
  );
}

const MATCHES = [
  { name: "Proposal Writer", meta: "Agent · Sales · live", overlap: 82 },
  { name: "Contract clause checker", meta: "App · Legal Ops", overlap: 31 },
  { name: "Answer library in CRM", meta: "Feature · existing tool", overlap: 24 },
];

function CompareStep() {
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setScanned(true), 1300);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2 text-[12.5px] text-ink-soft">
        <Search size={14} className="text-accent" />
        Looking for similar initiatives and tools you could reuse
      </div>
      <div className="relative mb-5 h-1 overflow-hidden rounded-full bg-line-soft">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-accent-glow to-accent"
        />
      </div>
      <ul className="space-y-2.5">
        {MATCHES.map((m, i) => (
          <motion.li
            key={m.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: scanned ? 1 : 0, y: scanned ? 0 : 10 }}
            transition={{ delay: i * 0.15, duration: 0.5, ease }}
            className={`flex items-center gap-3 rounded-xl border p-3.5 ${i === 0 ? "border-accent/30 bg-accent-soft/50" : "border-line bg-paper"}`}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-paper text-ink-soft ring-1 ring-line">
              <Bot size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{m.name}</p>
              <p className="text-[11px] text-ink-faint">{m.meta}</p>
            </div>
            <div className="w-24 text-right">
              <p className={`font-mono text-[13px] font-semibold ${i === 0 ? "text-accent" : "text-ink-soft"}`}>{m.overlap}%</p>
              <p className="text-[10px] text-ink-faint">overlap</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function DefineStep() {
  const fields = [
    { icon: HelpCircle, label: "Problem", value: "Each RFP takes 5 days, mostly copying old answers" },
    { icon: Lightbulb, label: "Proposed solution", value: "An agent that drafts answers from approved past proposals" },
    { icon: Target, label: "Expected outcome", value: "RFPs answered in 2 days · win rate unchanged or better" },
    { icon: Wallet, label: "Estimated effort", value: "~$6,000 and 4 weeks to build · ~$800 / month to run" },
  ];
  return (
    <div className="grid h-full content-center gap-2.5 sm:grid-cols-2">
      {fields.map(({ icon: Icon, label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.18, duration: 0.5, ease }}
          className="rounded-xl border border-line bg-paper p-4"
        >
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
            <Icon size={12} className="text-accent" />
            {label}
          </p>
          <p className="text-[13.5px] font-medium leading-snug text-ink">{value}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ProposalStep() {
  const [sent, setSent] = useState(false);
  const rows = [
    ["Goal", "Answer RFPs in 2 days instead of 5"],
    ["Expected benefit", "≈ 120 hours saved per quarter"],
    ["Initial investment", "~$6,000 · ~$800 / month"],
    ["Similar work", "Proposal Writer (82% overlap) — consider extending it"],
    ["Review date", "8 weeks after launch"],
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="rounded-2xl border border-line bg-paper p-5 shadow-card"
      >
        <div className="mb-4 flex items-center gap-2">
          <Pill tone="ok">
            <FileCheck2 size={11} /> Proposal ready for evaluation
          </Pill>
        </div>
        <p className="mb-3 text-[16px] font-semibold tracking-tight">RFP Drafting Agent</p>
        <dl className="divide-y divide-line-soft">
          {rows.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.45, ease }}
              className="grid grid-cols-[120px_1fr] gap-3 py-2 text-[12.5px] sm:grid-cols-[140px_1fr]"
            >
              <dt className="text-ink-muted">{k}</dt>
              <dd className="text-ink">{v}</dd>
            </motion.div>
          ))}
        </dl>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSent(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-medium transition-colors ${
              sent ? "bg-ok-soft text-ok" : "bg-ink text-paper hover:bg-accent-deep"
            }`}
          >
            {sent ? <Check size={13} /> : <Send size={13} />}
            {sent ? "Sent for review" : "Submit for review"}
          </button>
          <span className="text-[11.5px] text-ink-faint">Goes to the portfolio review</span>
        </div>
      </motion.div>
    </div>
  );
}

function DecisionFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!inView || manual) return;
    const durations = [2800, 3800, 3800, 6500];
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), durations[step]);
    return () => window.clearTimeout(t);
  }, [inView, manual, step]);

  const panels = [<IdeaStep key="i" />, <DefineStep key="d" />, <CompareStep key="c" />, <ProposalStep key="p" />];

  return (
    <div ref={ref}>
      <Window title={`${PRODUCT.name} · New initiative`} right={<span className="font-mono text-[11px] text-ink-faint">Draft</span>}>
        <div className="flex border-b border-line-soft px-2" role="tablist" aria-label="Decision steps">
          {STEPS.map((s, i) => (
            <button
              key={s}
              role="tab"
              aria-selected={i === step}
              onClick={() => {
                setStep(i);
                setManual(true);
              }}
              className="relative flex-1 px-2 py-3 text-[12px] font-medium"
            >
              <span className={`flex items-center justify-center gap-1.5 transition-colors ${i <= step ? "text-ink" : "text-ink-faint"}`}>
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full font-mono text-[9px] transition-colors ${
                    i < step ? "bg-accent text-paper" : i === step ? "bg-ink text-paper" : "bg-line-soft text-ink-faint"
                  }`}
                >
                  {i < step ? <Check size={9} /> : i + 1}
                </span>
                {s}
              </span>
              {i === step && <motion.span layoutId="step-underline" className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent" />}
            </button>
          ))}
        </div>
        <div className="relative h-[430px] p-5 sm:h-[360px] sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease }}
              className="h-full"
            >
              {panels[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </Window>
    </div>
  );
}

export function ClarifyScene() {
  return (
    <Scene
      scene={sceneById("clarify")}
      aside={
        <div className="flex flex-wrap gap-2">
          {["Defined goal", "Expected benefit", "Investment estimate"].map((t) => (
            <Pill key={t} tone="accent">
              <Check size={11} /> {t}
            </Pill>
          ))}
        </div>
      }
    >
      <DecisionFlow />
    </Scene>
  );
}
