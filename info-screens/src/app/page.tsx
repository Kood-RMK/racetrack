"use client";

import React from "react";
import RaceCard from '@/components/card/timeslot-card/RaceScheduleCard';
import { RaceScheduleTags, RacePendingTags, ActiveRaceTags, ActiveRaceHazardTags, ActiveRaceDangerTags, RaceCancelledTags, EndSessionTags } from "@/components/card/timeslot-card/Tags";
import { RaceScheduleButtons, RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, RaceCancelledButtons, EndSessionButtons } from "@/components/card/timeslot-card/Buttons";

export default function RaceCardPage() {
    return (
      <main className="flex justify-center items-center h-screen bg-gray-200">
        <RaceCard tags={<RaceScheduleTags />} buttons={< RaceScheduleButtons/>} />
      </main>
    );
  }