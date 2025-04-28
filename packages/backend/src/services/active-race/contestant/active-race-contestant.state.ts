import { ActiveRaceContestant } from "@racetrack/types";
import EventEmitter from "events";
export enum ActiveRaceContestantStateEvents {
    ContestantPlaceChanged = 'onContestantPlaceChanged',
    ContestantLapCountChanged = 'onContestantLapCountChanged',
    ContestantFastestLapChanged = 'onContestantFastestLapChanged',
    ContestantLapStopwatchTime = 'onContestantLapStopwatchTime',
}

export interface ActiveRaceContestantStateCallbacks {
    [ActiveRaceContestantStateEvents.ContestantPlaceChanged] : (contestant : ActiveRaceContestantState, prevValue : ActiveRaceContestant['place']) => void;
    [ActiveRaceContestantStateEvents.ContestantLapCountChanged] : (contestant : ActiveRaceContestantState, prevValue : ActiveRaceContestant['lapCount']) => void;
    [ActiveRaceContestantStateEvents.ContestantFastestLapChanged] : (contestant : ActiveRaceContestantState, prevValue : ActiveRaceContestant['fastestLap']) => void;
    [ActiveRaceContestantStateEvents.ContestantLapStopwatchTime] : (contestant : ActiveRaceContestantState, prevValue : ActiveRaceContestant['lapStopwatchTime']) => void;
}

export class ActiveRaceContestantStateEventEmitter extends EventEmitter {

  off<K extends keyof ActiveRaceContestantStateCallbacks>(event: K, listener: ActiveRaceContestantStateCallbacks[K]): this {
    return super.off(event, listener);
  }

  on<K extends keyof ActiveRaceContestantStateCallbacks>(event: K, listener: ActiveRaceContestantStateCallbacks[K]): this {
    return super.on(event, listener);
  }

  emit<K extends keyof ActiveRaceContestantStateCallbacks>(event: K, ...args: Parameters<ActiveRaceContestantStateCallbacks[K]>): boolean {
    return super.emit(event, ...args);
  }
}

export class ActiveRaceContestantState {
    private _contestant: ActiveRaceContestant;
    private _eventEmitter = new ActiveRaceContestantStateEventEmitter();

    constructor(contestant: ActiveRaceContestant) {
        this._contestant = contestant;
    }

    public get events() {
        return this._eventEmitter;
    }

    public get contestant() {
        return this._contestant.contestant;
    }

    public get place() {
        return this._contestant.place;
    }

    public get lapCount() {
        return this._contestant.lapCount;
    }

    public get fastestLap() {
        return this._contestant.fastestLap;
    }

    public get lapStopwatchTime() {
        return this._contestant.lapStopwatchTime;
    }

    public setPlace(newPlace: ActiveRaceContestant['place']) {
        console.log(`Contestant ${this._contestant.contestant.name} place changed to ${newPlace}`);
        const prevPlace = this._contestant.place;
        this._contestant.place = newPlace;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this, prevPlace);
    }
    public setLapCount(newLapCount: ActiveRaceContestant['lapCount']) {
        console.log(`Contestant ${this._contestant.contestant.name} lap count changed to ${newLapCount}`);
        const prevLapCount = this._contestant.lapCount;
        this._contestant.lapCount = newLapCount;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this, prevLapCount);
    }
    public setFastestLap(newFastestLap: ActiveRaceContestant['fastestLap']) {
        console.log(`Contestant ${this._contestant.contestant.name} fastest lap changed to ${newFastestLap}`);
        const prevFastestLap = this._contestant.fastestLap;
        this._contestant.fastestLap = newFastestLap;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this, prevFastestLap);
    }

    public setLapStopwatchTime(newTime: ActiveRaceContestant['lapStopwatchTime']) {
        this._contestant.lapStopwatchTime = newTime;
        const prevTime = this._contestant.lapStopwatchTime;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantLapStopwatchTime, this, prevTime);
    }
}