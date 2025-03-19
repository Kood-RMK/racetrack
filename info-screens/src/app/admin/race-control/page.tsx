"use client";

import RaceCard from '@/components/card/race-control-card'
import {  RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, EndSessionButtons } from '@/components/card/race-control-card/Buttons'
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/race-control-card/Tags'

import React, { useState, useEffect } from "react";
import { RaceStateChanged } from "@/racetrack/services/racecontrol.service";
import {RaceState} from "@/racetrack/state";
import { io, type Socket } from "socket.io-client";


// Mapping between race state and components for buttons and tags
const raceTags = {
  'completed': <RacePendingTags />,
  'active': <ActiveRaceTags />,
  'canceled': <RaceCancelledTags />,  
  'finishing': <EndSessionTags />,
  'pending': <RacePendingTags/>,
  'hazard': <ActiveRaceHazardTags/>,
  'danger': <ActiveRaceDangerTags/>,
  'safe': <ActiveRaceTags />,
  'resume': <ActiveRaceTags />   
};

const raceButtons = {
  'completed': <RacePendingButtons />,
  'active': <ActiveRaceButtons />,
  'canceled': null, 
  'finishing': <EndSessionButtons />,
  'pending': <RacePendingButtons/>,
  'hazard': <ActiveRaceHazardButtons/>,
  'danger': <ActiveRaceDangerButtons/>,
  'safe': <ActiveRaceButtons />,
  'resume': <ActiveRaceButtons />     
};


export default function Page() {

  // Initialize state to manage the race state using the RaceState type
  const [raceState, setRaceState] = useState<RaceState>('pending');
  
  useEffect(() => {   // Connect to the socket server
    const socket = io("http://localhost:3001");
  

  socket.on("raceStateChanged", (raceState: RaceStateChanged) => { // Listen for race state changes
    console.log("Race state changed:", raceState.newState);
    setRaceState(raceState.newState);
  });

  return () => { // Clean up on unmount
    socket.disconnect();
  };
}, []);
 
  return (
    <div className='font-cairo min-h-full min-w-full text-5xl px-12'>
      
      <p className='text-center py-12'>Race Control</p>

      <div>
        <div>

        <RaceCard tags={raceTags[raceState]} buttons={raceButtons[raceState]}/>

        </div>
      </div>
    </div>
  )
}