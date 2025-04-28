import { RaceContestantId } from "@/racetrack/types/stateTypes"
import { createContext, use, useEffect, useRef } from "react";
import { useSocket } from "../socket/socketProvider";
import { RaceControlCommands } from "@racetrack/services/race-control/race-control.service";
import { RacetrackCommand } from "@racetrack/types/messageTypes";
import {useActiveRaceState} from "@providers/state/activeRaceStateProvider";

export type ObserverController = {
    trySetLineCrossed : (contestantId : RaceContestantId) => void; 
}


const ObserverControllerContext = createContext<ObserverController | null>(null);


export const ObserverControllerProvider = ({children} : {children : React.ReactNode}) => {
    const observerController = useRef<ObserverController>({
        trySetLineCrossed: (contestantId : RaceContestantId) => {
            console.error("ObserverController: trySetLineCrossed not implemented.");
        }
    });


    const socket = useSocket("/observer");
    const activeRace = useActiveRaceState();

    useEffect(() => {

        if (!socket || !activeRace) {
            return;
        }

        observerController.current = {
            trySetLineCrossed: (contestantId : RaceContestantId) => {
                const command: RacetrackCommand<> = {
                    senderId: socket.id,
                    message: {
                        type: RaceControlCommands.ChangeRaceLineCrossed,
                        raceId : activeRace.raceId,
                        contestantId : contestantId,
                    }
                };

                if (command.message?.type) { 
                    socket.emit(command.message.type, command);
                }
            }
        };

    }, [socket, activeRace]);
}