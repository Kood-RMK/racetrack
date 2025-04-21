"use client";

import { RaceState } from "@/racetrack/types/stateTypes";

import RaceCard from '@/components/card/race-control-card';
import { RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, EndSessionButtons } from '@/components/card/race-control-card/Buttons';
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/race-control-card/Tags';
import { useActiveRaceBinding } from "./activeRaceStateBinding";
import { SocketProvider } from "@/components/socket/SocketProvider";


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


function RaceControlPage () {

    const activeRaceBinding = useActiveRaceBinding();

    if (!activeRaceBinding) {
      return <div>Loading...</div>;
    }

    const {activeRace, trySetHazard: setHazard} = activeRaceBinding;

    console.log(activeRace);

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


export default function Page() {
  return (
    <SocketProvider socketURI="http://localhost:3001/race-control">
      <RaceControlPage />
    </SocketProvider>
  )
}