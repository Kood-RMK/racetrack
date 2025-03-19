import { RangeCalendarStateContext } from "react-aria-components";
import type { Server as IOServer } from "socket.io";
import { Socket } from "socket.io-client";
import { RaceState } from "state";

export type RaceControlEvents = RaceStateChanged;
export type RaceControlCommands = ChangeRaceState;

export type ChangeRaceState = {
    type : 'changeRaceState',
    newState : RaceState
}

export type RaceStateChanged = {
    type : 'raceStateChanged',
    newState : RaceState
}

export function raceControlService(io : IOServer) {

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Recieve driver data from AdminPlacementCard
        socket.on("updateDrivers", (data) => {console.log(data)});

        // Recieve race state from RaceControlCard
        socket.on("changeRaceState", (raceState: ChangeRaceState) => {console.log(raceState.newState);

            //Broadcast the message to all clients
            io.emit("raceStateChanged", {
            type: "raceStateChanged",
            newState: raceState.newState,
            } as RaceStateChanged);
        });
        
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        })
    });
}
