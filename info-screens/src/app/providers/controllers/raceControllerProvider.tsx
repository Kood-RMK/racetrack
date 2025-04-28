"use client";

import { useSocket } from "@/app/providers/socket/socketProvider";
import { ChangeActiveRaceHazard, RaceControlCommands, ChangeActiveRaceIsFinishing, ChangeActiveRaceState } from "@/racetrack/services/race-control/race-control.service";
import { RacetrackCommand } from "@/racetrack/types/messageTypes";
import { RaceState } from "@/racetrack/types/stateTypes";
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef } from "react";
import { useActiveRaceState } from "@providers/state/activeRaceStateProvider";


export type ActiveRaceController = {
  trySetHazard: (isHazard: boolean) => void;
  trySetFinishing: (isFinishing: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}

const ActiveRaceStateControllerContext = createContext<RefObject<ActiveRaceController> | null>(null);


export const ActiveRaceControllerProvider = ({children} : {children : ReactNode}) => {

  const activeRaceStateController = useRef<ActiveRaceController>({
    trySetHazard: (isHazard: boolean) => {console.error("ActiveRaceStateController: trySetHazard not implemented.")},
    trySetFinishing: (isFinishing: boolean) => {console.error("ActiveRaceStateController: trySetFinishing not implemented.")},
    tryChangeRaceState: (newState: RaceState) => {console.error("ActiveRaceStateController: tryChangeRaceState not implemented.")},
  });

  const socketRef = useSocket("/race-control");
  const activeRace = useActiveRaceState();

  // useEffect to only mount the socket once and unhook listeners when the component unmounts.
  useEffect(() => {

    const socket = socketRef.current;

    if (!socket || !activeRace) {
      return;
    }

    activeRaceStateController.current = {
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

  }, [socketRef, activeRace]);


  return (
      <ActiveRaceStateControllerContext.Provider value={ activeRaceStateController }>
        {children}
      </ActiveRaceStateControllerContext.Provider>
  )
};

export const useActiveRaceController = () : RefObject<ActiveRaceController> | null => {

  const activeRaceController = useContext(ActiveRaceStateControllerContext);

  if (activeRaceController === undefined) {
    throw new Error("useActiveRaceController must be used within an ActiveRaceControllerProvider");
  }

    return activeRaceController
};
