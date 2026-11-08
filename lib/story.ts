/**
 * The whole story lives here: one entry per scene.
 * Copy, the film script and the film link are edited in this file only.
 */

export const PRODUCT = {
  name: "Worth",
  tagline: "Build only what matters.",
  status: "Concept in development",
  contactEmail: "razvano7@yahoo.com",
  bookingUrl: "mailto:razvano7@yahoo.com?subject=Let%E2%80%99s%20talk%20about%20Worth",
};

/**
 * The promotional film. Leave `src` empty until the film exists: every
 * "Watch the film" button stays hidden until then.
 *
 * `src` can be a YouTube or Vimeo link, or a video file (e.g. "/film/worth.mp4"
 * placed in public/film/). `poster` is an optional still shown before playback.
 */
export const FILM = {
  src: "",
  poster: "",
  duration: "2 min",
};

export type SceneId =
  | "opening"
  | "competition"
  | "costs"
  | "value"
  | "meet"
  | "clarify"
  | "focus"
  | "measure"
  | "closing";

export type Scene = {
  id: SceneId;
  /** Short label used in the chapter navigation. */
  label: string;
  /** Small label above the headline (the part of the story). Empty to hide. */
  eyebrow: string;
  /** Which side of the story the scene is on; drives the colour coding. */
  part: "intro" | "problem" | "solution" | "closing";
  headline: string;
  /** On-screen story text for the scene; also the voice-over script for the film. */
  narration: string;
};

export const SCENES: Scene[] = [
  // PART 1 — THE PROBLEM
  {
    id: "opening",
    part: "intro",
    label: "The question",
    eyebrow: "",
    headline: "It’s never been easier to build anything. But is everything worth building?",
    narration:
      "With AI, ideas can quickly become apps, agents, and features. We can experiment more and build faster than ever before. But how do we decide what deserves our time, attention, and budget?",
  },
  {
    id: "competition",
    part: "problem",
    label: "Competing priorities",
    eyebrow: "The problem",
    headline: "Every new idea competes for the same resources.",
    narration:
      "A new idea. A customer request. Another workflow we want to automate. Each one sounds promising. But every new initiative takes time, money, and attention away from something else. So what should we prioritize, and what should we put on hold?",
  },
  {
    id: "costs",
    part: "problem",
    label: "Long-term commitment",
    eyebrow: "The problem",
    headline: "And every launch comes with a long-term commitment.",
    narration:
      "And the investment doesn’t end when we launch. Every app, agent, or feature needs resources to keep running. Infrastructure, AI tokens, maintenance, and support. The more we build, the more we commit to maintaining.",
  },
  {
    id: "value",
    part: "problem",
    label: "Delivered value",
    eyebrow: "The problem",
    headline: "But how much of what we build actually delivers value?",
    narration:
      "We keep building and launching. But are people actually using what we’ve created? Are we saving time, reducing costs, or improving results? And how often do we go back and question whether something is still worth keeping?",
  },
  // PART 2 — INTRODUCING WORTH
  {
    id: "meet",
    part: "solution",
    label: "Meet Worth",
    eyebrow: "Introducing Worth",
    headline: "Make better decisions about what to build, keep, and improve.",
    narration:
      "Meet Worth. A platform that helps teams make better decisions about their ideas, investments, and existing solutions. From deciding what to build, to prioritizing resources and measuring results, Worth connects every initiative to the value it’s expected to deliver.",
  },
  // PART 3 — HOW WORTH WORKS
  {
    id: "clarify",
    part: "solution",
    label: "Clarify",
    eyebrow: "How Worth works",
    headline: "Clarify. Before you build, know why.",
    narration:
      "Every idea starts with a few simple questions. What are we trying to solve? Why does it matter? And what results do we expect? Worth helps teams turn ideas into clear proposals, with defined goals, expected benefits, and an initial investment estimate.",
  },
  {
    id: "focus",
    part: "solution",
    label: "Focus",
    eyebrow: "How Worth works",
    headline: "Focus. Put your resources where they matter most.",
    narration:
      "Not every good idea can become a priority. Worth gives leaders a clear view of proposed, ongoing, and existing initiatives, helping them compare expected value, costs, and progress. So they can decide what to start, what to continue, and what to put on hold.",
  },
  {
    id: "measure",
    part: "solution",
    label: "Measure",
    eyebrow: "How Worth works",
    headline: "Measure. Did it deliver what you expected?",
    narration:
      "Launching is just the beginning. Worth helps teams track actual costs, usage, and results against the goals they originally set. It highlights where expectations aren’t being met, so teams can decide what to improve, scale, combine, or retire.",
  },
  // PART 4 — THE CLOSING MESSAGE
  {
    id: "closing",
    part: "closing",
    label: "Build only what matters",
    eyebrow: "",
    headline: "Build only what matters.",
    narration: "In a world where everyone can build anything, make sure you build only what matters.",
  },
];

export const sceneById = (id: SceneId) => SCENES.find((s) => s.id === id)!;
