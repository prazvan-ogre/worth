# Worth — concept story site

A cinematic one-page presentation for **Worth**, a product concept that helps teams
decide what is worth building, track the real cost of AI initiatives, and measure
whether they deliver value.

Stack: **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion**.

```bash
npm install
npm run dev        # http://localhost:3100
npm run build && npm start
```

## The story (9 scenes, 4 parts)

| Part | Scene | Visual |
|---|---|---|
| The problem | It’s never been easier to build anything. But is everything worth building? | A prompt becomes a live app, an AI agent spins up, features burst around it |
| | Every new idea competes for the same resources. | A shared backlog that keeps re-ordering; new work jumps the queue, other work is put on hold |
| | And every launch comes with a long-term commitment. | One launch’s running costs (tokens, cloud, subscriptions, support, maintenance), then more launches piling up |
| | But how much of what we build actually delivers value? | Features shipped ×4 against flat usage, and an idle agent that still costs money |
| Introducing Worth | Meet Worth — make better decisions about what to build, keep, and improve. | The portfolio inside Worth: proposed and live apps, agents and features with goals, owners, costs and outcomes; Clarify · Focus · Measure |
| How Worth works | Clarify. Before you build, know why. | Idea → problem, solution, outcome, effort → similar work to reuse → proposal ready for evaluation |
| | Focus. Put your resources where they matter most. | Portfolio review: compare by value or cost, decide start / continue / put on hold / stop, watch the budget |
| | Measure. Did it deliver what you expected? | Expected vs. actual insights, then improve / scale / combine / retire |
| Closing | Build only what matters. | A crowded portfolio collapses into a few initiatives with goals, owners and outcomes; the Worth brand; the call to action |

## Where to change things

- **All copy, the film script and the film link:** `lib/story.ts` (also product name, status label, contact email, booking link).
- **Design tokens** (one indigo accent, warm neutral canvas, ink scale, shadows, type scale): `tailwind.config.ts`.
- **Scenes:** `components/scenes/*`. Shared building blocks (window frame, pills, count-ups, sparklines, `VideoLoop`) in `components/ui/primitives.tsx`; the scene wrapper with scroll reveal, parallax drift and scene tracking in `components/ui/Scene.tsx`.
- **Video clips:** drop an MP4/WebM into `public/` and render `<VideoLoop src="/clip.mp4" />` inside any scene. It only plays while visible and respects reduced motion.

## Promotional film

The site is ready to launch a promotional film once it exists. Until then, nothing
film-related is shown.

When the film is ready, set `FILM.src` in `lib/story.ts`:

- a **YouTube or Vimeo link** (e.g. `https://youtu.be/…` or `https://vimeo.com/123456`), or
- a **video file** placed in `public/film/` (e.g. `"/film/worth.mp4"`), optionally with a `poster` image.

A “Watch the film” button then appears in the opening scene and plays the film
full-screen in a modal (Esc or click outside to close). Each scene’s `narration`
field in `lib/story.ts` is both the on-screen story text and the film’s voice-over script.

## Accessibility & motion

- `prefers-reduced-motion` is honoured globally (`MotionConfig reducedMotion="user"`, CSS loops disabled).
- Every scene has a real heading; controls are labelled buttons; the film player is a dialog closable with Esc.
- Layouts are tested at 390px and 1440px wide without horizontal scroll.
