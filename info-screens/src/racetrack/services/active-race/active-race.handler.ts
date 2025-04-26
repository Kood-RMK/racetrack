import { ActiveRace, RaceState } from "types/stateTypes";
import { ActiveRaceState, ActiveRaceStateEvents } from "./active-race.state";
import { DefaultEventsMap, Namespace } from "socket.io";
import { RacetrackEvent } from "types/messageTypes";


export enum ActiveRaceEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceIsFinishingChanged = 'raceIsFinishingChanged',
}

export enum ActiveRaceCommands {
    RequestActiveRaceState = 'requestActiveRaceState',
}

// Events
export type ActiveRaceStateChanged = {
    type : ActiveRaceEvents.RaceStateChanged,
    newState : RaceState,
};

export type ActiveRaceHazardChanged = {
    type : ActiveRaceEvents.RaceHazardChanged,
    isHazard : boolean,
}

export type ActiveRaceIsFinishingChanged = {
    type : ActiveRaceEvents.RaceIsFinishingChanged,
    isFinishing : boolean,
}


export class ActiveRaceHandler {

    private readonly _activeRaceState: ActiveRaceState;
    private readonly _activeRaceRoom : string;

    public get activeRaceState() {
        return this._activeRaceState;
    }

    public get activeRaceRoom() {
        return this._activeRaceRoom;
    }

    constructor(private activeRace : ActiveRace, socketNamespace : Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

        this._activeRaceState = new ActiveRaceState(this.activeRace);
        this._activeRaceRoom = `activerace_${this._activeRaceState.raceId}`;


        socketNamespace.on("connection", (client) => {
            console.log(`[🧑 Active Race (${this._activeRaceRoom})]: New Client Connected! ID:`, client.id);


            client.on("join-room", (room) => {
                console.log('Client joined room:', room);
            })
        })


        const onRaceStateChanged = (newState: ActiveRace['raceState']) => {
            try {
                const raceStateChangedMessage : RacetrackEvent<ActiveRaceStateChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceStateChanged,
                        newState: newState,
                    }
                }

                socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceStateChanged, raceStateChangedMessage);
            } catch (error) {
                console.error(`Error processing ${ActiveRaceEvents.RaceStateChanged} event:`, error);
            }
        }

        const onRaceHazardChanged = (isHazard: ActiveRace['isHazard']) => {
            try {
                const raceHazardChangedMessage : RacetrackEvent<ActiveRaceHazardChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceHazardChanged,
                        isHazard: isHazard,
                    }
                }

                socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceHazardChanged, raceHazardChangedMessage);

            } catch (error) {
                console.error(`Error processing ${ActiveRaceEvents.RaceHazardChanged} event:`, error);
            }
        };

        const onRaceIsFinishingChanged = (isFinishing: ActiveRace['isFinishing']) => {

            try {
                const raceIsFinishingChangedMessage : RacetrackEvent<ActiveRaceIsFinishingChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceIsFinishingChanged,
                        isFinishing: isFinishing,
                    }
                }

                socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceIsFinishingChanged, raceIsFinishingChangedMessage);
            } catch (error) {
                console.error(`Error processing ${ActiveRaceEvents.RaceIsFinishingChanged} event:`, error);
            }
        }

        const activeRaceStateEvents = this._activeRaceState.events;

        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceStateChanged, onRaceStateChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceHazardChanged, onRaceHazardChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceIsFinishingChanged, onRaceIsFinishingChanged);
    }
}