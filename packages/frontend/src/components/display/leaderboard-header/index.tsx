"use client";

import { ActiveRace, RaceState } from "racetrack-shared/types";
import React from "react";
import { SmallRedFlag, SmallCheckeredFlag, SmallYellowFlag, SmallGreenFlag } from "../small-flags";


// 1. ActiveRaceData tuleb sisse
// 2. Dekonstrueerime timeriks ja raceStateiks ja isHazard ja isFinsihingiks
// 3. Timeri panna Headeri komponenti
// 4. raceStateid + isHazard & isFinishing panna raceFlagMapi
// 5. Mapist ssadud lipu panna Headeri komponenti


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

  const flag = raceFlagMap({ activeRace: activeRaceData });
  return (
    <div className="bg-black text-white px-6 py-4 w-full max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center">

        <div className="flex justify-between items-center">
          {flag}
          {/* Left Section */}
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
        <div className="flex flex-col items-end">
          <span className="text-sm">TIME LEFT</span>
          <span className="font-bold text-lg">08:05:03</span>
        </div>
      </div>
    </div>

  );
};

