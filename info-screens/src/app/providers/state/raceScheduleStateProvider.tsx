"use client";

import { DeleteRace, ModifyRace, RaceScheduleCommands, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, ScheduleNewRace } from "@/racetrack/services/race-schedule/race-schedule.service";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { Race, RaceSchedule } from "@/racetrack/types/stateTypes";
import { ReactNode, useEffect, useState, createContext, useContext, useRef } from "react";
import { useSocket } from "../socket/socketProvider";


// Contexts
const RaceScheduleContext = createContext<RaceSchedule | null>(null);


// Provider
export const RaceScheduleStateProvider = ({ children }: { children: ReactNode }) => {

    //  You are creating a piece of state called scheduleState that starts as an empty array [], 
    // and it must match the type RaceSchedule.
    const [scheduleState, setScheduleState] = useState<RaceSchedule>({});

    const socket = useSocket("/race-schedule");

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

        return () => {
            socket.off(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);
            socket.off(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);
        };
    }, [socket]);

    return (
        <RaceScheduleContext.Provider value={scheduleState}>
                {children}
        </RaceScheduleContext.Provider>
    );
};

// Hook to access the context easily
export const useRaceScheduleState = (): RaceSchedule | null => {
    const schedule = useContext(RaceScheduleContext);

    if (schedule === undefined) {
        throw new Error("useRaceScheduleState must be used within a RaceScheduleStateProvider");
    }

    return schedule;
};
