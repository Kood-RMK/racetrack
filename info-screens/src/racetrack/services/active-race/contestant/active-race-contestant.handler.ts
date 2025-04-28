import { ActiveRaceContestant } from "types/stateTypes";
import { ActiveRaceContestantState, ActiveRaceContestantStateEvents } from "./active-race-contestant.state";
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
    stopwatchTime : ActiveRaceContestant['currentLapStopwatchTime'],
}


export class ActiveRaceContestantHandler {

    private readonly _contestantState: ActiveRaceContestantState;
    private readonly _socketNamespace: Namespace;
    private readonly _contestantRoom : string;

    private onContestantPlaceChanged : (place: ActiveRaceContestant['place']) => void;
    private onContestantLapCountChanged : (lapCount: ActiveRaceContestant['lapCount']) => void;
    private onContestantFastestLapChanged : (fastestLap: ActiveRaceContestant['fastestLap']) => void;
    private onContestantLapStopwatchTick : (lapTime: ActiveRaceContestant['currentLapStopwatchTime']) => void;

    public get contestantRoom() {
        return this._contestantRoom;
    }

    constructor(contestantState: ActiveRaceContestantState, socketNamespace : Namespace) {
        this._contestantState = contestantState;
        this._socketNamespace = socketNamespace;

        this._contestantRoom = `active-contestant-${this._contestantState.contestant.contestantId}`;

        this.onContestantPlaceChanged = (place: ActiveRaceContestant['place']) => {

            const activeContestantPlaceChangedMessage : RacetrackEvent<ActiveContestantPlaceChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantPlaceChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    place: place,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantPlaceChanged, activeContestantPlaceChangedMessage);
        }

        this.onContestantLapCountChanged = (lapCount: ActiveRaceContestant['lapCount']) => {

            const activeContestantLapCountChangedMessage : RacetrackEvent<ActiveContestantLapCountChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantLapCountChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    lapCount: lapCount,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantLapCountChanged, activeContestantLapCountChangedMessage);
        }

        this.onContestantFastestLapChanged = (fastestLap: ActiveRaceContestant['fastestLap']) => {

            const activeContestantFastestLapChangedMessage : RacetrackEvent<ActiveContestantFastestLapChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantFastestLapChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    fastestLap: fastestLap,
                }
            }

            this._socketNamespace
            .to(this._contestantRoom)
            .emit(ActiveRaceContestantEvents.ContestantFastestLapChanged, activeContestantFastestLapChangedMessage);
        }

        this.onContestantLapStopwatchTick = (lapTime: ActiveRaceContestant['currentLapStopwatchTime']) => {

            const activeContestantLapStopwatchTickMessage : RacetrackEvent<ActiveContestantLapStopwatchTick> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantLapStopwatchTick,
                    contestantId: this._contestantState.contestant.contestantId,
                    stopwatchTime: lapTime,
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
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantLapStopwatchTick, this.onContestantLapStopwatchTick);


        console.log(`[Active Race Handler (${this._contestantState.contestant.contestantId})]: Initialized!`);
    }

    public destroy() {
        const activeRaceContestantStateEvents = this._contestantState.events;

        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this.onContestantPlaceChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this.onContestantLapCountChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this.onContestantFastestLapChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantLapStopwatchTick, this.onContestantLapStopwatchTick);
        

        console.log(`[Active Race Handler (${this._contestantState.contestant.contestantId}]: Destroyed!`);
    }
}