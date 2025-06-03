"use client";

import { ReactNode, useEffect, useState, createContext, useContext, useRef } from "react";
import { useSocket } from "../socket/socketProvider";
import { ActiveRaceEvents, ActiveRaceStateChanged, RaceScheduleCommands, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackEvent, ScheduledRace } from "racetrack-shared/types";

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
    const raceScheduleSocket = useSocket("/race-schedule");


    useEffect(() => {

        if (scheduleState) {
            setNextRace(scheduleState.filter(c => c.raceState === 'pending')[0] ?? null);
        }

    }, [scheduleState]);

    // useEffect to only mount the socket once and unhooklisteners when the component unmounts.
    useEffect(() => {

        if (!raceScheduleSocket.current) return;

        // receive the initial schedule state for new client
        const onScheduleInitialState = (data: RacetrackEvent<RaceScheduleInitialState>) => {
            const initialSchedule = data.message.schedule;
            setScheduleState(initialSchedule);

            console.log(`[Race Schedule Provider]: Initial Schedule State Received:`, initialSchedule);
        }
        raceScheduleSocket.current.on(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);


        const onRaceScheduleUpdated = (data: RacetrackEvent<RaceScheduleUpdated>) => {
            const updatedSchedule = data.message.schedule;
            setScheduleState(updatedSchedule);

            console.log(`[📩 Race Schedule updated]: Race Schedule update received:`, updatedSchedule);
        }
        raceScheduleSocket.current.on(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);

        const onRaceStateChanged = (data: RacetrackEvent<ActiveRaceStateChanged>) => {
            const { raceId, newState } = data.message;

            setScheduleState(prev => {
                if (!prev) return prev;

                const updatedSchedule = prev.map(scheduledRace =>
                    scheduledRace.raceId === raceId
                        ? { ...scheduledRace, raceState: newState }
                        : scheduledRace
                );

                console.log(`[🟢 Race State Changed]: Race ${raceId} changed to "${newState}"`);
                console.log("📋 Updated schedule state:", updatedSchedule);

                return updatedSchedule;
            });
        };

        raceScheduleSocket.current.on(ActiveRaceEvents.RaceStateChanged, onRaceStateChanged); // see siin sees on kahtlane

        return () => {
            raceScheduleSocket.current?.off(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);
            raceScheduleSocket.current?.off(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);
            raceScheduleSocket.current?.off(ActiveRaceEvents.RaceStateChanged, onRaceStateChanged);
        };
    }, [raceScheduleSocket]);

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
