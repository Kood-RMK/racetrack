"use client";

import { ActiveRace, RaceState, RacetrackClientRole } from "racetrack-shared/types";import { useEffect, useState } from "react";
import { RaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { LoginWrapper } from "@/components/authentication/Login";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { RaceScheduleStateProvider, useRaceScheduleState } from "@/app/providers/state/raceScheduleStateProvider";
import LeaderboardTable from "@/components/table/leaderboard";
import Header from "@/components/display/leaderboard-header";
import { SmallCheckeredFlag, SmallGreenFlag, SmallRedFlag, SmallYellowFlag } from "@/components/display/small-flags";



function LeaderboardPage() {
  const raceScheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();
  const raceController = useActiveRaceController();
  

  if (!raceController || !raceScheduleState) {
    return <div>Loading...</div>;
  }
  const [race, setRace] = useState<ActiveRace>()

  useEffect(() => {

    if (activeRaceState.activeRaceState) {
      setRace(activeRaceState.activeRaceState);
    }

  }, [activeRaceState.activeRaceState, raceScheduleState]);

    console.log("raceState: ", race?.raceState)

    return (
      race ? <div>
        <div className="bg-black min-h-screen min-w-screen text-white flex flex-col items-center pt-10">
          <Header activeRaceData={race} 
          
          />
          <div>
        {/* {race ? raceFlagMap({ activeRace: race }) : <SmallRedFlag />} */}
      </div>
          <LeaderboardTable />
        </div>
      </div> : "Loading ..."
    );
  }


      
export default function Page() {
  return (
    <AuthenticationProvider>
      <LoginWrapper options={{ permittedRoles: [RacetrackClientRole.SAFETY] }}>
        <SocketProvider url="http://localhost:3001">
          <RaceScheduleStateProvider>
            <ActiveRaceStateProvider>
              <RaceControllerProvider>
                <LeaderboardPage />
              </RaceControllerProvider>
            </ActiveRaceStateProvider>
          </RaceScheduleStateProvider>
        </SocketProvider>
      </LoginWrapper>
    </AuthenticationProvider>
  )
}  
  
  
  
  //     "use client";

  //     import { useEffect } from "react";
  //     import LeaderboardTable from '@/components/table/leaderboard';
  // import { RaceState } from "racetrack-shared/types";
  // import Header from "@/components/display/leaderboard-header";


  //     export default function RaceTimerPage() {
      
  //     //   Use the custom hook to manage socket and race state
  //     //   const { activeRace, connectSocket, disconnectSocket } = useRaceSocket();
      
  //       // Connect to the socket server
  //     //   useEffect(() => {   
  //     //     connectSocket();

  //     //   return () => { // Clean up on unmount
  //     //     disconnectSocket();
  //     //   };
  //     // }, []);


  //     //   Mapping between race state and word displayed
  //       const getStateLabel = (raceState: RaceState, isHazard: boolean, isDanger: boolean, isFinishing: boolean): string => {

  //         switch (raceState) {

  //           case 'active': return isHazard ? 'HAZARD' : isDanger ? 'DANGER' : isFinishing ? 'FINISHING' : 'SAFE';

  //           case 'pending': return 'PENDING';

  //           case 'completed': return 'COMPLETED';

  //           case 'canceled': return 'CANCELED';
            
  //           default: return 'UNKNOWN'; // <-- fallback
  //         }
  //       };

  //       // Destructures the activeRace object & creates a variable for each value
  //     //   const { raceState, isHazard, isDanger, isFinishing } = activeRace;

  //       // Calls the function getStateLabel and passes in the values I extracted in the line above & returns a label
  //     //   const label = getStateLabel(raceState, isHazard, isDanger, isFinishing);
      
      
  //       return (

  //         <div className="bg-black min-h-screen min-w-screen text-white flex flex-col items-center pt-10">
  //           <Header trackStateLabel={'PENDING'} />
  //           <LeaderboardTable />
  //         </div>
  //       );
  //     }

    // function useRaceSocket(): { activeRace: any; connectSocket: any; disconnectSocket: any; } {
    //     throw new Error("Function not implemented.");
    // }
