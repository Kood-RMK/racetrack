import { ActiveRace, ActiveRaceContestant, ActiveRaceId, RaceContestantId, RaceState } from "types/stateTypes";
import { ActiveRaceState, ActiveRaceStateEvents } from "./active-race.state";
import { Namespace, Socket } from "socket.io";
import { RacetrackEvent } from "types/messageTypes";
import { ActiveRaceContestantEvents, ActiveRaceContestantHandler } from "./contestant/active-race-contestant.handler";
import { ActiveRaceContestantStateEvents } from "./contestant/active-race-contestant.state";

export enum ActiveRaceEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceIsFinishingChanged = 'raceIsFinishingChanged',
    RaceInitialState = 'raceInitialState',
}

export enum ActiveRaceCommands {
    RequestActiveRaceState = 'requestActiveRaceState',
}

//External Events
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

export type ActiveRaceInitialState = {
    type : ActiveRaceEvents.RaceInitialState,
    race : ActiveRace,
}


type ActiveContestantHandlers = Record<RaceContestantId, ActiveRaceContestantHandler>;

export class ActiveRaceHandler {

    private readonly _activeRaceState: ActiveRaceState;
    private readonly _activeRaceRoom : string;
    private readonly _socketNamespace : Namespace;

    private readonly _activeRaceContestantHandlers: ActiveContestantHandlers;

    public get activeRaceState() {
        return this._activeRaceState;
    }

    public get activeRaceContestants() {
        return Object.entries (this._activeRaceContestantHandlers).map(([contestantId, contestantHandler]) => {return contestantHandler});
    }

    public getActiveRaceContestantById(contestantId: RaceContestantId) {
        return this._activeRaceContestantHandlers[contestantId];
    }

    public get activeRaceRoom() {
        return this._activeRaceRoom;
    }


    private onConnection : (client: Socket) => void;
    private onRaceStateChanged : (newState: ActiveRace['raceState']) => void;
    private onRaceHazardChanged : (isHazard: ActiveRace['isHazard']) => void;
    private onRaceIsFinishingChanged : (isFinishing: ActiveRace['isFinishing']) => void;

    private refreshContestantPlacement() {

    }

    constructor(private activeRace : ActiveRace, socketNamespace : Namespace) {
        this._activeRaceState = new ActiveRaceState(activeRace);


        // Create a handler for each active contestant.
        this._activeRaceContestantHandlers = this._activeRaceState.contestants.reduce((contestantHandlers, contestantState) => {
            const contestantHandler  = new ActiveRaceContestantHandler(contestantState, socketNamespace);

            contestantHandler.contestantState.events.on(ActiveRaceContestantStateEvents.ContestantLapCountChanged, (lapCount: ActiveRaceContestant['lapCount']) => {
                
            });

            contestantHandlers[contestantState.contestant.contestantId] = contestantHandler;

            return contestantHandlers;
        }, {} as ActiveContestantHandlers);


        this._activeRaceRoom = `active-race-${this._activeRaceState.raceId}`;
        this._socketNamespace = socketNamespace;

        this.onConnection = (client : Socket) => {
            console.log(`[🧑 Active Race (${this._activeRaceRoom})]: New Client Connected! ID:`, client.id);

            const initialStateMessage : RacetrackEvent<ActiveRaceInitialState> = {
                message : {
                    type: ActiveRaceEvents.RaceInitialState,
                    race : this.activeRaceState.activeRace,
                }
            }

            client.emit(ActiveRaceEvents.RaceInitialState, initialStateMessage);
        }

        this.onRaceStateChanged = (newState: ActiveRace['raceState']) => {
            try {
                const raceStateChangedMessage : RacetrackEvent<ActiveRaceStateChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceStateChanged,
                        newState: newState,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceStateChanged, raceStateChangedMessage);

                console.log(`[📩 Active Race Handler]: Race State Change Broadcasted to: ${this._activeRaceRoom}`)

            } catch (error) {
                console.error(`Error processing ${ActiveRaceEvents.RaceStateChanged} event:`, error);
            }
        }

        this.onRaceHazardChanged = (isHazard: ActiveRace['isHazard']) => {
            try {
                const raceHazardChangedMessage : RacetrackEvent<ActiveRaceHazardChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceHazardChanged,
                        isHazard: isHazard,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceHazardChanged, raceHazardChangedMessage);

            } catch (error) {
                console.error(`Error processing ${ActiveRaceEvents.RaceHazardChanged} event:`, error);
            }
        }

        this.onRaceIsFinishingChanged = (isFinishing: ActiveRace['isFinishing']) => {
            try {
                const raceIsFinishingChangedMessage : RacetrackEvent<ActiveRaceIsFinishingChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceIsFinishingChanged,
                        isFinishing: isFinishing,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceIsFinishingChanged, raceIsFinishingChangedMessage);
            } catch (error) {
                console.error(`Error processing ${ActiveRaceEvents.RaceIsFinishingChanged} event:`, error);
            }
        }
    }

    public initialize() {
        const activeRaceStateEvents = this._activeRaceState.events;


        Object.entries(this._activeRaceContestantHandlers).forEach(([contestantId, contestantHandler]) => {
            contestantHandler.initialize();
        });

        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceStateChanged, this.onRaceStateChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceHazardChanged, this.onRaceHazardChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceIsFinishingChanged, this.onRaceIsFinishingChanged);


        this._socketNamespace.on("connection", this.onConnection);

        console.log(`[Active Race Handler (${this.activeRace.raceId})]: Initialized!`);
    }

    public destroy() {
        const activeRaceStateEvents = this._activeRaceState.events;

        activeRaceStateEvents.off(ActiveRaceStateEvents.RaceStateChanged, this.onRaceStateChanged);
        activeRaceStateEvents.off(ActiveRaceStateEvents.RaceHazardChanged, this.onRaceHazardChanged);
        activeRaceStateEvents.off(ActiveRaceStateEvents.RaceIsFinishingChanged, this.onRaceIsFinishingChanged);

        Object.entries(this._activeRaceContestantHandlers).forEach(([contestantId, contestantHandler]) => {
            contestantHandler.destroy();
        });

        this._socketNamespace.off("connection", this.onConnection);

        console.log(`[Active Race Handler (${this.activeRace.raceId})]: Destroyed!`);
    }
}