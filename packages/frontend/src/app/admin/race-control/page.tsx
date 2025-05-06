"use client";

import { ActiveRace, RaceState, RacetrackClientRole } from "racetrack-shared/types";
import RaceCard from '@/components/card/race-control-card/RaceControlCard';
import { CancelRaceButton, EndRaceButton, FinishRaceButton, HazardRaceButton, RaceButtonParams, StartRaceButton, StopRaceButton } from "@/components/card/race-control-card/Buttons";
import { RefObject, useEffect } from "react";
import { RaceActiveTag, RaceCancelledTag, RaceCountdownTag, RaceDangerTag, RaceFinishingTag, RaceHazardTag, RacePendingTag, RaceTimeslotTag } from "@/components/card/race-control-card/Tags";
import { ActiveRaceController, ActiveRaceControllerProvider, useActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";
import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { LoginWrapper } from "@/components/authentication/Login";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";


// Mapping between race state and components for buttons and tags
const raceTags = ({ activeRace: activeRace }: {activeRace: ActiveRace}) => {

  const raceState = activeRace.raceState;

  activeRace.raceScheduledStartUnixTime
  const calculateTimeslot = (raceStartUnixTime : number, raceDurationSeconds : number) => {
      const startDateTime = new Date(raceStartUnixTime * 1000); // Convert to milliseconds
      const startHours = startDateTime.getHours().toString().padStart(2, '0');
      const startMinutes = startDateTime.getMinutes().toString().padStart(2, '0');
      const startSeconds = startDateTime.getSeconds().toString().padStart(2, '0');

      const endDateTime = new Date(startDateTime.getTime() + (raceDurationSeconds * 1000)); // Convert to milliseconds
      const endHours = endDateTime.getHours().toString().padStart(2, '0');
      const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');
      const endSeconds = endDateTime.getSeconds().toString().padStart(2, '0');
      
      return `${startHours}:${startMinutes}:${startSeconds} - ${endHours}:${endMinutes}:${endSeconds}`;
  }

  const calculateTimeleft = (timeLeft : number) => {
     const hours = Math.floor(timeLeft / 3_600_000);
     const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
     const seconds = Math.floor((timeLeft % 60_000) / 1_000);

    return `${hours}:${minutes}:${seconds}`;
  }

  switch (raceState) {
    case RaceState.Pending: {
      return <>
        <RacePendingTag></RacePendingTag>
        <RaceTimeslotTag timeslot={calculateTimeslot(activeRace.raceScheduledStartUnixTime, activeRace.raceDurationSeconds)}></RaceTimeslotTag>
      </>;
    }

    case RaceState.Active : {
      return <>
        <RaceActiveTag></RaceActiveTag>
        <RaceTimeslotTag timeslot={calculateTimeslot(activeRace.raceScheduledStartUnixTime, activeRace.raceDurationSeconds)}></RaceTimeslotTag>
        <RaceCountdownTag timeLeft={calculateTimeleft(activeRace.timeLeft)}></RaceCountdownTag>
        {activeRace.isHazard && <RaceHazardTag></RaceHazardTag>}
        {activeRace.isFinishing && <RaceFinishingTag></RaceFinishingTag>}
      </>;
    }
    case RaceState.Paused : {
      return <>
        <RaceActiveTag></RaceActiveTag>
        <RaceTimeslotTag timeslot={calculateTimeslot(activeRace.raceScheduledStartUnixTime, activeRace.raceDurationSeconds)}></RaceTimeslotTag>
        <RaceDangerTag></RaceDangerTag>
      </>;
    }
    case RaceState.Canceled : {
      return <>
        <RaceTimeslotTag timeslot={calculateTimeslot(activeRace.raceScheduledStartUnixTime, activeRace.raceDurationSeconds)}></RaceTimeslotTag>
        <RaceCancelledTag></RaceCancelledTag>
      </>;
    }

    default : <></>
  }
};


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


                {!activeRace.isHazard && <FinishRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></FinishRaceButton>}
                {!activeRace.isFinishing && <HazardRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></HazardRaceButton>}
                {activeRace.isFinishing && <EndRaceButton activeRace={activeRace} activeRaceController={activeRaceController}></EndRaceButton>}
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
      <div className='font-cairo flex  items-center flex-col w-full text-5xl px-12'>
        <h1 className='text-center py-12'>Race Control</h1>
          <RaceCard 
            tags={raceTags({activeRace: activeRaceState})}
            buttons={raceButtons({activeRace: activeRaceState, activeRaceController: activeRaceController})}
            />
      </div>
    )
}


export default function Page() {
  return (
    <AuthenticationProvider>
      <LoginWrapper options={{ permittedRoles: [RacetrackClientRole.SAFETY] }}>
        <SocketProvider url="http://localhost:3001">
          <ActiveRaceStateProvider>
            <ActiveRaceControllerProvider>
              <RaceControlPage />
            </ActiveRaceControllerProvider>
          </ActiveRaceStateProvider>
        </SocketProvider>
      </LoginWrapper>
    </AuthenticationProvider>
  )
}