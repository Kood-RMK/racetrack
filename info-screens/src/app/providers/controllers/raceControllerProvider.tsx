"use client";

import { useActiveRaceState } from "@/app/providers/activeRaceStateProvider";
import { useSocket } from "@/app/providers/socket/socketProvider";
import { ChangeActiveRaceHazard, RaceControlCommands, ChangeActiveRaceIsFinishing, ChangeActiveRaceState } from "@/racetrack/services/race-control/race-control.service";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { RaceState } from "@/racetrack/types/stateTypes";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export type ActiveRaceController = {
  trySetHazard: (isHazard: boolean) => void;
  trySetFinishing: (isFinishing: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}

const ActiveRaceStateControllerContext = createContext<ActiveRaceController | null>(null);


export const ActiveRaceControllerProvider = ({children} : {children : ReactNode}) => {

  const [activeRaceStateControllers, setActiveRaceStateControllers] = useState<ActiveRaceController>({
    trySetHazard: (isHazard: boolean) => {},
    trySetFinishing: (isFinishing: boolean) => {},
    tryChangeRaceState: (newState: RaceState) => {},
  });

  const socket = useSocket("/race-control");
  const activeRace = useActiveRaceState();

  // useEffect to only mount the socket once and unhook listeners when the component unmounts.
  useEffect(() => {

    if (!socket || !activeRace) {
      return;
    }

    const activeRaceStateControllers : ActiveRaceController = {
      trySetHazard: (isHazard: boolean) => {
        const command: RacetrackCommand<ChangeActiveRaceHazard> = {
          senderId: socket.id,
          message: {
            type: RaceControlCommands.ChangeRaceHazard,
            raceId : activeRace.raceId,
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
            raceId : activeRace.raceId,
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
            raceId : activeRace.raceId,
            newState: newState,
          }
        }

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      }
    }

    setActiveRaceStateControllers(activeRaceStateControllers)
  }, [socket, activeRace]);


  return (
      <ActiveRaceStateControllerContext.Provider value={ activeRaceStateControllers }>
        {children}
      </ActiveRaceStateControllerContext.Provider>
  )
};

export const useActiveRaceController = () : ActiveRaceController | null => {

  const activeRaceController = useContext(ActiveRaceStateControllerContext);

  if (activeRaceController === undefined) {
    throw new Error("useActiveRaceController must be used within an ActiveRaceControllerProvider");
  }

    return activeRaceController
};
