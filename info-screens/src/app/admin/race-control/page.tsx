"use client";

import { RaceState } from "@/racetrack/types/stateTypes";

import RaceCard from '@/components/card/race-control-card/RaceControlCard';
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/race-control-card/Tags';
import { ActiveRaceStateBinding, useActiveRaceStateBinding } from "./activeRaceStateBinding";
import { SocketProvider } from "@/components/socket/SocketProvider";
import { CancelRaceButton, HazardRaceButton, StartRaceButton, StopRaceButton } from "@/components/card/race-control-card/Buttons";


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


function raceButtons({activeRaceStateBinding }: {activeRaceStateBinding: ActiveRaceStateBinding}) {
    switch (activeRaceStateBinding.activeRace.raceState) {
        case 'pending':
            return <>
                <CancelRaceButton activeRaceStateBinding={activeRaceStateBinding}></CancelRaceButton>
                <StartRaceButton activeRaceStateBinding={activeRaceStateBinding}></StartRaceButton>
            </>;
        case 'active':
            return <>
                <StopRaceButton activeRaceStateBinding={activeRaceStateBinding}></StopRaceButton>
                <HazardRaceButton activeRaceStateBinding={activeRaceStateBinding}></HazardRaceButton>
            </>;
        case 'completed':
            return <></>;
        case 'canceled':
            return <></>;
        default:
            return <></>;
    }
}


function RaceControlPage () {

    const activeRaceBinding = useActiveRaceStateBinding();

    if (!activeRaceBinding) {
      return <div>Loading...</div>;
    }
    const {activeRace} = activeRaceBinding;

    // Extract values from the activeRace object
    const { raceState, isHazard } = activeRace;
  
    return (
      <div className='font-cairo min-h-full min-w-full text-5xl px-12'>
        
        <p className='text-center py-12'>Race Control</p>

        <div>
          <div>

          <RaceCard 
            // tags={raceTags(und)}
            buttons={raceButtons({activeRaceStateBinding : activeRaceBinding})}/>
          </div>
        </div>
      </div>
    )
}


export default function Page() {
  return (
    <SocketProvider socketURI="http://localhost:3001/race-control">
      <RaceControlPage />
    </SocketProvider>
  )
}