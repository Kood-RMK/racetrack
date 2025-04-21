import type { Server as SocketIOServer } from "socket.io";
import { ActiveRace, RaceState } from "types/stateTypes";
import { RacetrackEvent, RacetrackCommand } from "types/messageTypes"
import { ActiveRaceState } from "./race-control.state";
import { exportPages } from "next/dist/export/worker";


// Message Types
export enum RaceControlEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceDangerChanged = 'raceDangerChanged',
    RaceFinishingChanged = 'raceFinishingChanged',
}

export enum RaceControlCommands {
    ChangeRaceState = 'changeRaceState',
    ChangeRaceHazard = 'changeRaceHazard',
    ChangeRaceDanger = 'changeRaceDanger',
    ChangeRaceFinishing = 'changeRaceFinishing',
}

// Events
export type RaceStateChanged = {
    type : RaceControlEvents.RaceStateChanged,
    newState : RaceState,
};

export type RaceHazardChanged = {
    type : RaceControlEvents.RaceHazardChanged,
    isHazard : boolean,
}

export type RaceDangerChanged = {
    type : RaceControlEvents.RaceDangerChanged,
    isDanger : boolean,
}

// This is used to indicate that the race is finishing. 
// It is displayed before the race is finished.
export type RaceFinishingChanged = {
    type : RaceControlEvents.RaceFinishingChanged,
    isFinishing : boolean,
}

// Commands
export type ChangeRaceState = {
    type : RaceControlCommands.ChangeRaceState,
    newState : RaceState,
};

export type ChangeRaceHazard = {
    type : RaceControlCommands.ChangeRaceHazard,
    isHazard : boolean,
}

export type ChangeRaceDanger = {
    type : RaceControlCommands.ChangeRaceDanger,
    isDanger : boolean,
}

export type ChangeRaceFinishing = {
    type : RaceControlCommands.ChangeRaceFinishing,
    isFinishing : boolean,
}


// Handlers.

export class RaceControlService {
    private activeRace: ActiveRaceState;
    private socket: SocketIOServer;

    constructor(io : SocketIOServer) {
        this.activeRace = new ActiveRaceState();
        this.socket = io;

        this.socket.on("connection", (client) => {
            const stateMessage : RacetrackEvent<ActiveRace> =  {
                message : this.activeRace.getActiveRace()
            }

            // Send new client the current state.
            client.emit(RaceControlEvents.RaceStateChanged, stateMessage)


            client.on(RaceControlCommands.ChangeRaceState, (command : RacetrackCommand<ChangeRaceState>) => {

                try {

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceState} command:`, error);
                }

            })


            client.on(RaceControlCommands.ChangeRaceHazard, (command : RacetrackCommand<ChangeRaceHazard>) => {

                try {

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceHazard} command:`, error);
                }
            });

            client.on(RaceControlCommands.ChangeRaceDanger, (command : RacetrackCommand<ChangeRaceDanger>) => {

                try {

                } catch (error) {

                    console.error(`Error processing ${RaceControlCommands.ChangeRaceDanger} command:`, error);
                }
            });

            client.on(RaceControlCommands.ChangeRaceFinishing, (command : RacetrackCommand<ChangeRaceFinishing>) => {

                try {

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceFinishing} command:`, error);
                }
            });
        })
    }

    getActiveRace() {
        return this.activeRace;
    }
}