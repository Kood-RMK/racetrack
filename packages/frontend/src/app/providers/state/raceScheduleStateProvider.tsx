"use client";

import { ReactNode, useEffect, useState, createContext, useContext, useRef } from "react";
import { useSocket } from "../socket/socketProvider";
import { RaceSchedule, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackEvent } from "racetrack-shared/types";


// Contexts
const RaceScheduleContext = createContext<RaceSchedule | null>(null);

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

            console.log(`[Race Schedule initial]: Initial Schedule State Received:`, initialSchedule);
        }
        socket.current.on(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);


        const onRaceScheduleUpdated = (data: RacetrackEvent<RaceScheduleUpdated>) => {
            const updatedSchedule = data.message.schedule;
            setScheduleState(prevSchedule => ({
                ...prevSchedule,
                ...updatedSchedule,
            }));

            console.log(`[📩 Race Schedule updated]: Race Schedule update received:`, updatedSchedule);
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

    console.log(schedule);
    return schedule;
};
