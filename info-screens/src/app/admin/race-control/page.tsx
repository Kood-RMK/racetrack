"use client";

import RaceCard from '@/components/card/race-control-card'
import {  RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, EndSessionButtons } from '@/components/card/race-control-card/Buttons'
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/race-control-card/Tags'

import React, { useState } from "react";
import {RaceState} from "@/racetrack/state"

// Mapping between race state and components for buttons and tags
const raceButtons = {
  'completed': <RacePendingButtons />,
  'active': <ActiveRaceButtons />,
  'canceled': null, 
  'finishing': <EndSessionButtons />,   
};

const raceTags = {
  'completed': <RacePendingButtons />,
  'active': <ActiveRaceTags />,
  'canceled': <RaceCancelledTags />,  
  'finishing': <EndSessionTags />, 
};


export default async function Page() {

  // Initialize state to manage the race state using the RaceState type
  const [raceState, setRaceState] = useState<RaceState>('finishing');  
 
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