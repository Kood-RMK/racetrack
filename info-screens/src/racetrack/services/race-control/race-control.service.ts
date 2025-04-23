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
}


// Events
export type ActiveRaceStateChanged = {
    type : RaceControlEvents.RaceStateChanged,
    newState : RaceState,
};

export type ActiveRaceHazardChanged = {
    type : RaceControlEvents.RaceHazardChanged,
    isHazard : boolean,
}

export type ActiveRaceIsFinishingChanged = {
    type : RaceControlEvents.RaceIsFinishingChanged,
    isFinishing : boolean,
}

export type ActiveRaceInitialState = {
    type : RaceControlEvents.RaceInitialState,
    raceInitialState : ActiveRace
}


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

        const onRaceStateChanged = (newState: ActiveRace['raceState']) => {
            try {
                const raceStateChangedMessage : RacetrackEvent<ActiveRaceStateChanged> = {
                    message : {
                        type: RaceControlEvents.RaceStateChanged,
                        newState: newState,
                    }
                }

                raceControlNamespace
                    .to(this.raceControlRoom)
                    .emit(RaceControlEvents.RaceStateChanged, raceStateChangedMessage);
            } catch (error) {
                console.error(`Error processing ${RaceControlEvents.RaceStateChanged} event:`, error);
            }
        }

        const onRaceHazardChanged = (isHazard: ActiveRace['isHazard']) => {
            try {
                const raceHazardChangedMessage : RacetrackEvent<ActiveRaceHazardChanged> = {
                    message : {
                        type: RaceControlEvents.RaceHazardChanged,
                        isHazard: isHazard,
                    }
                }

                raceControlNamespace
                    .to(this.raceControlRoom)
                    .emit(RaceControlEvents.RaceHazardChanged, raceHazardChangedMessage);

            } catch (error) {
                console.error(`Error processing ${RaceControlEvents.RaceHazardChanged} event:`, error);
            }
        };

        const onRaceIsFinishingChanged = (isFinishing: ActiveRace['isFinishing']) => {
                const raceIsFinishingChangedMessage : RacetrackEvent<ActiveRaceIsFinishingChanged> = {
                    message : {
                        type: RaceControlEvents.RaceIsFinishingChanged,
                        isFinishing: isFinishing,
                    }
                }

                raceControlNamespace
                    .to(this.raceControlRoom)
                    .emit(RaceControlEvents.RaceIsFinishingChanged, raceIsFinishingChangedMessage);
        }

        this.activeRace.events.on(ActiveRaceStateEvents.RaceStateChanged, onRaceStateChanged);
        this.activeRace.events.on(ActiveRaceStateEvents.RaceHazardChanged, onRaceHazardChanged);
        this.activeRace.events.on(ActiveRaceStateEvents.RaceIsFinishingChanged, onRaceIsFinishingChanged);


        raceControlNamespace.on("connection", (client) => {

            console.log(`🧑 Race Control Service: New Client Connected! ID:`, client.id)

            function initializeClientRooms() {
                client.join("raceControlRoom");
            }

            const stateMessage : RacetrackEvent<ActiveRaceInitialState> =  {
                message : {
                    type: RaceControlEvents.RaceInitialState,
                    raceInitialState: this.activeRace.activeRace,
                }
            }

            // Send new client the current state.
            client.emit(RaceControlEvents.RaceInitialState, stateMessage)

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