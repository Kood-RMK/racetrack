"use client";

import { useSocket } from "@/components/socket/SocketProvider";
import { RaceControlEvents } from "@/racetrack/services/race-control/race-control.service";
import { RaceScheduleInitialState } from "@/racetrack/services/race-schedule/race-schedule.service";
import { RacetrackEvent } from "@/racetrack/types/messageTypes";
import { ReactNode, useEffect } from "react";


export const RaceScheduleStateProvider = ({children} : {children : ReactNode}) => {

    const socket = useSocket;

    // useEffect to only mount the socket once and unhook listeners when the component unmounts.
    useEffect(() => {

        if (!socket) {
            // Socket is not yet available.
            return;
        }

        // receive the initial schedule state for new client
        const onScheduleInitialState = (data: RacetrackEvent<RaceScheduleInitialState>) => {
              const initalSchedule = data.message.schedule;
              set(initalSchedule);
        
              console.log(`[📩 Race Schedule]: Initial Schedule State Received:`, initalSchedule);
            }
            socket.on(RaceControlEvents.RaceScheduleInitialState, onScheduleInitialState)
        
        // Listen for schedule updates
    })

}