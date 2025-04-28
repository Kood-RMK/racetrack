"use client";

import { useSocket } from "@/app/providers/socket/socketProvider";
import { ActiveRaceInitialState, ActiveRaceStateChanged } from "@/racetrack/services/active-race/active-race.handler";
import { ActiveContestantFastestLapChanged, ActiveContestantLapCountChanged, ActiveContestantLapStopwatchTick, ActiveContestantPlaceChanged, ActiveRaceContestantEvents } from "@/racetrack/services/active-race/contestant/active-race-contestant.handler";
import { RaceControlEvents, ChangeActiveRaceHazard, ChangeActiveRaceIsFinishing } from "@/racetrack/services/race-control/race-control.service";
import { RacetrackEvent } from "@/racetrack/types/messageTypes";
import { ActiveRace } from "@/racetrack/types/stateTypes";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


const ActiveRaceStateContext = createContext<ActiveRace | null>(null);


export const ActiveRaceStateProvider = ({children} : {children : ReactNode}) => {

  const [activeRaceState, setActiveRaceState] = useState<ActiveRace | null>(null);
  const socket = useSocket("/active-race");

  // useEffect to only mount the socket once and unhook listeners when the component unmounts.
  useEffect(() => {

    if (!socket) {
      // Socket is not yet available.
      return;
    }

    // Listens for initial state.
    const onRaceInitialState = (data: RacetrackEvent<ActiveRaceInitialState>) => {
      const initalState = data.message.race;
      setActiveRaceState(initalState);

      console.log(`[📩 Active Race State]: Initial Race State Received:`, initalState);
    }
    socket.on(RaceControlEvents.RaceInitialState, onRaceInitialState)

    // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
    const onRaceStateChanged = (data: RacetrackEvent<ActiveRaceStateChanged>) => {

      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        raceState: data.message.newState,
      } : null);

      console.log(`[📩 Active Race State]: Race State Changed to ${data.message.newState}`);
    }
    socket.on(RaceControlEvents.RaceStateChanged, onRaceStateChanged);


    // Listens for isHazard flag changes.
    const onRaceHazardChanged = (data: RacetrackEvent<ChangeActiveRaceHazard>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isHazard: data.message.isHazard,
      } : null)

      console.log(`[📩 Active Race State]: Race Hazard Flag set to ${data.message.isHazard}.`);
    }
    socket.on(RaceControlEvents.RaceHazardChanged, onRaceHazardChanged);


    // Listens for isFinishing flag changes.
    const onRaceFinishingChanged = (data: RacetrackEvent<ChangeActiveRaceIsFinishing>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isFinishing: data.message.isFinishing,
      } : null);


      console.log(`[📩 Active Race State]: Race Finishing Flag set to ${data.message.isFinishing}.`);
    }
    socket.on(RaceControlEvents.RaceIsFinishingChanged, onRaceFinishingChanged)

    // Listens for contestant place changes.
    const onContestantPlaceChanged = (data: RacetrackEvent<ActiveContestantPlaceChanged>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        contestants: {
          ...prevState.contestants,
          [data.message.contestantId]: {
            ...prevState.contestants[data.message.contestantId],
            place: data.message.place,
          }
        }
      } : null);

      console.log(`[📩 Active Race State]: Race Contestant ${data.message.contestantId} placement changed to ${data.message.place}.`);
    }
    socket.on(ActiveRaceContestantEvents.ContestantPlaceChanged, onContestantPlaceChanged);

    // Listens for contestant lap count changes.
    const onContestantLapCountChanged = (data: RacetrackEvent<ActiveContestantLapCountChanged>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        contestants: {
          ...prevState.contestants,
          [data.message.contestantId]: {
            ...prevState.contestants[data.message.contestantId],
            lapCount: data.message.lapCount,
          }
        }
      } : null);

      console.log(`[📩 Active Race State]: Race Contestant ${data.message.contestantId} lap count changed to ${data.message.lapCount}.`);
    }
    socket.on(ActiveRaceContestantEvents.ContestantLapCountChanged, onContestantLapCountChanged);


    // Listens for contestant fastest lap changes.
    const onContestantFastestLapChanged = (data: RacetrackEvent<ActiveContestantFastestLapChanged>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        contestants: {
          ...prevState.contestants,
          [data.message.contestantId]: {
            ...prevState.contestants[data.message.contestantId],
            fastestLap: data.message.fastestLap,
          }
        }
      } : null);

      console.log(`[📩 Active Race State]: Race Contestant ${data.message.contestantId} fastest lap changed to ${data.message.fastestLap}.`);
    }
    socket.on(ActiveRaceContestantEvents.ContestantFastestLapChanged, onContestantFastestLapChanged);


    // Listens for contestant lap stopwatch tick changes.

    const onContestantLapStopwatchTick = (data: RacetrackEvent<ActiveContestantLapStopwatchTick>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        contestants: {
          ...prevState.contestants,
          [data.message.contestantId]: {
            ...prevState.contestants[data.message.contestantId],
            currentLapStopwatchTime: data.message.stopwatchTime,
          }
        }
      } : null);
    }

    socket.on(ActiveRaceContestantEvents.ContestantLapStopwatchTick, onContestantLapStopwatchTick);


    // Cleanup function to remove the listeners when the component unmounts.
    return () => {
      socket.off(RaceControlEvents.RaceInitialState, onRaceInitialState);
      socket.off(RaceControlEvents.RaceStateChanged, onRaceStateChanged);
      socket.off(RaceControlEvents.RaceHazardChanged, onRaceHazardChanged);
      socket.off(RaceControlEvents.RaceIsFinishingChanged, onRaceFinishingChanged);

      socket.off(ActiveRaceContestantEvents.ContestantPlaceChanged, onContestantPlaceChanged);
      socket.off(ActiveRaceContestantEvents.ContestantLapCountChanged, onContestantLapCountChanged);
      socket.off(ActiveRaceContestantEvents.ContestantFastestLapChanged, onContestantFastestLapChanged);
      socket.off(ActiveRaceContestantEvents.ContestantLapStopwatchTick, onContestantLapStopwatchTick);
    }
  }, [socket])


  return (
    <ActiveRaceStateContext.Provider value={activeRaceState}>
        {children}
    </ActiveRaceStateContext.Provider>
  )
};

export const useActiveRaceState = () : ActiveRace | null => {

  const state = useContext(ActiveRaceStateContext);

  if (state === undefined) {
    throw new Error("useActiveRaceState must be used within an ActiveRaceStateProvider");
  }

  return state;
};