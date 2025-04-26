import type { Server as SocketIOServer } from "socket.io";
import { ActiveRace, RaceState } from "types/stateTypes";
import { RacetrackEvent, RacetrackCommand } from "types/messageTypes"
import { ActiveRaceState, ActiveRaceStateEvents } from "./race-control.state";

// Message Types
export enum RaceControlEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceIsFinishingChanged = 'raceIsFinishingChanged',
    RaceInitialState = 'raceInitialState',
}

export enum RaceControlCommands {
    ChangeRaceState = 'changeRaceState',
    ChangeRaceHazard = 'changeRaceHazard',
    ChangeRaceIsFinishing = 'changeRaceIsFinishing',
    RequestRaceState = 'requestRaceState',
}


// Events


// Commands
export type ChangeActiveRaceState = {
    type : RaceControlCommands.ChangeRaceState,
    newState : RaceState,
};

export type ChangeActiveRaceHazard = {
    type : RaceControlCommands.ChangeRaceHazard,
    isHazard : boolean,
}

export type ChangeActiveRaceIsFinishing = {
    type : RaceControlCommands.ChangeRaceIsFinishing,
    isFinishing : boolean,
}

export type RequestActiveRaceState = {
    type : RaceControlCommands.RequestRaceState,
    raceState : ActiveRace,
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

            console.log(`🧑 Race Control Service: New Client Connected! ID:`, client.id)

            function initializeClientRooms() {
                client.join("raceControlRoom");
            }

            const initialStateMessage : RacetrackEvent<ActiveRaceInitialState> =  {
                message : {
                    type: RaceControlEvents.RaceInitialState,
                    raceInitialState: this.activeRace.activeRace,
                }
            }

            // Send new client the current state.
            client.emit(RaceControlEvents.RaceInitialState, initialStateMessage)

            // Add new client to the raceControlRoom. 
            // TODO: select room based on assigned role.
            initializeClientRooms();

            client.on(RaceControlCommands.ChangeRaceState, (command : RacetrackCommand<ChangeActiveRaceState>) => {

                try {
                    // TODO: Validate the command.
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    this.activeRace.setRaceState(command.message.newState);

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceState} command:`, error);
                }
            })

            client.on(RaceControlCommands.ChangeRaceHazard, (command : RacetrackCommand<ChangeActiveRaceHazard>) => {

                try {
                    // TODO: Validate the command.

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    this.activeRace.setIsHazard(command.message.isHazard);
                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceHazard} command:`, error);
                }
            });


            client.on(RaceControlCommands.ChangeRaceIsFinishing, (command : RacetrackCommand<ChangeActiveRaceIsFinishing>) => {
                try {
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    this.activeRace.setIsFinishing(command.message.isFinishing);
                } catch(error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceIsFinishing} command:`, error);
                }
            })
        })
    }

    getActiveRace() {
        return this.activeRace;
    }
}