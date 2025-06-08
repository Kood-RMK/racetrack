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
  console.log("activeRaceState: ", activeRaceState)
  if (!raceController || !raceScheduleState) {

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

      <div className="min-h-screen w-full">
        {race ? raceFlagMap({ activeRace: race }) : <RaceFlagRed />}
      </div>
    </div> : <div>Loading...</div>
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
// "use client";

// import { RaceFlagGreen, RaceFlagYellow, RaceFlagRed, RaceFlagCheckered } from "@/components/display/flags";
// import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/state/activeRaceStateProvider";
// import { ActiveRace, RaceContestant, RaceState } from "racetrack-shared/types";
// import { SocketProvider } from "@/app/providers/socket/socketProvider";
// import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
// import { useEffect, useState } from "react";
// import { RaceScheduleStateProvider } from "@/app/providers/state/raceScheduleStateProvider";
// import { RaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";

// // Mapping between race states and race flags
// // Mapping between race state and flag display
// const raceFlagMap = ({ activeRace }: { activeRace: ActiveRace }) => {
//     const raceState = activeRace.raceState;

//     switch (raceState) {
//         case RaceState.Pending:
//         case RaceState.Paused:
//         case RaceState.Completed:
//         case RaceState.Canceled:
//             return <RaceFlagRed />;
//         case RaceState.Active:
//             if (activeRace.isFinishing) return <RaceFlagCheckered />;
//             if (activeRace.isHazard) return <RaceFlagYellow />;
//             return <RaceFlagGreen />;
//         default:
//             return <RaceFlagRed />;
//     }
// };


// function RaceFlagDisplayPage() {
//     const activeRaceState = useActiveRaceState();
//     const [race, setRace] = useState<ActiveRace | null>(null);

//     console.log("RACE: ", race)

//     const raceController = useActiveRaceController();
//     const [contestants, setContestants] = useState<RaceContestant[]>([]);

//     useEffect(() => {

//         console.log("ActiveRaceState received:", activeRaceState);


//         if (activeRaceState?.activeRaceState?.raceState) {
//             console.log("Setting race to:", activeRaceState);
//             setRace(activeRaceState.activeRaceState);
//         } else {
//             console.log("No active race state found.");
//             setRace(null);
//         }
//     }, [activeRaceState]);

//     return (
//         <div className="min-h-screen w-full">
//             {race ? raceFlagMap({ activeRace: race }) : <RaceFlagRed />}
//         </div>
//     );
// }

// export default function Page() {
//     return (
//         <AuthenticationProvider>
//             <SocketProvider url="http://localhost:3001">
//                 <RaceScheduleStateProvider>
//                     <ActiveRaceStateProvider>
//                         {/* <RaceControllerProvider> */}
//                         <RaceFlagDisplayPage></RaceFlagDisplayPage>
//                         {/* </RaceControllerProvider> */}
//                     </ActiveRaceStateProvider>
//                 </RaceScheduleStateProvider>
//             </SocketProvider>
//         </AuthenticationProvider>
//     )
// }