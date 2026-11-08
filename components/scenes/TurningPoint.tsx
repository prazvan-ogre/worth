"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * The bridge between the problem and the solution.
 *
 * A tall section with a sticky, full-screen frame driven by scroll:
 *   1. the page darkens and fragments of the problem drift around,
 *   2. they are pulled into the centre and disappear,
 *   3. the Worth mark appears and the frame lifts back into light: "Meet Worth."
 */

const FRAGMENTS = [
  { text: "Unused for 74 days", x: 12, y: 18 },
  { text: "+$1.2k / month", x: 72, y: 14 },
  { text: "Who owns this?", x: 84, y: 38 },
  { text: "Similar agent already exists", x: 8, y: 44 },
  { text: "On hold since March", x: 62, y: 72 },
  { text: "Why did we build this?", x: 22, y: 76 },
  { text: "Tokens +46%", x: 44, y: 10 },
  { text: "No goal set", x: 88, y: 64 },
  { text: "Usage flat", x: 36, y: 88 },
  { text: "Priority changed again", x: 4, y: 62 },
  { text: "Still worth keeping?", x: 76, y: 88 },
  { text: "Unfinished", x: 54, y: 30 },
  { text: "Expected impact: ?", x: 30, y: 28 },
  { text: "Maintenance backlog", x: 66, y: 52 },
];

const CANVAS = "#FAFAF7";
const INK = "#0E0E12";

function Fragment({
  f,
  i,
  progress,
}: {
  f: (typeof FRAGMENTS)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  // drift a little while the problem is on screen, then get pulled into the centre
  const start = 0.36 + (i % 5) * 0.025;
  const end = start + 0.2;
  const left = useTransform(progress, [0, start, end], [`${f.x}%`, `${f.x}%`, "50%"]);
  const top = useTransform(progress, [0, start, end], [`${f.y}%`, `${f.y + (i % 2 ? 3 : -3)}%`, "50%"]);
  const opacity = useTransform(progress, [0.06, 0.16 + (i % 4) * 0.03, start, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1, 0.3]);
  const blur = useTransform(progress, [start, end], ["blur(0px)", "blur(6px)"]);

  return (
    <motion.span
      style={{ left, top, opacity, scale, filter: blur, x: "-50%", y: "-50%" }}
      className="absolute whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[11px] text-white/70 sm:text-[12px]"
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-warn/80 align-middle" />
      {f.text}
    </motion.span>
  );
}

function Mark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="tp-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#3730A3" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="7" fill="url(#tp-g)" />
      <path d="M6.5 8.5l2.6 7 2.9-6 2.9 6 2.6-7" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TurningPoint() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // light → dark → light
  // dark opens from the centre, then light opens from the Worth mark: no grey in between
  const darkClip = useTransform(p, [0, 0.07], ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]);
  const lightClip = useTransform(p, [0.84, 0.93], ["circle(0% at 50% 46%)", "circle(150% at 50% 46%)"]);

  // tell the top bar to switch to its light-on-dark look while the frame is dark
  const setDark = (v: number) => {
    const dark = v > 0.035 && v < 0.88;
    const el = document.documentElement;
    if (dark) el.dataset.dark = "1";
    else delete el.dataset.dark;
  };
  useMotionValueEvent(p, "change", setDark);
  useEffect(() => () => void delete document.documentElement.dataset.dark, []);

  // line 1: the problem
  const line1Opacity = useTransform(p, [0.08, 0.16, 0.4, 0.48], [0, 1, 1, 0]);
  const line1Y = useTransform(p, [0.08, 0.16, 0.4, 0.48], [20, 0, 0, -20]);

  // centre glow where the fragments collapse
  const glowOpacity = useTransform(p, [0.42, 0.6, 0.84, 0.92], [0, 1, 0.8, 0.25]);
  const glowScale = useTransform(p, [0.42, 0.62], [0.4, 1]);

  // the mark and the reveal
  const markOpacity = useTransform(p, [0.56, 0.66], [0, 1]);
  const markScale = useTransform(p, [0.56, 0.7], [0.4, 1]);
  const line2Opacity = useTransform(p, [0.66, 0.74], [0, 1]);
  const line2Y = useTransform(p, [0.66, 0.74], [16, 0]);
  const line2Color = useTransform(p, [0.838, 0.852], ["#FFFFFF", INK]);
  const subColor = useTransform(p, [0.84, 0.856], ["rgba(255,255,255,0.6)", "#71717C"]);

  if (reduce) {
    return (
      <section aria-label="From problem to solution" className="bg-ink px-5 py-32 text-center text-white">
        <p className="mx-auto max-w-2xl text-balance text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] text-white/70">
          So much to build. So little clarity about what’s worth it.
        </p>
        <div className="mt-14 flex flex-col items-center gap-5">
          <Mark />
          <p className="text-headline font-semibold">Meet Worth.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="From problem to solution" className="relative h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div aria-hidden style={{ clipPath: darkClip, backgroundColor: INK }} className="absolute inset-0" />
        <motion.div aria-hidden style={{ clipPath: lightClip, backgroundColor: CANVAS }} className="absolute inset-0" />
        <div aria-hidden className="absolute inset-y-0 inset-x-[22%] sm:inset-x-[7%]">
          {FRAGMENTS.map((f, i) => (
            <Fragment key={f.text} f={f} i={i} progress={p} />
          ))}
        </div>

        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
          <motion.div
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.55),rgba(99,102,241,0.12)_45%,transparent_70%)] blur-2xl"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.p
          style={{ opacity: line1Opacity, y: line1Y }}
          className="max-w-3xl rounded-3xl bg-ink/75 px-5 py-4 text-center backdrop-blur-sm text-balance text-[clamp(1.8rem,4vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white"
        >
          So much to build.
          <br />
          <span className="text-white/45">So little clarity about what’s worth it.</span>
        </motion.p>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <motion.div style={{ opacity: markOpacity, scale: markScale }} className="drop-shadow-[0_0_40px_rgba(99,102,241,0.6)]">
            <Mark size={84} />
          </motion.div>
          <motion.div style={{ opacity: line2Opacity, y: line2Y }}>
            <motion.p style={{ color: line2Color }} className="text-headline font-semibold">
              Meet Worth.
            </motion.p>
            <motion.p style={{ color: subColor }} className="mt-4 text-[17px]">
              From more building to better decisions.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
