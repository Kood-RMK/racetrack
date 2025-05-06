"use client";

import { ReactNode, useEffect, useState, createContext, useContext, useRef } from "react";
import { useSocket } from "../socket/socketProvider";
import { RaceSchedule, RacetrackEvent } from "racetrack-shared/types";
import { RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated } from "racetrack-backend/services";
import { RaceScheduleEntries } from "racetrack-backend/services/race-schedule/race-schedule.state.js";


// Contexts
const RaceScheduleContext = createContext<RaceScheduleEntries | null>(null);


// Provider
export const RaceScheduleStateProvider = ({ children }: { children: ReactNode }) => {

    // You are creating a piece of state called scheduleState that starts as an empty array [], 
    // and it must match the type RaceSchedule.
    const [scheduleState, setScheduleState] = useState<RaceScheduleEntries>({});

    const socket = useSocket("/race-schedule");

    // useEffect to only mount the socket once and unhooklisteners when the component unmounts.
    useEffect(() => {

        if (!socket.current) {
            return;
        }

        // receive the initial schedule state for new client
        const onScheduleInitialState = (data: RacetrackEvent<RaceScheduleInitialState>) => {
            const initialSchedule = data.message.schedule; // mis sisse tuleb?
            setScheduleState(initialSchedule); // mis v'lja peab minema?

            console.log(`[📩 Race Schedule]: Initial Schedule State Received:`, initialSchedule);
        }
        socket.current.on(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);


        const onRaceScheduleUpdated = (data: RacetrackEvent<RaceScheduleUpdated>) => {
            const updatedSchedule = data.message.schedule;
            setScheduleState(updatedSchedule);

            console.log(`[📩 Race Schedule]: Race Schedule update received:`, updatedSchedule);
        }
        socket.current.on(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);

        return () => {
            socket.current?.off(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);
            socket.current?.off(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);
        };
    }, [socket]);

    return (
        <RaceScheduleContext.Provider value={scheduleState}>
                {children}
        </RaceScheduleContext.Provider>
    );
};

// Hook to access the context easily
export const useRaceScheduleState = (): RaceScheduleEntries | null => {
    const schedule = useContext(RaceScheduleContext);

    if (schedule === undefined) {
        throw new Error("useRaceScheduleState must be used within a RaceScheduleStateProvider");
    }

    return schedule;
};
