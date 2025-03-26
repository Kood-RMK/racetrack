"use client";

import React, { useState, useEffect } from "react";
import { RaceStateChanged } from "@/racetrack/services/racecontrol.service";
import { RaceState, ActiveRace } from "@/racetrack/state";
import { socket, connectSocket, disconnectSocket } from "@/racetrack/services/sockets/ActiveRaceSocket";

import RaceCard from '@/components/card/race-control-card';
import { RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, EndSessionButtons } from '@/components/card/race-control-card/Buttons';
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/race-control-card/Tags';


// Mapping between race state and components for buttons and tags
const raceTags = (raceState: RaceState, isHazard: boolean, isDanger: boolean, isFinishing: boolean) => {
  console.log('raceTags received:', { raceState, isHazard, isDanger, isFinishing });

  switch (raceState) {
    case 'pending': return <RacePendingTags />;

    case 'active': return isHazard ? <ActiveRaceHazardTags /> : isDanger ? <ActiveRaceDangerTags /> : isFinishing ? <EndSessionTags /> : <ActiveRaceTags />; 

    case 'completed': return <RacePendingTags />;

    case 'canceled': return <RaceCancelledTags />;
    
    default: return null;
  
  }
};

const raceButtons = (raceState: RaceState, isHazard: boolean, isDanger: boolean, isFinishing: boolean) => {
  console.log('raceButtons received:', { raceState, isHazard, isDanger, isFinishing });
  
  switch (raceState) {
    case 'pending': return <RacePendingButtons />;

    case 'active': return isHazard ? <ActiveRaceHazardButtons /> : isDanger ? <ActiveRaceDangerButtons /> : isFinishing ? <EndSessionButtons /> : <ActiveRaceButtons />;

    case 'completed': return <RacePendingButtons />;

    case 'canceled': return null;

    default: return null;
  }
};


export default function Page() {

  // Initialize state to manage the race state using the RaceState type
  const [activeRace, setActiveRace] = useState<ActiveRace>({
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00',
  });
  
  // Connect to the socket server
  useEffect(() => {   
    connectSocket();

  socket.on("raceStateChanged", (raceState: RaceStateChanged) => { // Listen for race state changes
    console.log("Race state changed:", raceState.newState);

    // Extract the correct race state from the array
    const fixedRaceState = Array.isArray(raceState.newState) 
      ? raceState.newState[0]  // Take the first element
      : raceState.newState;

    // Update the activeRace state with the full race data
    setActiveRace({
      ...activeRace,
      raceState: fixedRaceState as RaceState,
      isHazard: raceState.isHazard ?? false,
      isDanger: raceState.isDanger ?? false,
      isFinishing: raceState.isFinishing ?? false,
      timeLeft: "00:00"
    });
  });

  return () => { // Clean up on unmount
    disconnectSocket();
  };
}, []);

  // Extract values from the activeRace object
  const { raceState, isHazard, isDanger, isFinishing } = activeRace;
 
  return (
    <div className='font-cairo min-h-full min-w-full text-5xl px-12'>
      
      <p className='text-center py-12'>Race Control</p>

      <div>
        <div>

        <RaceCard 
          tags={raceTags(raceState, isHazard, isDanger, isFinishing)}
          buttons={raceButtons(raceState, isHazard, isDanger, isFinishing)}/>

        </div>
      </div>
    </div>
  )
}