"use client";

import { MotionConfig } from "framer-motion";
import { SceneProvider } from "@/components/SceneProvider";
import { FilmProvider } from "@/components/film/FilmPlayer";
import { Atmosphere, ChapterNav, TopBar } from "@/components/ui/Chrome";
import { OpeningScene } from "@/components/scenes/OpeningScene";
import { CompetitionScene } from "@/components/scenes/CompetitionScene";
import { CostsScene } from "@/components/scenes/CostsScene";
import { ValueScene } from "@/components/scenes/ValueScene";
import { MeetScene } from "@/components/scenes/MeetScene";
import { ClarifyScene } from "@/components/scenes/ClarifyScene";
import { FocusScene } from "@/components/scenes/FocusScene";
import { FocusedPortfolio } from "@/components/scenes/FocusedPortfolio";
import { MeasureScene } from "@/components/scenes/MeasureScene";
import { ClosingScene } from "@/components/scenes/ClosingScene";

export function Story() {
  return (
    <MotionConfig reducedMotion="user">
      <SceneProvider>
        <FilmProvider>
          <Atmosphere />
          <TopBar />
          <ChapterNav />
          <main className="relative">
            <OpeningScene />
            <CompetitionScene />
            <CostsScene />
            <ValueScene />
            <MeetScene />
            <ClarifyScene />
            <FocusScene />
            <FocusedPortfolio />
            <MeasureScene />
            <ClosingScene />
          </main>
        </FilmProvider>
      </SceneProvider>
    </MotionConfig>
  );
}
