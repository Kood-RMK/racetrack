
import type { DefaultEventsMap, Namespace, Server as SocketIOServer } from "socket.io";
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
    private activeRaceHandler : ActiveRaceHandler | null = null;
    private readonly socketServer: SocketIOServer;
    private readonly _eventEmitter = new ActiveRaceServiceEventEmitter();
    private readonly socketNamespace: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    constructor(io: SocketIOServer) {

        this.activeRaceHandler = null;
        this.socketServer = io;

        this.socketNamespace = this.socketServer.of("/active-race");

        this.socketNamespace.on("connection", (client) => {
            console.log(`New Client Connected! ID:`, client.id);
            
            if (this.activeRaceHandler) {
                console.log(`Client joined room: ${this.activeRaceHandler.activeRaceRoom}`);
                client.join(this.activeRaceHandler.activeRaceRoom);
            }
        });


        this._eventEmitter.on(ActiveRaceServiceEvents.ActiveRaceSet, async (activeRace) => {
            const clients = await this.socketNamespace.fetchSockets();
            const raceHandler = this.activeRaceHandler;
 
            if (raceHandler) {
                clients.forEach((client) => {
                    client.join(raceHandler.activeRaceRoom);
                });
            }
        })
    }

    

    public get activeRace() {
        return this.activeRaceHandler;
    }

    public get events() {
        return this._eventEmitter;
    }

    public setActiveRace(activeRace: ActiveRace) {
        this.activeRaceHandler = new ActiveRaceHandler(activeRace, this.socketNamespace);
        this._eventEmitter.emit(ActiveRaceServiceEvents.ActiveRaceSet, activeRace);
    }

    public removeActiveRace() {
        if (this.activeRaceHandler) {
            this._eventEmitter.emit(ActiveRaceServiceEvents.ActiveRaceRemoved, this.activeRaceHandler.activeRaceState.activeRace);
            this.activeRaceHandler = null;
        }
    }
}