import type { Server as SocketIOServer } from "socket.io";
import { ActiveRaceService } from "../active-race/active-race.service";
import { Logger } from "pino";
import { ActiveRaceId, HandleLineCrossed, LineCrossingHandeledEvent, RaceContestantId, RaceObserverCommands, RaceObserverEvents, RacetrackClientRole, RacetrackCommand } from "racetrack-shared/types";
import { useRacetrackAuth } from "../auth";

export class RaceObserverService {

    private readonly _socketIO: SocketIOServer;
    private readonly _activeRaceService : ActiveRaceService;
    private readonly logger : Logger;

    constructor(socketIO : SocketIOServer, activeRaceService : ActiveRaceService, parentLogger : Logger) {
        this._socketIO = socketIO;
        this._activeRaceService = activeRaceService;
        const logger = parentLogger.child({serviceName : this.constructor.name})
        this.logger = logger;

        const socketNamespace = this._socketIO.of("/race-observer");

        socketNamespace.on("connection", (client) => {

            this.logger.info(`New Client Connected ID: ${client.id}`)
            client.on(RaceObserverCommands.HandleLineCrossed, async (command : RacetrackCommand<HandleLineCrossed>) => {
                try {

                    if (!await useRacetrackAuth(client, this.logger, [RacetrackClientRole.OBSERVER])){
                        this.logger.error("Unauthorized access to Race.ChangeRaceIsFinishing");
                        return;
                    }

                    // TODO: Validate the command.
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const { type, raceId, contestantId } = command.message;

                    if (!this._activeRaceService.activeRace) {
                        throw new Error("There isn't currently an active race.")
                    }

                    const contestant = this._activeRaceService.activeRace?.getActiveRaceContestantById(contestantId);

                    if (!contestant) {
                        throw new Error("Contestant not found.");
                    }

                    contestant.onLineCrossed();

                    const event: LineCrossingHandeledEvent = {
                        type: RaceObserverEvents.LineCrossingHandled,
                        raceId: raceId,
                        contestantId: contestantId,
                    }

                    socketNamespace.emit(event.type, event);
                } catch (error) {
                    this.logger.error(`Error processing ${RaceObserverCommands.HandleLineCrossed}.`, error)
                }
            })
        });
    }
}