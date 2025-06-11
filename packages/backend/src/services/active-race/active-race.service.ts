
import type { DefaultEventsMap, Namespace, RemoteSocket, Socket, Server as SocketIOServer } from "socket.io";
import EventEmitter from "events";
import { ActiveRaceHandler } from "./active-race.handler";
import { Logger } from "pino";
import { ActiveRace, RaceState, RacetrackClientRole } from "racetrack-shared/types";
import { DatabaseSync } from "node:sqlite";
import { ActiveRaceState, ActiveRaceStateEvents } from "./active-race.state";
import { useRacetrackAuth } from "../auth";

export enum ActiveRaceServiceEvents {
    ActiveRaceSet = 'activeRaceSet',
    ActiveRaceRemoved = 'activeRaceRemoved',
}

export interface ActiveRaceServiceCallbacks {
    [ActiveRaceServiceEvents.ActiveRaceSet] : (activeRace: ActiveRace) => void;
    [ActiveRaceServiceEvents.ActiveRaceRemoved] : (activeRace : ActiveRace) => void;
}

export class ActiveRaceServiceEventEmitter extends EventEmitter {

  off<K extends keyof ActiveRaceServiceCallbacks>(event: K, listener: ActiveRaceServiceCallbacks[K]): this {
    return super.off(event, listener);
  }

  on<K extends keyof ActiveRaceServiceCallbacks>(event: K, listener: ActiveRaceServiceCallbacks[K]): this {
    return super.on(event, listener);
  }

  emit<K extends keyof ActiveRaceServiceCallbacks>(event: K, ...args: Parameters<ActiveRaceServiceCallbacks[K]>): boolean {
    return super.emit(event, ...args);
  }
}

export class ActiveRaceService {

    // Either we have a active race or we don't.
    private _activeRaceHandler : ActiveRaceHandler | null = null;
    private _activeRaceState : ActiveRaceState | null = null;
    private readonly _socketServer: SocketIOServer;
    private readonly _eventEmitter = new ActiveRaceServiceEventEmitter();
    private readonly _socketNamespace: Namespace;
    private readonly _database: DatabaseSync;
    private readonly logger : Logger;

    constructor(io: SocketIOServer, parentLogger : Logger, database: DatabaseSync) {
        this._socketServer = io;
        this._socketNamespace = this._socketServer.of("/active-race");
        const logger = parentLogger.child({serviceName: this.constructor.name});
        this._database = database;
        this.logger = logger;

        this._activeRaceState = ActiveRaceState.loadFromDatabase(logger, this._database);

        this._socketNamespace.on("connection", async (client: Socket) => {

            if (!await useRacetrackAuth(client, this.logger, [RacetrackClientRole.GUEST, RacetrackClientRole.SAFETY, RacetrackClientRole.OBSERVER])) {
                this.logger.error("Unauthorized access to ActiveRace");
                client.disconnect();
                return;
            }
        })

        // Create active race handler if an active race is found in the database.
        if (this._activeRaceState) {
            this._activeRaceHandler = new ActiveRaceHandler(this._activeRaceState, this._socketNamespace, this.logger);
            this.addActiveRaceListeners(this._activeRaceHandler);
            this._activeRaceHandler.initialize();
        }
    }

    public get activeRace() {
        return this._activeRaceHandler;
    }

    public get events() {
        return this._eventEmitter;
    }

    private addActiveRaceListeners(activeRaceHandler: ActiveRaceHandler) {

        activeRaceHandler.activeRaceState.events.on(ActiveRaceStateEvents.RaceStateChanged, (newState) => {
            if (newState === RaceState.Completed || newState === RaceState.Canceled) {
                this.removeActiveRace();
            }
        })

        activeRaceHandler.activeRaceState.events.on(ActiveRaceStateEvents.TimeLeftChanged, (timeLeft) => {
            if (timeLeft <= 0 && this._activeRaceHandler) {
                this._activeRaceHandler.activeRaceState.setIsFinishing(true);
            }
        });
    }

    public setActiveRace(activeRace: ActiveRace) {
        this._activeRaceState = ActiveRaceState.createNew(activeRace, this.logger, this._database);
        this._activeRaceHandler = new ActiveRaceHandler(this._activeRaceState, this._socketNamespace, this.logger);
        this.addActiveRaceListeners(this._activeRaceHandler);
        this._activeRaceHandler.initialize();
        this._eventEmitter.emit(ActiveRaceServiceEvents.ActiveRaceSet, activeRace);
    }

    public removeActiveRace() {
        if (this._activeRaceHandler) {
            this._activeRaceHandler.destroy();
            this._eventEmitter.emit(ActiveRaceServiceEvents.ActiveRaceRemoved, this._activeRaceHandler.activeRaceState.activeRace);
            this._activeRaceHandler = null;
        }
    }
}