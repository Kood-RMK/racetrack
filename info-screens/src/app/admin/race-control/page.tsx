"use client";

import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";

import RaceCard from '@/components/card/race-control-card/RaceControlCard';
import { SocketProvider } from "@/app/providers/socket/socketProvider";
import { CancelRaceButton, FinishRaceButton, HazardRaceButton, StartRaceButton, StopRaceButton } from "@/components/card/race-control-card/Buttons";
import { useEffect } from "react";
import { RacePendingTag, RaceTimeslotTag } from "@/components/card/race-control-card/Tags";
import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/activeRaceStateProvider";


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


// function raceButtons({ activeRace }: {activeRace: ActiveRace, activeRaceController : ActiveRaceController }) {
//     switch (activeRace.raceState) {
//         case 'pending':
//             return <>
//                 <CancelRaceButton activeRaceStateBinding={activeRaceStateBinding}></CancelRaceButton>
//                 <StartRaceButton activeRaceStateBinding={activeRaceStateBinding}></StartRaceButton>
//             </>;
//         case 'active':
//             return <>
//                 <StopRaceButton activeRaceStateBinding={activeRaceStateBinding}></StopRaceButton>
//                 <FinishRaceButton activeRaceStateBinding={activeRaceStateBinding}></FinishRaceButton>
//                 <HazardRaceButton activeRaceStateBinding={activeRaceStateBinding}></HazardRaceButton>
//             </>;
//         case 'completed':
//             return <></>;

//         case 'paused':
//             return <>
//                 <CancelRaceButton activeRaceStateBinding={activeRaceStateBinding}></CancelRaceButton>
//                 <StartRaceButton activeRaceStateBinding={activeRaceStateBinding}></StartRaceButton>
//             </>;
//         case 'canceled':
//             return <></>;
//         default:
//             return <></>;
//     }
// }


function RaceControlPage() {


    const activeRaceState = useActiveRaceState();

    if (!activeRaceState) {
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
            // buttons={raceButtons({activeRaceStateBinding: activeRaceState})}
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
        <RaceControlPage />
      </ActiveRaceStateProvider>
    </SocketProvider>
  )
}