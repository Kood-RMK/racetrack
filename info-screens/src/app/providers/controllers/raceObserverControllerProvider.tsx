import { RaceContestantId } from "@/racetrack/types/stateTypes"
import { createContext, RefObject, use, useContext, useEffect, useRef } from "react";
import { useSocket } from "../socket/socketProvider";
import { RacetrackCommand } from "@racetrack/types/messageTypes";
import {useActiveRaceState} from "@providers/state/activeRaceStateProvider";
import { HandleLineCrossed, RaceObserverCommands } from "@racetrack/services/race-observer/race-observer.service";

export type RaceObserverController = {
    tryHandleLineCrossed : (contestantId : RaceContestantId) => void; 
}

const RaceObserverControllerContext = createContext<RefObject<RaceObserverController> | null>(null);

export const RaceObserverControllerProvider = ({children} : {children : React.ReactNode}) => {
    const observerController = useRef<RaceObserverController>({
        tryHandleLineCrossed: (contestantId : RaceContestantId) => {
            console.error("ObserverController: trySetLineCrossed not implemented.");
        }
    });


    const socketRef = useSocket("/race-observer");
    const activeRace = useActiveRaceState();

    useEffect(() => {
        const socket = socketRef.current;

        if (!socket || !activeRace) {
            return;
        }

        observerController.current = {
            tryHandleLineCrossed: (contestantId : RaceContestantId) => {
                const command: RacetrackCommand<HandleLineCrossed> = {
                    senderId: socket.id,
                    message: {
                        type: RaceObserverCommands.HandleLineCrossed,
                        raceId : activeRace.raceId,
                        contestantId : contestantId,
                    }
                };

                if (command.message?.type) { 
                    socket.emit(command.message.type, command);
                }
            }
        };

    }, [socketRef, activeRace]);


  return (
      <RaceObserverControllerContext.Provider value={ observerController }>
        {children}
      </RaceObserverControllerContext.Provider>
  )
}

export const useRaceObserverController = () : RefObject<RaceObserverController> | null => {

  const raceObserverController = useContext(RaceObserverControllerContext);

  if (raceObserverController === undefined) {
    throw new Error("useRaceObserverController must be used within an RaceObserverControllerProvider");
  }

    return raceObserverController
};