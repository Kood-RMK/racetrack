"use client";

import { ReactNode, useEffect, useState, createContext, useContext, useRef } from "react";
import { useSocket } from "../socket/socketProvider";
import { ActiveRaceEvents, ActiveRaceStateChanged, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackEvent, ScheduledRace } from "racetrack-shared/types";

// Contexts


export type RaceScheduleContextType = {
    schedule: RaceScheduleEntries | null;
    nextRace: ScheduledRace | null;
}

const RaceScheduleContext = createContext<RaceScheduleContextType>({
    schedule: null,
    nextRace: null,
});

// Provider
export const RaceScheduleStateProvider = ({ children }: { children: ReactNode }) => {

    // You are creating a piece of state called scheduleState that starts as an empty array [], 
    // and it must match the type RaceSchedule.
    const [scheduleState, setScheduleState] = useState<RaceScheduleEntries | null>(null);
    const [nextRace, setNextRace] = useState<ScheduledRace | null>(null);
    const socket = useSocket("/race-schedule");


    useEffect(() => {

        if (scheduleState) {
            setNextRace(scheduleState.filter(c => c.raceState === 'pending')[0] ?? null);
        }

    }, [scheduleState]);

    // useEffect to only mount the socket once and unhooklisteners when the component unmounts.
    useEffect(() => {

        if (!socket.current) {
            return;
        }

        // receive the initial schedule state for new client
        const onScheduleInitialState = (data: RacetrackEvent<RaceScheduleInitialState>) => {
            const initialSchedule = data.message.schedule;
            setScheduleState(initialSchedule);

            console.log(`[Race Schedule Provider]: Initial Schedule State Received:`, initialSchedule);
        }
        socket.current.on(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);


        const onRaceScheduleUpdated = (data: RacetrackEvent<RaceScheduleUpdated>) => {
            const updatedSchedule = data.message.schedule;
            setScheduleState(updatedSchedule);

            console.log(`[📩 Race Schedule updated]: Race Schedule update received:`, updatedSchedule);
        }
        socket.current.on(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);

        // const onRaceStateChanged = (data: RacetrackEvent<ActiveRaceStateChanged>) => {
        //     const { race, newState } = data.message;

        //     setScheduleState(prev => {
        //         if (!prev) return prev;
        //         return prev.map(scheduledRace =>
        //             scheduledRace.raceId === race.raceId
        //                 ? { ...scheduledRace, raceState: newState }
        //                 : scheduledRace
        //         );
        //     });
        // };
        // socket.current?.on(ActiveRaceEvents.RaceStateChanged, onRaceStateChanged);

        return () => {
            socket.current?.off(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);
            socket.current?.off(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);
            // socket.current?.off(ActiveRaceEvents.RaceStateChanged, onRaceStateChanged);
        };
    }, [socket]);

    return (
        <RaceScheduleContext.Provider value={{
            schedule: scheduleState,
            nextRace: nextRace
        }}>
            {children}
        </RaceScheduleContext.Provider>
    );
};

// Hook to access the context easily
export const useRaceScheduleState = (): RaceScheduleContextType => {
    const scheduleContext = useContext(RaceScheduleContext);

    if (scheduleContext === undefined) {
        throw new Error("useRaceScheduleState must be used within a RaceScheduleStateProvider");
    }

    return scheduleContext;
};
