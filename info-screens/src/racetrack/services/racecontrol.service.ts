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
    io.on("connection",  (socket) => {
        socket.on("updateDrivers", (data) => {console.log(data)});
        socket.on("updateRaceState", (data) => {console.log(data)});
      });
}
