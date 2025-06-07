"use client";

import { ReactNode, useEffect, useState, createContext, useContext, useMemo } from "react";
import { useSocket } from "../socket/socketProvider";
import { RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackEvent, ScheduledRace } from "racetrack-shared/types";

// Contexts

export type RaceScheduleContextType = {
    schedule: RaceScheduleEntries | null;
    nextRace: ScheduledRace | null;
    sortedSchedule: ScheduledRace[] | [];
    isPaddockMessageVisible: boolean;
};

const RaceScheduleContext = createContext<RaceScheduleContextType>({
    schedule: null,
    nextRace: null,
    sortedSchedule: [],
    isPaddockMessageVisible: false,
});

// Provider
export const RaceScheduleStateProvider = ({ children }: { children: ReactNode }) => {

    // You are creating a piece of state called scheduleState that starts as an empty array [], 
    // and it must match the type RaceSchedule.
    const [scheduleState, setScheduleState] = useState<RaceScheduleEntries | null>(null);
    const [nextRace, setNextRace] = useState<ScheduledRace | null>(null);
    const raceScheduleSocket = useSocket("/race-schedule");
    const [isPaddockMessageVisible, setIsPaddockMessageVisible] = useState(false);


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

            // Only show pending races
            const pendingSchedule = initialSchedule.filter(race => race.raceState === 'pending');

            setScheduleState(pendingSchedule);

            console.log(`[Race Schedule Provider]: Initial Schedule State Received (filtered):`, pendingSchedule);
        };
        raceScheduleSocket.current.on(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);

        const onRaceScheduleUpdated = (data: RacetrackEvent<RaceScheduleUpdated>) => {
            const updatedSchedule = data.message.schedule;

            const pendingSchedule = updatedSchedule.filter(race => race.raceState === 'pending');

            setScheduleState(pendingSchedule);

            console.log(`[📩 Race Schedule updated]: Filtered update received:`, pendingSchedule);
        };
        raceScheduleSocket.current.on(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);

        const onActiveRaceAdded = (data: { raceId: string; message: string }) => {

            console.log("[CLIENT]: Received 'activeRaceAdded'", data);

            setIsPaddockMessageVisible(false);
        };
        raceScheduleSocket.current.on("activeRaceAdded", onActiveRaceAdded);

        const onActiveRaceRemoved = (data: { raceId: string; message: string }) => {

            console.log("[CLIENT]: Received 'activeRaceRemoved'", data);

            setIsPaddockMessageVisible(true);
        };
        raceScheduleSocket.current.on("activeRaceRemoved", onActiveRaceRemoved);


    return () => {
        raceScheduleSocket.current?.off(RaceScheduleEvents.RaceScheduleInitialState, onScheduleInitialState);
        raceScheduleSocket.current?.off(RaceScheduleEvents.RaceScheduleUpdated, onRaceScheduleUpdated);
        raceScheduleSocket.current?.off("activeRaceAdded", onActiveRaceAdded);
        raceScheduleSocket.current?.off("activeRaceRemoved", onActiveRaceRemoved);
    };
}, [raceScheduleSocket]);

    // Calculate sortedSchedule here
    const sortedSchedule = useMemo(() => {
        if (!scheduleState) return [];

        function parseTimeslot(timeslot: string): number {
            const [start] = timeslot.split(' - ');
            const [hours, minutes] = start.split(':').map(Number);
            return hours * 60 + minutes;
        }

        return scheduleState
            .filter(race => race.raceState === 'pending')
            .sort((a, b) => parseTimeslot(a.raceScheduledStartTimeSlot) - parseTimeslot(b.raceScheduledStartTimeSlot));
    }, [scheduleState]);

    return (
        <RaceScheduleContext.Provider value={{
            schedule: scheduleState,
            nextRace: nextRace,
            sortedSchedule: sortedSchedule,
            isPaddockMessageVisible,
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
