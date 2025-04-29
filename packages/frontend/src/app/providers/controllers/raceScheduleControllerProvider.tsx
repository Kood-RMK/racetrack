import { useSocket } from "@/app/providers/socket/socketProvider";
import { DeleteRace, ModifyRace, RaceScheduleCommands, ScheduleNewRace } from "racetrack-backend/services";
import { RacetrackCommand, ScheduledRace } from "racetrack-backend/types";
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef } from "react";


export type RaceScheduleController = { 
    tryAddRace: (newRace: ScheduledRace) => void;
    tryModifyRace: (raceId: string, updatedRace: Partial<ScheduledRace>) => void;
    tryDeleteRace: (raceId: string) => void;
}


const RaceScheduleControllerContext = createContext<RefObject<RaceScheduleController> | null>(null);

export const RaceScheduleControllerProvider = ({ children }: { children: ReactNode}) => {
    const scheduleController = useRef<RaceScheduleController>({
        tryAddRace: () => { console.error("RaceScheduleControllerProvider: tryAddRace not implemented.") },
        tryModifyRace: () => { console.error("RaceScheduleControllerProvider: tryModifyRace not implemented.") },
        tryDeleteRace: () => { console.error("RaceScheduleControllerProvider: tryDeleteRace not implemented.") },
    })

    const socketRef = useSocket("/race-schedule");

    useEffect(() => {

        const socket = socketRef.current;

        if (!socket) {
            // Socket is not yet available.
            return;
        }

        scheduleController.current = {
            tryAddRace: (newRace: ScheduledRace) => {
                const command: RacetrackCommand<ScheduleNewRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.ScheduleNewRace,
                        data: {
                            race: newRace,
                        },
                    },
                };

                if (!command.message?.type) {
                    throw new Error("Message has no type!");
                }

                socket.emit(command.message.type, command);
            },
            tryModifyRace: (raceId: string, updatedRace: Partial<ScheduledRace>) => {
                const command: RacetrackCommand<ModifyRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.ModifyRace,
                        data: {
                            race: raceId, ...updatedRace,
                        },
                    },
                };

                if (!command.message?.type) {
                    throw new Error("Message has no type!");
                }

                socket.emit(command.message.type, command);
            },
            tryDeleteRace: (raceId: string) => {
                const command: RacetrackCommand<DeleteRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.DeleteRace,
                        data: {
                            race: raceId,
                        },
                    },
                };

                if (!command.message?.type) {
                    throw new Error("Message has no type!");
                }

                socket.emit(command.message.type, command);
            },
        };

    }, [socketRef])

    return (
        <RaceScheduleControllerContext.Provider value={scheduleController}>
            {children}
        </RaceScheduleControllerContext.Provider>
    )
}

// Hook to access the context easily
export const useRaceScheduleController = (): RefObject<RaceScheduleController> | null => {
    const schedule = useContext(RaceScheduleControllerContext);

    if (schedule === undefined) {
        throw new Error("useRaceScheduleController must be used within a RaceScheduleControllerProvider");
    }

    return schedule;
};