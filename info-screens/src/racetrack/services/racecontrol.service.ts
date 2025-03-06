import type { Server as IOServer } from "socket.io";
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
    io.of('/racecontrol').on('connection', (socket) => {
        console.log('a user connected to leaderboard namespace');
    });
}