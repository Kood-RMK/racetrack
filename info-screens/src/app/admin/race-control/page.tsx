"use client";

import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";

import RaceCard from '@/components/card/race-control-card/RaceControlCard';
import { SocketProvider } from "@/app/providers/socket/socketProvider";
import { CancelRaceButton, FinishRaceButton, HazardRaceButton, RaceButtonParams, StartRaceButton, StopRaceButton } from "@/components/card/race-control-card/Buttons";
import { RefObject, useEffect } from "react";
import { RacePendingTag, RaceTimeslotTag } from "@/components/card/race-control-card/Tags";
import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/activeRaceStateProvider";
import { ActiveRaceController, ActiveRaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";


// Mapping between race state and components for buttons and tags
// const raceTags = ({ activeRace: activeRace }: {activeRace: ActiveRace}) => {

//   const raceState = activeRace.raceState;

//   switch (raceState) {
//     case 'pending': {
//       return <>
//         <RacePendingTag></RacePendingTag>
        
//       </>;
//     }

//     default : <></>
  
//   }
// };


function raceButtons({ activeRace, activeRaceController }: { activeRace: ActiveRace, activeRaceController : RefObject<ActiveRaceController>}) {

    switch (activeRace.raceState) {
        case 'pending':
            return <>
                <CancelRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></CancelRaceButton>
                <StartRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></StartRaceButton>
            </>;
        case 'active':
            return <>
                <StopRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></StopRaceButton>
                <FinishRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></FinishRaceButton>
                <HazardRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></HazardRaceButton>
            </>;
        case 'completed':
            return <></>;

        case 'paused':
            return <>
                <CancelRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></CancelRaceButton>
                <StartRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></StartRaceButton>
            </>;
        case 'canceled':
            return <></>;
        default:
            return <></>;
    }
}


function RaceControlPage() {


    const activeRaceState = useActiveRaceState();
    const activeRaceController = useActiveRaceController();

    if (!activeRaceState || !activeRaceController) {
      return <div>Loading...</div>;
    }

    

    // Extract values from the activeRace object
    const { raceState, isHazard } = activeRaceState;

    return (
      <div className='font-cairo min-h-full min-w-full text-5xl px-12'>
        
        <p className='text-center py-12'>Race Control</p>

        <div>
          <div>

          <RaceCard 
            // tags={raceTags({activeRace: activeRaceState})}
            buttons={raceButtons({activeRace: activeRaceState, activeRaceController: activeRaceController})}
            />
          </div>
        </div>
      </div>
    )
}


export default function Page() {
  return (
    <SocketProvider url="http://localhost:3001">
      <ActiveRaceStateProvider>
        <ActiveRaceControllerProvider>
          <RaceControlPage />
        </ActiveRaceControllerProvider>
      </ActiveRaceStateProvider>
    </SocketProvider>
  )
}