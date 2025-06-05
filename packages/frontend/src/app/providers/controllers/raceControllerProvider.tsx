"use client";

import { useSocket } from "@/app/providers/socket/socketProvider";
import { ActiveRace, RacetrackCommand, RaceState, ChangeActiveRaceHazard, ChangeActiveRaceIsFinishing, ChangeActiveRaceState, RaceControlCommands, ScheduledRaceId, StartRace, ScheduledRace, ActiveRaceId } from "racetrack-shared/types";
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef } from "react";
import { useActiveRaceState } from "@providers/state/activeRaceStateProvider";


export type RaceController = {
  trySetHazard: (raceId : ActiveRaceId, isHazard: boolean) => void;
  trySetFinishing: (raceId : ActiveRaceId, isFinishing: boolean) => void;
  tryChangeRaceState: (raceId : ActiveRaceId, newState: RaceState) => void;
  tryStartRace: (scheduledRace : ScheduledRace) => void;
}

const RaceStateControllerContext = createContext<RefObject<RaceController> | null>(null);


export const RaceControllerProvider = ({children} : {children : ReactNode}) => {

  const raceStateController = useRef<RaceController>({
    trySetHazard: (raceId : ActiveRaceId, isHazard: boolean) => {console.error("ActiveRaceStateController: trySetHazard not implemented.")},
    trySetFinishing: (raceId : ActiveRaceId, isFinishing: boolean) => {console.error("ActiveRaceStateController: trySetFinishing not implemented.")},
    tryChangeRaceState: (raceId : ActiveRaceId, newState: RaceState) => {console.error("ActiveRaceStateController: tryChangeRaceState not implemented.")},
    tryStartRace: (scheduledRace : ScheduledRace) => {console.error("ActiveRaceStateController: tryStartRace not implemented.")}
  });

  const socketRef = useSocket("/race-control");

  // useEffect to only mount the socket once and unhook listeners when the component unmounts.
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    raceStateController.current = {
      trySetHazard: (raceId : ActiveRaceId, isHazard: boolean) => {
        const command: RacetrackCommand<ChangeActiveRaceHazard> = {
          senderId: socket.id,
          message: {
            type: RaceControlCommands.ChangeRaceHazard,
            raceId : raceId,
            isHazard: isHazard,
          }
        };

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      },
      trySetFinishing : (raceId : ActiveRaceId, isFinishing: boolean) => {
        const command: RacetrackCommand<ChangeActiveRaceIsFinishing> = { 
          senderId: socket.id,
          message : {
            type: RaceControlCommands.ChangeRaceIsFinishing,
            raceId : raceId,
            isFinishing: isFinishing,
          }
        }

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      },
      tryStartRace: (scheduledRace : ScheduledRace) => {
        const command: RacetrackCommand<StartRace> = {
          senderId: socket.id,
          message: {
            type: RaceControlCommands.StartRace,
            scheduledRace : scheduledRace
          }
        }

        console.log("raceControlProvider button press sends out:", command.message);

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      },
      tryChangeRaceState : (raceId : ActiveRaceId, newState : RaceState) => {
        const command : RacetrackCommand<ChangeActiveRaceState> = {
          senderId: socket.id,
          message : {
            type: RaceControlCommands.ChangeRaceState,
            raceId : raceId,
            newState: newState,
          }
        }

        if (command.message?.type) { 
          socket.emit(command.message.type, command);
        }
      }
    }

  }, [socketRef]);


  return (
      <RaceStateControllerContext.Provider value={ raceStateController }>
        {children}
      </RaceStateControllerContext.Provider>
  )
};

export const useActiveRaceController = () : RefObject<RaceController> | null => {

  const activeRaceController = useContext(RaceStateControllerContext);

  if (activeRaceController === undefined) {
    throw new Error("useActiveRaceController must be used within an ActiveRaceControllerProvider");
  }

    return activeRaceController
};
