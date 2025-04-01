"use client";

import { RaceState } from "@/racetrack/state";
import { useRaceSocket } from "@/racetrack/services/sockets/ActiveRaceSocket";
import { useEffect } from "react";
import { RaceFlagGreen, RaceFlagYellow, RaceFlagRed, RaceFlagCheckered } from "@/components/display/flags";

// Mapping between race states and race flags
const raceFlags = (raceState: RaceState, isHazard: boolean, isDanger: boolean, isFinishing: boolean) => {
    console.log('raceFlags received:', { raceState, isHazard, isDanger, isFinishing });

    switch(raceState) {
        case 'pending': return <RaceFlagRed />;
        
        case 'active': return isHazard ? <RaceFlagYellow /> : isDanger ? <RaceFlagRed /> : isFinishing ? <RaceFlagCheckered /> : <RaceFlagGreen />; 
        
        case 'completed': return <RaceFlagRed />;
        
        case 'canceled': return <RaceFlagRed />;
            
        default: return null;
    }
};



export default function Page() {

    const { activeRace, connectSocket, disconnectSocket } = useRaceSocket();

     useEffect(() => {   
        connectSocket();
    
      return () => { // Clean up on unmount
        disconnectSocket();
      };
    }, []);
    
    const { raceState, isHazard, isDanger, isFinishing } = activeRace;

    return (
        <div className="min-h-screen w-full">
            {raceFlags(raceState, isHazard, isDanger, isFinishing)}
        </div>
    );
}
