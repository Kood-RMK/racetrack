"use client";

import { RaceFlagGreen, RaceFlagYellow, RaceFlagRed, RaceFlagCheckered } from "@/components/display/flags";
import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/state/activeRaceStateProvider";
import { ActiveRace } from "racetrack-backend/types";
import { SocketProvider } from "@/app/providers/socket/socketProvider";

// Mapping between race states and race flags
const raceFlagMap = (activeRace: ActiveRace) => {
    const {isHazard, isFinishing, raceState} = activeRace;
    switch(raceState) {
        case 'pending': return <RaceFlagRed />;
        case 'active': return isHazard ? <RaceFlagYellow /> : isFinishing ? <RaceFlagCheckered /> : <RaceFlagGreen />; 
        case 'paused': return <RaceFlagRed />;
        case 'completed': return <RaceFlagRed />;
        case 'canceled': return <RaceFlagRed />;
            
        default: return null;
    }
};


function RaceFlagDisplay() {
    const activeRace = useActiveRaceState();

    if (!activeRace) {
      return (<div className="bg-white w-full h-full p-2">Loading...</div>);
    }
  
    return (
        <div className="min-h-screen w-full">
            {raceFlagMap(activeRace)}
        </div>
    );
}

export default function Page() {
    return (
        <SocketProvider url="http://localhost:3001">
            <ActiveRaceStateProvider>
                <RaceFlagDisplay></RaceFlagDisplay>
            </ActiveRaceStateProvider>
        </SocketProvider>
    )
}