"use client";

import { useSocket } from "@/app/providers/socket/socketProvider";
import { ActiveRaceInitialState, ActiveRaceStateChanged } from "@/racetrack/services/active-race/active-race.handler";
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

    console.log(socket);

    const onRaceInitialState = (data: RacetrackEvent<ActiveRaceInitialState>) => {
      const initalState = data.message.race;
      setActiveRaceState(initalState);

      console.log(`[📩 Race Control]: Initial Race State Received:`, initalState);
    }
    socket.on(RaceControlEvents.RaceInitialState, onRaceInitialState)

    // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
    const onRaceStateChanged = (data: RacetrackEvent<ActiveRaceStateChanged>) => {

      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        raceState: data.message.newState,
      } : null);

      console.log(`[📩 Race Control]: Race State Changed to ${data.message.newState}`);
    }
    socket.on(RaceControlEvents.RaceStateChanged, onRaceStateChanged);


    const onRaceHazardChanged = (data: RacetrackEvent<ChangeActiveRaceHazard>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isHazard: data.message.isHazard,
      } : null)

      console.log(`[📩 Race Control]: Race Hazard Flag set to ${data.message.isHazard}.`);
    }
    socket.on(RaceControlEvents.RaceHazardChanged, onRaceHazardChanged);


    const onRaceFinishingChanged = (data: RacetrackEvent<ChangeActiveRaceIsFinishing>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isFinishing: data.message.isFinishing,
      } : null);
    }
    socket.on(RaceControlEvents.RaceIsFinishingChanged, onRaceFinishingChanged)

    // Cleanup function to remove the listeners when the component unmounts.
    return () => {
      socket.off(RaceControlEvents.RaceInitialState, onRaceInitialState);
      socket.off(RaceControlEvents.RaceStateChanged, onRaceStateChanged);
      socket.off(RaceControlEvents.RaceHazardChanged, onRaceHazardChanged);
      socket.off(RaceControlEvents.RaceIsFinishingChanged, onRaceFinishingChanged);
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