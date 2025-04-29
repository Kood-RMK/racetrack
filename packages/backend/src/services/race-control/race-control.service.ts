import { RaceState, RacetrackCommand } from "@racetrack/types";
import type { Server as SocketIOServer } from "socket.io";
import { ActiveRaceService } from "../active-race/active-race.service";
import { Logger } from "pino";

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
    private readonly socketIO: SocketIOServer;
    private readonly activeRaceService : ActiveRaceService;
    private readonly logger : Logger;

    constructor(socketIO : SocketIOServer, activeRaceService : ActiveRaceService, parentLogger : Logger) {

        this.socketIO = socketIO;
        this.activeRaceService = activeRaceService;
        const logger = parentLogger.child({serviceName : this.constructor.name})
        this.logger = logger;

        const socketNamespace = this.socketIO.of("/race-control");

        // Middleware to check if the user is authenticated.
        socketNamespace.use((socket, next) => {
            next();
        })

        socketNamespace.on("connection", (client) => {


            this.logger.info(`New client connected!, ID`, client.id)

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
                    this.logger.error(`Error processing ${RaceControlCommands.ChangeRaceState} command:`, error)
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
                    this.logger.info(`Error processing ${RaceControlCommands.ChangeRaceHazard} command:`, error);
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
                    this.logger.info(`Error processing ${RaceControlCommands.ChangeRaceIsFinishing} command:`, error)
                }
            })
        })
    }
}