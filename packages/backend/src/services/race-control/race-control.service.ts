import type { Server as SocketIOServer } from "socket.io";
import { ActiveRaceService } from "../active-race/active-race.service";
import { Logger } from "pino";
import { ActiveRace, ActiveRaceContestant, ChangeActiveRaceHazard, ChangeActiveRaceIsFinishing, ChangeActiveRaceState, RaceControlCommands, RaceState, RacetrackCommand, StartRace } from "racetrack-shared/types";

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
            console.log(socket.handshake.auth);
            next();
        })

        socketNamespace.on("connection", (client) => {
            this.logger.info(`New client connected!, ID`, client.id)

            client.on(RaceControlCommands.StartRace, (command : RacetrackCommand<StartRace>) => {
                try {
                    const scheduledRace = command.message?.scheduledRace;

                    if (!scheduledRace) {
                        throw new Error("message.scheduledRace is undefined.");
                    }

                    const activeRace : ActiveRace = {
                        raceId: scheduledRace.raceId,
                        isHazard: false,
                        raceScheduledStartTimeSlot: scheduledRace.raceScheduledStartTimeSlot,
                        timeLeft : 10,
                        isFinishing: false,
                        contestants: scheduledRace.contestants.reduce((obj, contestant) => {

                            obj[contestant.contestantId] = {
                                contestant : contestant,
                                fastestLap : 0,
                                lapCount: 0,
                                lapStopwatchTime: 0,
                                place : 0,
                            } as ActiveRaceContestant;

                            return obj;
                        }, {} as Record<string, ActiveRaceContestant>),
                        raceDurationSeconds : 10,
                        raceState: RaceState.Active
                    }

                    this.activeRaceService.setActiveRace(activeRace);
                } catch (error) {

                }
            });

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