    "use client";

    import { useEffect } from "react";
    import LeaderboardTable from '@/components/table/leaderboard';
import { RaceState } from "racetrack-shared/types";
import Header from "@/components/display/leaderboard-header";


    export default function RaceTimerPage() {
    
    //   Use the custom hook to manage socket and race state
    //   const { activeRace, connectSocket, disconnectSocket } = useRaceSocket();
    
      // Connect to the socket server
    //   useEffect(() => {   
    //     connectSocket();

    //   return () => { // Clean up on unmount
    //     disconnectSocket();
    //   };
    // }, []);


    //   Mapping between race state and word displayed
      const getStateLabel = (raceState: RaceState, isHazard: boolean, isDanger: boolean, isFinishing: boolean): string => {

        switch (raceState) {

          case 'active': return isHazard ? 'HAZARD' : isDanger ? 'DANGER' : isFinishing ? 'FINISHING' : 'SAFE';

          case 'pending': return 'PENDING';

          case 'completed': return 'COMPLETED';

          case 'canceled': return 'CANCELED';
          
          default: return 'UNKNOWN'; // <-- fallback
        }
      };

      // Destructures the activeRace object & creates a variable for each value
    //   const { raceState, isHazard, isDanger, isFinishing } = activeRace;

      // Calls the function getStateLabel and passes in the values I extracted in the line above & returns a label
    //   const label = getStateLabel(raceState, isHazard, isDanger, isFinishing);
    
    
      return (

        <div className="bg-black min-h-screen min-w-screen text-white flex flex-col items-center pt-10">
          <Header trackStateLabel={'PENDING'} />
          <LeaderboardTable />
        </div>
      );
    }

    // function useRaceSocket(): { activeRace: any; connectSocket: any; disconnectSocket: any; } {
    //     throw new Error("Function not implemented.");
    // }
