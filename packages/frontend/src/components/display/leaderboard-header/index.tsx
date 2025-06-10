"use client";

import { ActiveRace, RaceState } from "racetrack-shared/types";
import React from "react";
import { SmallRedFlag, SmallCheckeredFlag, SmallYellowFlag, SmallGreenFlag } from "../small-flags";


const raceFlagMap = ({ activeRace }: { activeRace: ActiveRace }) => {
  const raceState = activeRace.raceState;

  switch (raceState) {
    case RaceState.Pending:
    case RaceState.Paused:
    case RaceState.Completed:
    case RaceState.Canceled:
      return <div className="scale-75"><SmallRedFlag /></div>;
    case RaceState.Active:
      if (activeRace.isFinishing) return <SmallCheckeredFlag />;
      if (activeRace.isHazard) return <SmallYellowFlag />;
      return <div className="scale-50"><SmallGreenFlag /></div>; // Smaller green flag
    default:
      return <SmallRedFlag />;
  }
};


interface HeaderProps {
  activeRaceData: ActiveRace;
}

export default function Header({ activeRaceData }: HeaderProps) {

  const formattedTime = formatTimeLeft(activeRaceData.timeLeft);
  const flag = raceFlagMap({ activeRace: activeRaceData });

  return (
    <div className="bg-black text-white px-6 py-4 w-full max-w-screen-lg mx-auto">
      <div className="relative h-20 flex items-center justify-center">

        {/* Left Section */}
        <div className="absolute left-0 flex items-center gap-2">
          {flag}
          <div className="flex flex-col items-start">
            <span className="text-sm">TRACK STATE</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg capitalize">
                {activeRaceData.raceState}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold">RACE LEADERBOARD</span>
          <div className="h-1 w-full bg-gradient-to-r from-black via-red-500 to-bl"></div>
          <span className="text-sm">BEACHSIDE RACETRACK</span>
        </div>

        {/* Right Section */}
        <div className="absolute right-0 flex flex-col items-end">
          <span className="text-sm">TIME ELAPSED</span>
          <span className="font-bold text-lg">{formattedTime}</span>
          {/* <span className="font-bold text-lg">{activeRaceData.timeLeft}</span> */}
        </div>
      </div>
    </div>

  );
};

function formatTimeLeft(ms: number): string {
  const clampedMs = Math.min(ms, 10 * 60 * 1000); // Cap at 10 min max

  const absMs = Math.abs(clampedMs); // Always positive for display
  const totalSeconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((absMs % 1000) / 10); // centiseconds

  const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
  return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}
