import type { DefaultEventsMap, Socket, Server as SocketIOServer } from "socket.io";
import { ActiveRace, RaceState } from "types/stateTypes";
import { RacetrackEvent, RacetrackCommand } from "types/messageTypes"
import { ActiveRaceState } from "./race-control.state";

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
                    this.activeRace.setIsHazard(command.message.isHazard);

                    raceControlNamespace
                        .to(this.raceControlRoom)
                        .emit(RaceControlEvents.RaceHazardChanged, this.activeRace.getIsHazard);

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceHazard} command:`, error);
                }
            });

            client.on(RaceControlCommands.ChangeRaceDanger, (command : RacetrackCommand<ChangeRaceDanger>) => {

                try {
                    // TODO: Validate the command.
                    this.activeRace.setIsDanger(command.message.isDanger);

                    raceControlNamespace
                        .to(this.raceControlRoom)
                        .emit(RaceControlEvents.RaceDangerChanged, this.activeRace.getIsDanger);

                } catch (error) {

                    console.error(`Error processing ${RaceControlCommands.ChangeRaceDanger} command:`, error);
                }
            });

            client.on(RaceControlCommands.ChangeRaceFinishing, (command : RacetrackCommand<ChangeRaceFinishing>) => {

                try {
                    // TODO: Validate the command.
                    this.activeRace.setIsFinishing(command.message.isFinishing);

                    raceControlNamespace
                        .to(this.raceControlRoom)
                        .emit(RaceControlEvents.RaceFinishingChanged, this.activeRace.getIsFinishing);

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