"use client";

import { ActiveRace } from "racetrack-shared/types"; import { useEffect, useState } from "react";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { RaceScheduleStateProvider, useRaceScheduleState } from "@/app/providers/state/raceScheduleStateProvider";

function LeaderboardPage() {
  const raceScheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();

  if (!raceScheduleState) {
    return <div>Loading...</div>;
  }

  const [race, setRace] = useState<ActiveRace>()

  const activeRaceData = race?.timeLeft;
  const formattedTime = activeRaceData ? formatTimeLeft(activeRaceData) : '00:00:00';

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

  useEffect(() => {

    if (activeRaceState.activeRaceState) {
      setRace(activeRaceState.activeRaceState);
    }

  }, [activeRaceState.activeRaceState, raceScheduleState]);

  console.log("raceState: ", race?.raceState)

  return (
    race ? <div>
      <div className="bg-black min-h-screen min-w-screen text-white flex items-center justify-center text-9xl">

       {formattedTime}
       {race.}

      </div>
    </div> : "Loading ..."
  );
}


export default function Page() {
  return (
    <AuthenticationProvider>
      <SocketProvider url="http://localhost:3001">
        <RaceScheduleStateProvider>
          <ActiveRaceStateProvider>
            <LeaderboardPage />
          </ActiveRaceStateProvider>
        </RaceScheduleStateProvider>
      </SocketProvider>
    </AuthenticationProvider>
  )
}

