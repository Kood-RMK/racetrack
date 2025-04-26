"use client";

import { RaceState } from "@/racetrack/types/stateTypes";

import RaceCard from '@/components/card/race-control-card/RaceControlCard';
import { ActiveRaceStateBinding, ActiveRaceStateProvider, useActiveRaceState } from "./activeRaceStateProvider";
import { SocketProvider } from "@/components/socket/SocketProvider";
import { CancelRaceButton, FinishRaceButton, HazardRaceButton, StartRaceButton, StopRaceButton } from "@/components/card/race-control-card/Buttons";
import { useEffect } from "react";
import { RacePendingTag, RaceTimeslotTag } from "@/components/card/race-control-card/Tags";


// Mapping between race state and components for buttons and tags
const raceTags = ({ activeRaceStateBinding }: {activeRaceStateBinding: ActiveRaceStateBinding}) => {

  const raceState = activeRaceStateBinding.activeRace.raceState;

  switch (raceState) {
    case 'pending': {
      return <>
        <RacePendingTag></RacePendingTag>
        
      </>;
    }

    default : <></>
  
  }
};


function raceButtons({ activeRaceStateBinding }: {activeRaceStateBinding: ActiveRaceStateBinding}) {
    switch (activeRaceStateBinding.activeRace.raceState) {
        case 'pending':
            return <>
                <CancelRaceButton activeRaceStateBinding={activeRaceStateBinding}></CancelRaceButton>
                <StartRaceButton activeRaceStateBinding={activeRaceStateBinding}></StartRaceButton>
            </>;
        case 'active':
            return <>
                <StopRaceButton activeRaceStateBinding={activeRaceStateBinding}></StopRaceButton>
                <FinishRaceButton activeRaceStateBinding={activeRaceStateBinding}></FinishRaceButton>
                <HazardRaceButton activeRaceStateBinding={activeRaceStateBinding}></HazardRaceButton>
            </>;
        case 'completed':
            return <></>;

        case 'paused':
            return <>
                <CancelRaceButton activeRaceStateBinding={activeRaceStateBinding}></CancelRaceButton>
                <StartRaceButton activeRaceStateBinding={activeRaceStateBinding}></StartRaceButton>
            </>;
        case 'canceled':
            return <></>;
        default:
            return <></>;
    }
}


function RaceControlPage() {


    const activeRaceStateBinding = useActiveRaceState();

    if (!activeRaceStateBinding) {
      return <div>Loading...</div>;
    }

    // Extract values from the activeRace object
    const { raceState, isHazard } = activeRaceStateBinding.activeRace;

    return (
      <div className='font-cairo min-h-full min-w-full text-5xl px-12'>
        
        <p className='text-center py-12'>Race Control</p>

        <div>
          <div>

          <RaceCard 
            tags={raceTags({activeRaceStateBinding})}
            buttons={raceButtons({activeRaceStateBinding})}/>
          </div>
        </div>
      </div>
    )
}


export default function Page() {
  return (
    <SocketProvider socketURI="http://localhost:3001/race-control">
      <ActiveRaceStateProvider>
        <RaceControlPage />
      </ActiveRaceStateProvider>
    </SocketProvider>
  )
}