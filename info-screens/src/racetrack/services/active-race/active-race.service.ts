
import type { DefaultEventsMap, Namespace, RemoteSocket, Socket, Server as SocketIOServer } from "socket.io";
import { ActiveRace } from "types/stateTypes";
import EventEmitter from "events";
import { ActiveRaceHandler } from "./active-race.handler";

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
    private readonly _socketServer: SocketIOServer;
    private readonly _eventEmitter = new ActiveRaceServiceEventEmitter();
    private readonly _socketNamespace: Namespace;

    constructor(io: SocketIOServer) {
        this._socketServer = io;
        this._socketNamespace = this._socketServer.of("/active-race");

        const mockRace : ActiveRace = {
            raceId : "123", 
            raceStartDateTime : "10:00 - 10:15",
            contestants : {},
            raceState : "pending",
            isHazard : false,
            isFinishing : false,
            timeLeft : "10:00",};

        this._activeRaceHandler = new ActiveRaceHandler(mockRace , this._socketNamespace);
        this._activeRaceHandler.initialize();

        this._socketNamespace.on("connection", (client) => {
            if (this._activeRaceHandler) {
                client.join(this._activeRaceHandler.activeRaceRoom);
            }
        });

        // When there is a new race, we need to add all clients to the correct rooms depending on their data requirements.
        this._eventEmitter.on(ActiveRaceServiceEvents.ActiveRaceSet, async (activeRace) => {
            const clients = await this._socketNamespace.fetchSockets();
            const raceHandler = this._activeRaceHandler;
 
            if (raceHandler) {
                clients.forEach((client) => {
                    this.addClientToActiveRaceRooms(client, raceHandler);
                });
            }
        })

        this._eventEmitter.on(ActiveRaceServiceEvents.ActiveRaceRemoved, async () => {
            const clients = await this._socketNamespace.fetchSockets();
            clients.forEach((client) => {
                if (this._activeRaceHandler) {
                    this.removeClientFromActiveRaceRooms(client, this._activeRaceHandler);
                }
            });
        });
    }

    private addClientToActiveRaceRooms(client: RemoteSocket<DefaultEventsMap, any>, activeRaceHandler: ActiveRaceHandler) {

        // Add client to the active race room, to get updates about the race state.
        client.join(activeRaceHandler.activeRaceRoom);

        // Add client to all contestant rooms, to get updates about their state.
        activeRaceHandler.activeRaceContestants.forEach((contestant) => {
            client.join(contestant.contestantRoom);
        });
    }

    private removeClientFromActiveRaceRooms(client: RemoteSocket<DefaultEventsMap, any>, activeRaceHandler: ActiveRaceHandler) {
        // Remove client from the active race room.
        client.leave(activeRaceHandler.activeRaceRoom);
        // Remove client from all contestant rooms.
        activeRaceHandler.activeRaceContestants.forEach((contestant) => {
            client.leave(contestant.contestantRoom);
        });
    }

    public get activeRace() {
        return this._activeRaceHandler;
    }

    public get events() {
        return this._eventEmitter;
    }

    public setActiveRace(activeRace: ActiveRace) {
        this._activeRaceHandler = new ActiveRaceHandler(activeRace, this._socketNamespace);
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