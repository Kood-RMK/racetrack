"use client";

import { ActiveRace } from "racetrack-shared/types"; import { useEffect, useState } from "react";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { RaceScheduleStateProvider, useRaceScheduleState } from "@/app/providers/state/raceScheduleStateProvider";
import LeaderboardTable from "@/components/table/leaderboard";
import Header from "@/components/display/leaderboard-header";


function LeaderboardPage() {
  const raceScheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();

  const [race, setRace] = useState<ActiveRace>()

  useEffect(() => {

    if (activeRaceState.activeRaceState) {
      setRace(activeRaceState.activeRaceState);
    }

  }, [activeRaceState.activeRaceState, raceScheduleState]);


  if (!raceScheduleState) {
    return <div>Loading...</div>;
  }

  return (
    race ? <div>
      <div className="bg-black min-h-screen min-w-screen text-white flex flex-col items-center pt-10">
        <Header activeRaceData={race} />
        <LeaderboardTable activeRaceData={race} />
      </div>
    </div> : <div className="bg-black min-h-screen min-w-screen flex justify-center items-center text-white">
      <div className="font-medium md:text-4xl">No ongoing races</div>
    </div>
  );
}


export default function Page() {
  return (
    <AuthenticationProvider>
      <SocketProvider>
        <RaceScheduleStateProvider>
          <ActiveRaceStateProvider>
            <LeaderboardPage />
          </ActiveRaceStateProvider>
        </RaceScheduleStateProvider>
      </SocketProvider>
    </AuthenticationProvider>
  )
}