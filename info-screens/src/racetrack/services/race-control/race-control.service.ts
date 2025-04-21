import type { Server as SocketIOServer } from "socket.io";
import { ActiveRace, RaceState } from "types/stateTypes";
import { RacetrackEvent, RacetrackCommand } from "types/messageTypes"
import { ActiveRaceState } from "./race-control.state";

// Message Types
export enum RaceControlEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceIsFinishingChanged = 'raceIsFinishingChanged',
}

export enum RaceControlCommands {
    ChangeRaceState = 'changeRaceState',
    ChangeRaceHazard = 'changeRaceHazard',
    ChangeRaceIsFinishing = 'changeRaceIsFinishing',
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

export type RaceIsFinishingChanged = {
    type : RaceControlEvents.RaceIsFinishingChanged,
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

export type ChangeRaceIsFinishing = {
    type : RaceControlCommands.ChangeRaceIsFinishing,
    isFinishing : boolean,
}


// Handlers.
export class RaceControlService {
    private activeRace: ActiveRaceState;
    private io: SocketIOServer;

    private readonly raceControlRoom = "raceControlRoom";


    constructor(io : SocketIOServer) {
        this.activeRace = new ActiveRaceState();
        this.io = io;

        const raceControlNamespace = this.io.of("/race-control");

        // Middleware to check if the user is authenticated.
        raceControlNamespace.use((socket, next) => {
            next();
        })

        raceControlNamespace.on("connection", (client) => {

            function initializeClientRooms() {
                client.join("raceControlRoom");
            }


            const stateMessage : RacetrackEvent<ActiveRace> =  {
                message : this.activeRace.getActiveRace()
            }

            // Send new client the current state.
            client.emit(RaceControlEvents.RaceStateChanged, stateMessage)

            // Add new client to the raceControlRoom. 
            // TODO: select room based on assigned role.
            initializeClientRooms();

            client.on(RaceControlCommands.ChangeRaceState, (command : RacetrackCommand<ChangeRaceState>) => {

                try {
                    // TODO: Validate the command.
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    this.activeRace.setRaceState(command.message.newState);

                    raceControlNamespace
                        .to(this.raceControlRoom)
                        .emit(RaceControlEvents.RaceStateChanged, this.activeRace.getRaceState);

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceState} command:`, error);
                }
            })

            client.on(RaceControlCommands.ChangeRaceHazard, (command : RacetrackCommand<ChangeRaceHazard>) => {

                try {
                    // TODO: Validate the command.

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    this.activeRace.setIsHazard(command.message.isHazard);

                    raceControlNamespace
                        .to(this.raceControlRoom)
                        .emit(RaceControlEvents.RaceHazardChanged, this.activeRace.getIsHazard);

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceHazard} command:`, error);
                }
            });
        })
    }

    getActiveRace() {
        return this.activeRace;
    }
}