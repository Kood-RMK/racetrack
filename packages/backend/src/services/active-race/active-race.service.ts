
import type { DefaultEventsMap, Namespace, RemoteSocket, Socket, Server as SocketIOServer } from "socket.io";
import EventEmitter from "events";
import { ActiveRaceHandler } from "./active-race.handler";
import { Logger } from "pino";
import { ActiveRace, RacetrackClientRole } from "racetrack-shared/types";
import { DatabaseSync } from "node:sqlite";
import { ActiveRaceState } from "./active-race.state";
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

        // Create active race handler if an active race is found in the database.
        if (this._activeRaceState) {
            this._activeRaceHandler = new ActiveRaceHandler(this._activeRaceState, this._socketNamespace, this.logger);
            this._activeRaceHandler.initialize();
        }


        // Middleware to check if the user is authenticated.
        this._socketNamespace.use((socket, next) => {
            useRacetrackAuth(
                socket, 
                next, 
                this.logger, 
                [
                    RacetrackClientRole.OBSERVER,
                    RacetrackClientRole.RECEPTIONIST,
                    RacetrackClientRole.SAFETY
                ]);
        })

        this._socketNamespace.on("connection", (client) => {
        });

        // When there is a new race, we need to add all clients to the correct rooms depending on their data requirements.
        this._eventEmitter.on(ActiveRaceServiceEvents.ActiveRaceSet, async (activeRace) => {
        })

        this._eventEmitter.on(ActiveRaceServiceEvents.ActiveRaceRemoved, async () => {
        });
    }


    public get activeRace() {
        return this._activeRaceHandler;
    }

    public get events() {
        return this._eventEmitter;
    }

    public setActiveRace(activeRace: ActiveRace) {
        this._activeRaceState = ActiveRaceState.createNew(activeRace, this.logger, this._database);
        this._activeRaceHandler = new ActiveRaceHandler(this._activeRaceState, this._socketNamespace, this.logger);
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