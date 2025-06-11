"use client";

import { ActiveRace, RaceContestant, RaceState, RacetrackClientRole, ScheduledRace } from "racetrack-shared/types";
import RaceCard from '@/components/card/race-control-card/RaceControlCard';
import { CancelRaceButton, EndRaceButton, FinishRaceButton, HazardRaceButton, RaceButtonParams, ResumeRaceButton, StartRaceButton, StopRaceButton } from "@/components/card/race-control-card/Buttons";
import { ReactNode, RefObject, useEffect, useState } from "react";
import { RaceActiveTag, RaceCancelledTag, RaceCountdownTag, RaceDangerTag, RaceFinishingTag, RaceHazardTag, RacePendingTag, RaceTimeslotTag } from "@/components/card/race-control-card/Tags";
import { RaceController, RaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { LoginWrapper } from "@/components/authentication/Login";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { RaceScheduleStateProvider, useRaceScheduleState } from "@/app/providers/state/raceScheduleStateProvider";


// Mapping between race state and components for buttons and tags
const raceTags = ({ race: race }: {race: ActiveRace | ScheduledRace}) => {

  const raceState = race.raceState;

  race.raceScheduledStartTimeSlot
  // const calculateTimeslot = (raceStartUnixTime : number, raceDurationSeconds : number) => {
  //     const startDateTime = new Date(raceStartUnixTime * 1000); // Convert to milliseconds
  //     const startHours = startDateTime.getHours().toString().padStart(2, '0');
  //     const startMinutes = startDateTime.getMinutes().toString().padStart(2, '0');
  //     const startSeconds = startDateTime.getSeconds().toString().padStart(2, '0');

  //     const endDateTime = new Date(startDateTime.getTime() + (raceDurationSeconds * 1000)); // Convert to milliseconds
  //     const endHours = endDateTime.getHours().toString().padStart(2, '0');
  //     const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');
  //     const endSeconds = endDateTime.getSeconds().toString().padStart(2, '0');
      
  //     return `${startHours}:${startMinutes}:${startSeconds} - ${endHours}:${endMinutes}:${endSeconds}`;
  // }

  const calculateTimeleft = (timeLeft : number) => {
     const hours = Math.floor(timeLeft / 3_600_000);
     const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
     const seconds = Math.floor((timeLeft % 60_000) / 1_000);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  switch (raceState) {
    case RaceState.Pending: {
      return <>
        <RacePendingTag></RacePendingTag>
        <RaceTimeslotTag timeslot={race.raceScheduledStartTimeSlot}></RaceTimeslotTag>
      </>;
    }

    case RaceState.Active : {
      const activeRace = race as ActiveRace;
      return <>
        <RaceActiveTag></RaceActiveTag>
        <RaceTimeslotTag timeslot={race.raceScheduledStartTimeSlot}></RaceTimeslotTag>
        <RaceCountdownTag timeLeft={calculateTimeleft(activeRace.timeLeft)}></RaceCountdownTag>
        {activeRace.isHazard && <RaceHazardTag></RaceHazardTag>}
        {activeRace.isFinishing && <RaceFinishingTag></RaceFinishingTag>}
      </>;
    }
    case RaceState.Paused : {
      return <>
        <RaceActiveTag></RaceActiveTag>
        <RaceTimeslotTag timeslot={race.raceScheduledStartTimeSlot}></RaceTimeslotTag>
        <RaceDangerTag></RaceDangerTag>
      </>;
    }
    case RaceState.Canceled : {
      return <>
        <RaceTimeslotTag timeslot={race.raceScheduledStartTimeSlot}></RaceTimeslotTag>
        <RaceCancelledTag></RaceCancelledTag>
      </>;
    }

    default : <></>
  }
};


function raceButtons({ race, raceController }: { race: ActiveRace | ScheduledRace, raceController : RefObject<RaceController>}) {

    switch (race.raceState) {
        case 'pending':
            return <>
                <StartRaceButton race={(race as ScheduledRace)} raceController={raceController}></StartRaceButton>
            </>;
        case 'active':
            return <>
                <StopRaceButton race={(race as ActiveRace)} raceController={raceController}></StopRaceButton>

                {!(race as ActiveRace).isHazard && <FinishRaceButton race={(race as ActiveRace)} raceController={raceController}></FinishRaceButton>}
                {!(race as ActiveRace).isFinishing && <HazardRaceButton race={(race as ActiveRace)} raceController={raceController}></HazardRaceButton>}
                {(race as ActiveRace).isFinishing && <EndRaceButton race={(race as ActiveRace)} raceController={raceController}></EndRaceButton>}
            </>;
        case 'completed':
            return <></>;

        case 'paused':
            return <>
                {/* <CancelRaceButton race={race as ActiveRace} raceController={raceController}></CancelRaceButton> */}
                <ResumeRaceButton race={race as ActiveRace} raceController={raceController}></ResumeRaceButton>
            </>;
        case 'canceled':
            return <></>;
        default:
            return <></>;
    }
}


function RaceControlPage() {
    const raceScheduleState = useRaceScheduleState();

  
    const activeRaceState = useActiveRaceState();
    const raceController = useActiveRaceController();
    console.log("activeRaceState: ", activeRaceState)
    if (!raceController || !raceScheduleState) {

      return <div>Loading...</div>;
    }
    const [race, setRace] = useState<ScheduledRace | ActiveRace | null>()
    const [contestants, setContestants] = useState<RaceContestant[]>([]);


    useEffect(() => {

      if (activeRaceState.activeRaceState) {
        setContestants(Object.values(activeRaceState.activeRaceState.contestants).map(activeContestant => activeContestant.contestant));
        setRace(activeRaceState.activeRaceState);

      } else if (raceScheduleState.nextRace) {
        setContestants(raceScheduleState.nextRace.contestants);
        setRace(raceScheduleState.nextRace)
      } else {
        setRace(null);
        setContestants([]);
      }

    }, [activeRaceState.activeRaceState, raceScheduleState]);

      return (
        race ? <div className='font-cairo flex  items-center flex-col w-full text-5xl px-12'>
          <h1 className='text-center py-12'>Race Control</h1>
          {/* <h2 className='text-center py-10'>{race.raceScheduledStartTimeSlot}</h2> */}
            <RaceCard 
              tags={raceTags({race : race})}
              contestants={contestants}
              buttons={raceButtons({race : race, raceController})}
              
              />
        </div> : <div>No upcoming races</div>
      )
}


export default function Page() {
  return (
    <AuthenticationProvider>
      <LoginWrapper options={{ permittedRoles: [RacetrackClientRole.SAFETY] }}>
        <SocketProvider url="http://localhost:3001">
          <RaceScheduleStateProvider>
            <ActiveRaceStateProvider>
              <RaceControllerProvider>
                <RaceControlPage />
              </RaceControllerProvider>
            </ActiveRaceStateProvider>
          </RaceScheduleStateProvider>
        </SocketProvider>
      </LoginWrapper>
    </AuthenticationProvider>
  )
}