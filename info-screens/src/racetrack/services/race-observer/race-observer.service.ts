import { ActiveRaceService } from "services/active-race/active-race.service";
import type { Server as SocketIOServer } from "socket.io";
import { RacetrackCommand } from "types/messageTypes";
import { ActiveRaceId, RaceContestantId } from "types/stateTypes";


// Message Types

export enum RaceObserverEvents {
    LineCrossingHandled = "LineCrossingHandled",
}

export enum RaceObserverCommands {
    HandleLineCrossed = "HandleLineCrossed",
}


// Commands
export type HandleLineCrossed = {
    type : RaceObserverCommands.HandleLineCrossed,
    raceId : ActiveRaceId,
    contestantId : RaceContestantId,
}

// Events
export type LineCrossingHandeledEvent = {
    type : RaceObserverEvents.LineCrossingHandled,
    raceId : ActiveRaceId,
    contestantId : RaceContestantId,
}

export class RaceObserverService {

    private _socketIO: SocketIOServer;
    private _activeRaceService : ActiveRaceService;

    constructor(socketIO : SocketIOServer, activeRaceService : ActiveRaceService) {
        this._socketIO = socketIO;
        this._activeRaceService = activeRaceService;

        const socketNamespace = this._socketIO.of("/race-observer");

        // Middleware to check if the user is authenticated.
        socketNamespace.use((socket, next) => {
            next();
        })

        socketNamespace.on("connection", (client) => {
            client.on(RaceObserverCommands.HandleLineCrossed, (command : RacetrackCommand<HandleLineCrossed>) => {
                try {

                    // TODO: Validate the command.
                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const { type, raceId, contestantId } = command.message;

                    if (!this._activeRaceService.activeRace) {
                        throw new Error("There isn't currently an active race.")
                    }

                    const contestant = this._activeRaceService.activeRace?.getActiveRaceContestantById(contestantId);

                } catch (error) {

                }
            })
        });
    }

}