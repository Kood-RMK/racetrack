"use client";

import { useSocket } from "@/app/providers/socket/socketProvider";
import { ActiveContestantFastestLapChanged, ActiveContestantLapCountChanged, ActiveContestantLapStopwatchTick, ActiveContestantPlaceChanged, ActiveRace, ActiveRaceContestantEvents, ActiveRaceEvents, ActiveRaceInitialState, ActiveRaceStateChanged, ActiveRaceTimeLeftChanged, ChangeActiveRaceHazard, ChangeActiveRaceIsFinishing, RaceControlEvents, RaceState, RacetrackEvent } from "racetrack-shared/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export type ActiveRaceStateContextType = {
  activeRaceState: ActiveRace | null;
}

const ActiveRaceStateContext = createContext<ActiveRaceStateContextType>({activeRaceState : null});


export const ActiveRaceStateProvider = ({children} : {children : ReactNode}) => {

  const [activeRaceState, setActiveRaceState] = useState<ActiveRace | null>(null);
  const socketRef = useSocket("/active-race", true);

  // useEffect to only mount the socket once and unhook listeners when the component unmounts.
  useEffect(() => {

    const socket = socketRef.current;
    console.log("socketRef.current", socketRef.current);


    
    if (!socket) {
      // Socket is not yet available.
      console.log("acticeRaceStateProvider, // Socket is not yet available.")
      return;
    }

    // Listens for initial state.
    const onRaceInitialState = (data: RacetrackEvent<ActiveRaceInitialState>) => {
      const initalState = data.message.race;
      setActiveRaceState(initalState);

      console.log(`[📩 Active Race State]: Initial Race State Received:`, initalState);
    }
    socket.on(ActiveRaceEvents.RaceInitialState, onRaceInitialState)

    // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
    const onRaceStateChanged = (data: RacetrackEvent<ActiveRaceStateChanged>) => {

      // If race has been completed or canceled, it is not longer an active race.
      if (data.message.newState === RaceState.Completed || data.message.newState === RaceState.Canceled) {
        setActiveRaceState(null);
      } else {

        setActiveRaceState(prevState => prevState ? {
          ...prevState,
          raceState: data.message.newState,
        } : null);
      }

      console.log(`[📩 Active Race State]: Race State Changed to ${data.message.newState}`);
    }
    socket.on(ActiveRaceEvents.RaceStateChanged, onRaceStateChanged);


    // Listens for isHazard flag changes.
    const onRaceHazardChanged = (data: RacetrackEvent<ChangeActiveRaceHazard>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isHazard: data.message.isHazard,
      } : null)

      console.log(`[📩 Active Race State]: Race Hazard Flag set to ${data.message.isHazard}.`);
    }
    socket.on(ActiveRaceEvents.RaceHazardChanged, onRaceHazardChanged);


    const onTimeLeftChanged = (data: RacetrackEvent<ActiveRaceTimeLeftChanged>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        timeLeft: data.message.timeLeft,
      } : null);

      // console.log(data.message.timeLeft)
    }
    socket.on(ActiveRaceEvents.RaceTimeLeftChanged, onTimeLeftChanged);

    // Listens for isFinishing flag changes.
    const onRaceFinishingChanged = (data: RacetrackEvent<ChangeActiveRaceIsFinishing>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isFinishing: data.message.isFinishing,
      } : null);


      console.log(`[📩 Active Race State]: Race Finishing Flag set to ${data.message.isFinishing}.`);
    }
    socket.on(ActiveRaceEvents.RaceIsFinishingChanged, onRaceFinishingChanged)

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
            lapStopwatchTime: data.message.stopwatchTime,
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
  }, [socketRef])


  return (
    <ActiveRaceStateContext.Provider value={{activeRaceState : activeRaceState}}>
        {children}
    </ActiveRaceStateContext.Provider>
  )
};

export const useActiveRaceState = () : ActiveRaceStateContextType => {
  const context = useContext(ActiveRaceStateContext);

  console.log("context", context);

  if (context === undefined) {
    throw new Error("useActiveRaceState must be used within an ActiveRaceStateProvider");
  }

  return context;
};