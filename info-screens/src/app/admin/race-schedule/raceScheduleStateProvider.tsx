"use client";

import { useSocket } from "@/components/socket/SocketProvider";
import { DeleteRace, ModifyRace, RaceScheduleCommands, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, ScheduleNewRace } from "@/racetrack/services/race-schedule/race-schedule.service";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { Race, RaceSchedule } from "@/racetrack/types/stateTypes";
import { ReactNode, useEffect, useState } from "react";
import { createContext } from "vm";

// First we define the 'shape' of the context that the provider will provide to components
// What data can components get from the provider?
// What actions can components call from the provider?

export type RaceScheduleBinding = { // this combines the current state of Race and the actions
    schedule: RaceSchedule; // or schedule?
    race: Race;
} & RaceScheduleControllers;

export type RaceScheduleControllers = { // The actions the provider will offer
    tryAddRace: (newRace: Race) => void;
    tryModifyRace: (raceId: string, updatedRace: Partial<Race>) => void;
    tryDeleteRace: (raceId: string) => void;
}

// ???
const RaceScheduleContext = createContext<RaceSchedule | undefined>(undefined);
const RaceScheduleStateControllersContext = createContext<RaceScheduleControllers | undefined>(undefined);



export const RaceScheduleStateProvider = ({children} : {children : ReactNode}) => {

    //  You are creating a piece of state called scheduleState that starts as an empty array [], 
    // and it must match the type RaceSchedule.
    const [scheduleState, setScheduleState] = useState<RaceSchedule>({});
    
    const socket = useSocket();

    // useEffect to only mount the socket once and unhooklisteners when the component unmounts.
    useEffect(() => {

        if (!socket) {
            // Socket is not yet available.
            return;
        }

        // receive the initial schedule state for new client
        const onScheduleInitialState = (data: RacetrackEvent<RaceScheduleInitialState>) => {
            const initalSchedule = data.message.schedule;
            setScheduleState(initalSchedule);
    
            console.log(`[📩 Race Schedule]: Initial Schedule State Received:`, initalSchedule);
        }
        socket.on(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);
        

        const onRaceScheduleUpdated = (data: RacetrackEvent<RaceScheduleUpdated>) => {
            const updatedSchedule = data.message.schedule;
            setScheduleState(updatedSchedule);

            console.log(`[📩 Race Schedule]: Race Schedule update received:`, updatedSchedule);
        }
        socket.on(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);


        const raceScheduleControllers : RaceScheduleControllers = {
            tryAddRace: (newRace: Race) => {
                const command: RacetrackCommand<ScheduleNewRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.ScheduleNewRace,
                        data: {
                            race: newRace,
                        }
                    }
                }
            },
            tryModifyRace: (raceId: string, updatedRace: Partial<Race>) => {
                const command: RacetrackCommand<ModifyRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.ModifyRace,
                        data: {
                            race: raceId, ...updatedRace,
                        }
                    }
                }
            },
            tryDeleteRace: (raceId: string) => {
                const command: RacetrackCommand<DeleteRace> = {
                    senderId: socket.id,
                    message: {
                        type: RaceScheduleCommands.DeleteRace,
                        data: {
                            race: raceId,
                        }
                    }
                }
            }
        }

        setScheduleState(raceScheduleControllers);

    }, [socket])

}
