import { useSocket } from "@/app/providers/socket/socketProvider";
import { ChangeRaceState, DeleteRace, ModifyRace, RaceScheduleCommands, RacetrackCommand, ScheduledRace, ScheduleNewRace } from "racetrack-shared/types";
import { createContext, ReactNode, RefObject, useContext, useEffect, useRef } from "react";


export type RaceScheduleController = {
    tryAddRace: (newRace: ScheduledRace) => void;
    tryModifyRace: (raceId: string, updatedRace: ScheduledRace) => void;
    tryDeleteRace: (raceId: string) => void;
//     tryChangeRaceState: (raceId: string, newState: string) => void;
}

const RaceScheduleControllerContext = createContext<RefObject<RaceScheduleController> | null>(null);

export const RaceScheduleControllerProvider = ({ children }: { children: ReactNode }) => {
    const scheduleController = useRef<RaceScheduleController>({
        tryAddRace: () => { console.error("RaceScheduleControllerProvider: tryAddRace not implemented.") },
        tryModifyRace: () => { console.error("RaceScheduleControllerProvider: tryModifyRace not implemented.") },
        tryDeleteRace: () => { console.error("RaceScheduleControllerProvider: tryDeleteRace not implemented.") },
        // tryChangeRaceState: () => { console.error("RaceScheduleControllerProvider: tryDeleteRace not implemented.") },
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

                if (command.message?.type) {
                    socket.emit(command.message.type, command);
                    console.log("☀️ Emitting race schedule command:", command);
                }

            },
            tryModifyRace: (raceId: string, updatedRace: ScheduledRace) => {
                const command: RacetrackCommand<ModifyRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.ModifyRace,
                        data: {
                            raceId: raceId,
                            updates: updatedRace,
                        },
                    },
                };

                if (command.message?.type) {
                    socket.emit(command.message.type, command);
                }


            },
            tryDeleteRace: (raceId: string) => {
                const command: RacetrackCommand<DeleteRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.DeleteRace,
                        data: {
                            raceId: raceId
                        },
                    },
                };

                if (command.message?.type) {
                    socket.emit(command.message.type, command);
                }
            },
                // tryChangeRaceState: (raceId: string, newState: string) => {
                //     const command: RacetrackCommand<ChangeRaceState> = {
                //         senderId: socket.id,
                //         message: {
                //             type: RaceScheduleCommands.ChangeRaceState,
                //             data: {
                //                 raceId: raceId,
                //                 state: newState,
                //             },
                //         },
                //     };

                //     if (command.message?.type) {
                //         socket.emit(command.message.type, command);
                //     }
                // }
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
    const scheduleContoller = useContext(RaceScheduleControllerContext);

    if (scheduleContoller === undefined) {
        throw new Error("useRaceScheduleController must be used within a RaceScheduleControllerProvider");
    }

    return scheduleContoller;
};