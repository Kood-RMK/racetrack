import { ActiveRaceContestant } from "types/stateTypes";
import { ActiveRaceContestantState, ActiveRaceContestantStateCallbacks, ActiveRaceContestantStateEvents } from "./active-race-contestant.state";
import { Namespace } from "socket.io";
import { RacetrackEvent } from "types/messageTypes";


export enum ActiveRaceContestantEvents {
    ContestantPlaceChanged = 'ContestantPlaceChanged',
    ContestantLapCountChanged = 'ContestantLapCountChanged',
    ContestantFastestLapChanged = 'ContestantFastestLapChanged',
    ContestantLapStopwatchTick = 'ContestantLapStopwatchTick',
}


//External Events
export type ActiveContestantPlaceChanged = {
    type : ActiveRaceContestantEvents.ContestantPlaceChanged,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],   
    place : ActiveRaceContestant['place'],
};

export type ActiveContestantLapCountChanged = {
    type : ActiveRaceContestantEvents.ContestantLapCountChanged,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],
    lapCount : ActiveRaceContestant['lapCount'],
}

export type ActiveContestantFastestLapChanged = {
    type : ActiveRaceContestantEvents.ContestantFastestLapChanged,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],
    fastestLap : ActiveRaceContestant['fastestLap'],
}

export type ActiveContestantLapStopwatchTick = {
    type : ActiveRaceContestantEvents.ContestantLapStopwatchTick,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],
    stopwatchTime : ActiveRaceContestant['lapStopwatchTime'],
}


export class ActiveRaceContestantHandler {

    private readonly _contestantState: ActiveRaceContestantState;
    private readonly _socketNamespace: Namespace;
    private readonly _contestantRoom : string;

    private onContestantPlaceChanged : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantPlaceChanged];
    private onContestantLapCountChanged : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantLapCountChanged];
    private onContestantFastestLapChanged : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantFastestLapChanged];
    private onContestantLapStopwatchTick : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantLapStopwatchTime];

    public get contestantRoom() {
        return this._contestantRoom;
    }

    public get contestantState() {
        return this._contestantState;
    }

    public lineCrossed() {
        this._contestantState.setLapCount(this._contestantState.lapCount + 1);
        const lapTime = this._contestantState.lapStopwatchTime;

        if (lapTime < this._contestantState.fastestLap) {
            this._contestantState.setFastestLap(lapTime);
        }

        this._contestantState.setLapStopwatchTime (0);
    }

    constructor(contestantState: ActiveRaceContestantState, socketNamespace : Namespace) {
        this._contestantState = contestantState;
        this._socketNamespace = socketNamespace;

        this._contestantRoom = `active-contestant-${this._contestantState.contestant.contestantId}`;

        this.onContestantPlaceChanged = (contestant, prevValue) => {

            const activeContestantPlaceChangedMessage : RacetrackEvent<ActiveContestantPlaceChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantPlaceChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    place: contestant.place,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantPlaceChanged, activeContestantPlaceChangedMessage);

            console.log(`[Active Contestant Handler] : Broadcasted contestant ${contestant.contestant.contestantId} place change to ${this._contestantRoom}.`);
        }

        this.onContestantLapCountChanged = (contestant, prevValue) => {

            const activeContestantLapCountChangedMessage : RacetrackEvent<ActiveContestantLapCountChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantLapCountChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    lapCount: contestant.lapCount,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantLapCountChanged, activeContestantLapCountChangedMessage);

            console.log(`[Active Contestant Handler] : Broadcasted contestant ${contestant.contestant.contestantId} lap count change to ${this._contestantRoom}.`);
        }

        this.onContestantFastestLapChanged = (contestant, prevValue) => {

            const activeContestantFastestLapChangedMessage : RacetrackEvent<ActiveContestantFastestLapChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantFastestLapChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    fastestLap: contestant.fastestLap,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantFastestLapChanged, activeContestantFastestLapChangedMessage);
        }

        this.onContestantLapStopwatchTick = (contestant, prevValue) => {

            const activeContestantLapStopwatchTickMessage : RacetrackEvent<ActiveContestantLapStopwatchTick> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantLapStopwatchTick,
                    contestantId: this._contestantState.contestant.contestantId,
                    stopwatchTime: contestant.lapStopwatchTime,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantLapStopwatchTick, activeContestantLapStopwatchTickMessage);
        }
    }


    public initialize() {
        const activeRaceContestantStateEvents = this._contestantState.events;

        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this.onContestantPlaceChanged);
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this.onContestantLapCountChanged);
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this.onContestantFastestLapChanged);
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantLapStopwatchTime, this.onContestantLapStopwatchTick);


        console.log(`[Active Race Handler (${this._contestantState.contestant.contestantId})]: Initialized!`);
    }

    public destroy() {
        const activeRaceContestantStateEvents = this._contestantState.events;

        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this.onContestantPlaceChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this.onContestantLapCountChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this.onContestantFastestLapChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantLapStopwatchTime, this.onContestantLapStopwatchTick);
        

        console.log(`[Active Race Handler (${this._contestantState.contestant.contestantId}]: Destroyed!`);
    }
}