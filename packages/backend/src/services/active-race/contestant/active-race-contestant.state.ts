import EventEmitter from "events";
import { Logger } from "pino";
import { DatabaseSync } from "node:sqlite";
import { ActiveRaceContestant } from "racetrack-shared/types";
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
    private readonly logger : Logger;
    private readonly _database: DatabaseSync;

    constructor(contestant: ActiveRaceContestant, parentLogger : Logger, database: DatabaseSync) {
        this._contestant = contestant;
        this.logger = parentLogger.child({handlerName : this.constructor.name})
        this._database = database;
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
        const prevPlace = this._contestant.place;
        this._contestant.place = newPlace;

        const updateContestantPlaceStatement = this._database.prepare(`UPDATE active_race_contestants SET place = @place WHERE contestantId = @contestantId;`);
        updateContestantPlaceStatement.run({
            place: newPlace,
            contestantId: this._contestant.contestant.contestantId
        });

        this.logger.info(`Contestant ${this._contestant.contestant.name} place changed to ${newPlace}.`)
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this, prevPlace);
    }
    public setLapCount(newLapCount: ActiveRaceContestant['lapCount']) {
        const prevLapCount = this._contestant.lapCount;
        this._contestant.lapCount = newLapCount;

        const updateContestantLapCountStatement = this._database.prepare(`UPDATE active_race_contestants SET lapCount = @lapCount WHERE contestantId = @contestantId;`);
        updateContestantLapCountStatement.run({
            lapCount: newLapCount,
            contestantId: this._contestant.contestant.contestantId
        });

        this.logger.info(`Contestant ${this._contestant.contestant.name} lap count changed to ${newLapCount}.`)
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this, prevLapCount);
    }
    public setFastestLap(newFastestLap: ActiveRaceContestant['fastestLap']) {
        const prevFastestLap = this._contestant.fastestLap;
        this._contestant.fastestLap = newFastestLap;

        const updateContestantFastestLapStatement = this._database.prepare(`UPDATE active_race_contestants SET fastestLap = @fastestLap WHERE contestantId = @contestantId;`);
        updateContestantFastestLapStatement.run({
            fastestLap: newFastestLap,
            contestantId: this._contestant.contestant.contestantId
        });

        this.logger.info(`Contestant ${this._contestant.contestant.name} lap count changed to ${newFastestLap}.`)
        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this, prevFastestLap);
    }

    public setLapStopwatchTime(newTime: ActiveRaceContestant['lapStopwatchTime']) {
        this._contestant.lapStopwatchTime = newTime;
        const prevTime = this._contestant.lapStopwatchTime;

        const updateContestantLapStopwatchTimeStatement = this._database.prepare(`UPDATE active_race_contestants SET lapStopwatchTime = @lapStopwatchTime WHERE contestantId = @contestantId;`)
        updateContestantLapStopwatchTimeStatement.run({
            lapStopwatchTime: newTime,
            contestantId: this._contestant.contestant.contestantId
        });

        this._eventEmitter.emit(ActiveRaceContestantStateEvents.ContestantLapStopwatchTime, this, prevTime);
    }
}