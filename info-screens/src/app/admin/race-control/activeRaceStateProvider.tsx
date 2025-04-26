"use client";

import { useSocket } from "@/components/socket/SocketProvider";
import { ActiveRaceInitialState, ActiveRaceStateChanged, ChangeActiveRaceHazard, ChangeActiveRaceIsFinishing, ChangeActiveRaceState, RaceControlCommands, RaceControlEvents } from "@/racetrack/services/race-control/race-control.service";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export type ActiveRaceStateBinding = {
  activeRace: ActiveRace;
} & ActiveRaceStateControllers;

export type ActiveRaceStateControllers = {
  trySetHazard: (isHazard: boolean) => void;
  trySetFinishing: (isFinishing: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}

const ActiveRaceStateContext = createContext<ActiveRace | undefined>(undefined);
const ActiveRaceStateControllersContext = createContext<ActiveRaceStateControllers | undefined>(undefined);


export const ActiveRaceStateProvider = ({children} : {children : ReactNode}) => {

  const [activeRaceState, setActiveRaceState] = useState<ActiveRace | undefined>(undefined);

  const [activeRaceStateControllers, setActiveRaceStateControllers] = useState<ActiveRaceStateControllers>({
    trySetHazard: (isHazard: boolean) => {},
    trySetFinishing: (isFinishing: boolean) => {},
    tryChangeRaceState: (newState: RaceState) => {},
  });

  const socket = useSocket();

  // useEffect to only mount the socket once and unhook listeners when the component unmounts.
  useEffect(() => {

    if (!socket) {
      // Socket is not yet available.
      return;
    }

    const onRaceInitialState = (data: RacetrackEvent<ActiveRaceInitialState>) => {
      const initalState = data.message.raceInitialState;
      setActiveRaceState(initalState);

      console.log(`[📩 Race Control]: Initial Race State Received:`, initalState);
    }
    socket.on(RaceControlEvents.RaceInitialState, onRaceInitialState)

    // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
    const onRaceStateChanged = (data: RacetrackEvent<ActiveRaceStateChanged>) => {

      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        raceState: data.message.newState,
      } : undefined);

      console.log(`[📩 Race Control]: Race State Changed to ${data.message.newState}`);
    }
    socket.on(RaceControlEvents.RaceStateChanged, onRaceStateChanged);


    const onRaceHazardChanged = (data: RacetrackEvent<ChangeActiveRaceHazard>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isHazard: data.message.isHazard,
      } : undefined)

      console.log(`[📩 Race Control]: Race Hazard Flag set to ${data.message.isHazard}.`);
    }
    socket.on(RaceControlEvents.RaceHazardChanged, onRaceHazardChanged);


    const onRaceFinishingChanged = (data: RacetrackEvent<ChangeActiveRaceIsFinishing>) => {
      setActiveRaceState(prevState => prevState ? {
        ...prevState,
        isFinishing: data.message.isFinishing,
      } : undefined);
    }
    socket.on(RaceControlEvents.RaceIsFinishingChanged, onRaceFinishingChanged)


    const activeRaceStateControllers : ActiveRaceStateControllers = {
      trySetHazard: (isHazard: boolean) => {
        const command: RacetrackCommand<ChangeActiveRaceHazard> = {
          senderId: socket.id,
          message: {
            type: RaceControlCommands.ChangeRaceHazard,
            isHazard: isHazard,
          }
        };

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      },
      trySetFinishing : (isFinishing: boolean) => {
        const command: RacetrackCommand<ChangeActiveRaceIsFinishing> = { 
          senderId: socket.id,
          message : {
            type: RaceControlCommands.ChangeRaceIsFinishing,
            isFinishing: isFinishing,
          }
        }

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      },
      tryChangeRaceState : (newState : RaceState) => {
        const command : RacetrackCommand<ChangeActiveRaceState> = {
          senderId: socket.id,
          message : {
            type: RaceControlCommands.ChangeRaceState,
            newState: newState,
          }
        }

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      }
    }

    setActiveRaceStateControllers(activeRaceStateControllers)


    return () => {
      socket.off(RaceControlEvents.RaceInitialState, onRaceInitialState);
      socket.off(RaceControlEvents.RaceStateChanged, onRaceStateChanged);
      socket.off(RaceControlEvents.RaceHazardChanged, onRaceHazardChanged);
      socket.off(RaceControlEvents.RaceIsFinishingChanged, onRaceFinishingChanged);
    }
  }, [socket])


  return (
    <ActiveRaceStateContext.Provider value={activeRaceState}>
      <ActiveRaceStateControllersContext.Provider value={ activeRaceStateControllers }>
        {children}
      </ActiveRaceStateControllersContext.Provider>
    </ActiveRaceStateContext.Provider>
  )
};


export const useActiveRaceState = () : ActiveRaceStateBinding | null => {

  const state = useContext(ActiveRaceStateContext);
  const stateControllers = useContext(ActiveRaceStateControllersContext);

  if (!state || !stateControllers) {
    throw new Error("useActiveRaceState must be used within an ActiveRaceStateProvider");
  }

  return {
    activeRace : state,
    ...stateControllers
  };
};
