"use client";

import { ActiveRace, RaceState, RacetrackClientRole } from "racetrack-shared/types";import { useEffect, useState } from "react";
import { RaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { LoginWrapper } from "@/components/authentication/Login";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { RaceScheduleStateProvider, useRaceScheduleState } from "@/app/providers/state/raceScheduleStateProvider";
import { RaceFlagCheckered, RaceFlagGreen, RaceFlagRed, RaceFlagYellow } from "@/components/display/flags";

const raceFlagMap = ({ activeRace }: { activeRace: ActiveRace }) => {
  const raceState = activeRace.raceState;

  switch (raceState) {
    case RaceState.Pending:
    case RaceState.Paused:
    case RaceState.Completed:
    case RaceState.Canceled:
      return <RaceFlagRed />;
    case RaceState.Active:
      if (activeRace.isFinishing) return <RaceFlagCheckered />;
      if (activeRace.isHazard) return <RaceFlagYellow />;
      return <RaceFlagGreen />;
    default:
      return <RaceFlagRed />;
  }
};


function RaceControlPage() {

  const raceScheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();
  const raceController = useActiveRaceController();
  const [race, setRace] = useState<ActiveRace>()
  
  if (!raceController || !raceScheduleState || !race) {
    return <RaceFlagRed />;
  }

  
  useEffect(() => {

    if (activeRaceState.activeRaceState) {
      setRace(activeRaceState.activeRaceState);
    }

  }, [activeRaceState.activeRaceState, raceScheduleState]);


  return (
    race ? <div>

      <div className="min-h-screen w-full">
        {race ? raceFlagMap({ activeRace: race }) : <RaceFlagRed />}
      </div>
    </div> : <RaceFlagRed />
  )
}


export default function Page() {
  return (
    <AuthenticationProvider>
      <LoginWrapper options={{ permittedRoles: [RacetrackClientRole.SAFETY] }}>
        <SocketProvider url="http://localhost:3001">
          <RaceScheduleStateProvider>
            <ActiveRaceStateProvider>
              <RaceControllerProvider>
                <RaceControlPage />
              </RaceControllerProvider>
            </ActiveRaceStateProvider>
          </RaceScheduleStateProvider>
        </SocketProvider>
      </LoginWrapper>
    </AuthenticationProvider>
  )
}
