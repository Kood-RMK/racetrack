import { ActiveRaceId, RaceContestantId, RacetrackCommand } from "@racetrack/types";
import type { Server as SocketIOServer } from "socket.io";
import { ActiveRaceService } from "../active-race/active-race.service";


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

    private readonly _socketIO: SocketIOServer;
    private readonly _activeRaceService : ActiveRaceService;
    private readonly _raceObserverRoom : string;

    constructor(socketIO : SocketIOServer, activeRaceService : ActiveRaceService) {
        this._socketIO = socketIO;
        this._activeRaceService = activeRaceService;

        const socketNamespace = this._socketIO.of("/race-observer");
        this._raceObserverRoom = "race-observer-room";

        // Middleware to check if the user is authenticated.
        socketNamespace.use((socket, next) => {
            next();
        })

        socketNamespace.on("connection", (client) => {
            console.log(`[🔭 Race Observer Service] : New Client Connected ID: ${client.id}`)

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

                    if (!contestant) {
                        throw new Error("Contestant not found.");
                    }

                    contestant.onLineCrossed();

                    const event: LineCrossingHandeledEvent = {
                        type: RaceObserverEvents.LineCrossingHandled,
                        raceId: raceId,
                        contestantId: contestantId,
                    }

                    socketIO.to(this._raceObserverRoom).emit(event.type, event);
                } catch (error) {
                    console.error(`Error processing ${RaceObserverCommands.HandleLineCrossed} command:`, error);
                }
            })
        });
    }
}