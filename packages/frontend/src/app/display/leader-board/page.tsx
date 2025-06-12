"use client";

import { ActiveRace, RaceState, RacetrackClientRole } from "racetrack-shared/types"; import { useEffect, useState } from "react";
import { RaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { LoginWrapper } from "@/components/authentication/Login";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { RaceScheduleStateProvider, useRaceScheduleState } from "@/app/providers/state/raceScheduleStateProvider";
import LeaderboardTable from "@/components/table/leaderboard";
import Header from "@/components/display/leaderboard-header";


function LeaderboardPage() {
  const raceScheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();


  if (!raceScheduleState) {
    return <div>Loading...</div>;
  }
  const [race, setRace] = useState<ActiveRace>()

  useEffect(() => {

    if (activeRaceState.activeRaceState) {
      setRace(activeRaceState.activeRaceState);
    }

  }, [activeRaceState.activeRaceState, raceScheduleState]);

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
