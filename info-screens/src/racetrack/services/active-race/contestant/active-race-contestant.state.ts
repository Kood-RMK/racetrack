import EventEmitter from "events";
import { ActiveRaceContestant } from "types/stateTypes";


export enum ActiveRaceContestantStateEvents {
    ContestantPlaceChanged = 'onContestantPlaceChanged',
    ContestantLapCountChanged = 'onContestantLapCountChanged',
    ContestantFastestLapChanged = 'onContestantFastestLapChanged',
    ContestantLapStopwatchTick = 'onContestantLapStopwatchTick',
}

export interface ActiveRaceContestantStateCallbacks {
    [ActiveRaceContestantStateEvents.ContestantPlaceChanged] : (place: ActiveRaceContestant['place']) => void;
    [ActiveRaceContestantStateEvents.ContestantLapCountChanged] : (lapCount: ActiveRaceContestant['lapCount']) => void;
    [ActiveRaceContestantStateEvents.ContestantFastestLapChanged] : (fastestLap: ActiveRaceContestant['fastestLap']) => void;
    [ActiveRaceContestantStateEvents.ContestantLapStopwatchTick] : (lapTime: ActiveRaceContestant['currentLapStopwatchTime']) => void;
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

    public setPlace(newPlace: ActiveRaceContestant['place']) {
        console.log(`Contestant ${this._contestant.contestant.name} place changed to ${newPlace}`);
        this._contestant.place = newPlace;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantPlaceChanged, newPlace);
    }
    public setLapCount(newLapCount: ActiveRaceContestant['lapCount']) {
        console.log(`Contestant ${this._contestant.contestant.name} lap count changed to ${newLapCount}`);
        this._contestant.lapCount = newLapCount;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantLapCountChanged, newLapCount);
    }
    public setFastestLap(newFastestLap: ActiveRaceContestant['fastestLap']) {
        console.log(`Contestant ${this._contestant.contestant.name} fastest lap changed to ${newFastestLap}`);
        this._contestant.fastestLap = newFastestLap;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, newFastestLap);
    }

    public setCurrentLapStopwatchTick(newLapTime: ActiveRaceContestant['currentLapStopwatchTime']) {
        this._contestant.currentLapStopwatchTime = newLapTime;
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantLapStopwatchTick, newLapTime);
    }
}