import type { Server as SocketIOServer } from "socket.io";
import { ActiveRace, RaceState } from "types/stateTypes";
import { RacetrackEvent, RacetrackCommand } from "types/messageTypes"
import { ActiveRaceState, ActiveRaceStateEvents } from "./race-control.state";
import { ActiveRaceService } from "services/active-race/active-race.service";

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


// Commands
export type ChangeActiveRaceState = {
    type : RaceControlCommands.ChangeRaceState,
    raceId : string,
    newState : RaceState,
};

export type ChangeActiveRaceHazard = {
    type : RaceControlCommands.ChangeRaceHazard,
    raceId : string,
    isHazard : boolean,
}

export type ChangeActiveRaceIsFinishing = {
    type : RaceControlCommands.ChangeRaceIsFinishing,
    raceId : string,
    isFinishing : boolean,
}


// Handlers.
export class RaceControlService {
    private socketIO: SocketIOServer;
    private activeRaceService : ActiveRaceService;

    constructor(socketIO : SocketIOServer, activeRaceService : ActiveRaceService) {

        this.socketIO = socketIO;
        this.activeRaceService = activeRaceService;

        const socketNamespace = this.socketIO.of("/race-control");

        // Middleware to check if the user is authenticated.
        socketNamespace.use((socket, next) => {
            next();
        })

        socketNamespace.on("connection", (client) => {
            console.log(`🧑 Race Control Service: New Client Connected! ID:`, client.id)

            client.on(RaceControlCommands.ChangeRaceState, (command : RacetrackCommand<ChangeActiveRaceState>) => {

                try {
                    // TODO: Validate the command.
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const activeRace = this.activeRaceService.activeRace?.activeRaceState;

                    if (!activeRace) {
                        throw new Error("There isn't currently an active race.")
                    }

                    if (activeRace.raceId !== command.message.raceId) {
                        return;
                    }

                    activeRace.setRaceState(command.message.newState);

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

                    const activeRace = this.activeRaceService.activeRace?.activeRaceState;

                    if (!activeRace) {
                        throw new Error("There isn't currently an active race.")
                    }

                    if (activeRace.raceId !== command.message.raceId) {
                        return;
                    }

                    activeRace.setIsHazard(command.message.isHazard);
                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceHazard} command:`, error);
                }
            });


            client.on(RaceControlCommands.ChangeRaceIsFinishing, (command : RacetrackCommand<ChangeActiveRaceIsFinishing>) => {
                try {
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const activeRace = this.activeRaceService.activeRace?.activeRaceState;

                    if (!activeRace) {
                        throw new Error("There isn't currently an active race.")
                    }

                    if (activeRace.raceId !== command.message.raceId) {
                        return;
                    }


                    activeRace.setIsFinishing(command.message.isFinishing);
                } catch(error) {
                    console.error(`Error processing ${RaceControlCommands.ChangeRaceIsFinishing} command:`, error);
                }
            })
        })
    }
}