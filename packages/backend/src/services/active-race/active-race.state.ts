import EventEmitter from "events";
import { ActiveRaceContestantState } from "./contestant/active-race-contestant.state";
import { ActiveRace } from "@racetrack/types";
import { Logger } from "pino";
import { DatabaseSync } from "node:sqlite";
import { ActiveRaceContestant } from "types";

export enum ActiveRaceStateEvents {
    RaceStateChanged = 'onRaceStateChanged',
    RaceHazardChanged = 'onRaceHazardChanged',
    RaceIsFinishingChanged = 'onRaceIsFinishingChanged',
    TimeLeftChanged = 'onTimeLeftChanged',
}

export interface ActiveRaceStateCallbacks {
    [ActiveRaceStateEvents.RaceStateChanged] : (newState: ActiveRace['raceState']) => void;
    [ActiveRaceStateEvents.RaceHazardChanged] : (isHazard: ActiveRace['isHazard']) => void;
    [ActiveRaceStateEvents.RaceIsFinishingChanged] : (isFinishing: ActiveRace['isFinishing']) => void;
    [ActiveRaceStateEvents.TimeLeftChanged] : (timeLeft: ActiveRace['timeLeft']) => void;
}

export class ActiveRaceStateEventEmitter extends EventEmitter {

  off<K extends keyof ActiveRaceStateCallbacks>(event: K, listener: ActiveRaceStateCallbacks[K]): this {
    return super.off(event, listener);
  }

  on<K extends keyof ActiveRaceStateCallbacks>(event: K, listener: ActiveRaceStateCallbacks[K]): this {
    return super.on(event, listener);
  }

  emit<K extends keyof ActiveRaceStateCallbacks>(event: K, ...args: Parameters<ActiveRaceStateCallbacks[K]>): boolean {
    return super.emit(event, ...args);
  }
}

export class ActiveRaceState {
    private _activeRace: ActiveRace;
    private _activeRaceContestantsState: ActiveRaceContestantState[];
    private _eventEmitter = new ActiveRaceStateEventEmitter();

    private readonly logger : Logger;
    private readonly _database: DatabaseSync;

    public static loadFromDatabase(baseLogger: Logger, database: DatabaseSync) : ActiveRaceState | null {
        const raceState = new ActiveRaceState(baseLogger, database);

        const activeRaceQuery = database.prepare("SELECT * FROM active_races LIMIT 1;");
        const activeRaceRow = activeRaceQuery.get();

        if (!activeRaceRow) {
            return null;
        }
        
        if (!(typeof activeRaceRow.raceId === 'string' 
            && typeof activeRaceRow.raceStartDateTime === 'string' 
            && typeof activeRaceRow.raceState === 'string'
            && typeof activeRaceRow.isHazard === 'boolean'
            && typeof activeRaceRow.isFinishing === 'boolean'
            && typeof activeRaceRow.timeLeft === 'number'
        )) {
            raceState.logger.error("Malformed active race row in database.");
            return null;
        }

        raceState._activeRace = {
            raceId: activeRaceRow.raceId,
            raceStartDateTime: new Date(activeRaceRow.raceStartDateTime),
            raceState: activeRaceRow.raceState,
            isHazard: activeRaceRow.isHazard,
            isFinishing: activeRaceRow.isFinishing,
            timeLeft: activeRaceRow.timeLeft,
        }

        const activeRaceContestantsQuery = database.prepare(`
            SELECT arc.contestantId as contestantId,
                rc.name,
                rc.racecarNumber,
                arc.place,
                arc.lapCount,
                arc.fastestLap,
                arc.lapStopwatchTime 
            FROM active_race_contestants arc
            JOIN race_contestants rc on rc.contestantId = arc.contestantId
            WHERE activeRaceId = @activeRaceId`
        );
        const activeRaceContestantsRows = activeRaceContestantsQuery.all({activeRaceId: activeRaceRow.raceId});


        // Get active race contestants from the database.
        raceState._activeRaceContestantsState = [];
        for (const contestantRow of activeRaceContestantsRows) {
            if (!(typeof contestantRow.contestantId === 'string' 
                && typeof contestantRow.racecarNumber === 'number'
                && typeof contestantRow.name === 'string'
                && typeof contestantRow.place === 'number'
                && typeof contestantRow.lapCount === 'number'
                && typeof contestantRow.fastestLap === 'number'
                && typeof contestantRow.lapStopwatchTime === 'number'
            )) {
                raceState.logger.error("Malformed active race contestant row in database.");
                return null;
            }

            const activeRaceContestant = {
                contestant: {
                    contestantId: contestantRow.contestantId,
                    racecarNumber: contestantRow.racecarNumber,
                    name: contestantRow.name,
                },
                place: contestantRow.place,
                lapCount: contestantRow.lapCount,
                fastestLap: contestantRow.fastestLap,
                lapStopwatchTime: contestantRow.lapStopwatchTime
            }

            raceState._activeRace.contestants[contestantRow.contestantId] = activeRaceContestant;
            const activeRaceContestantState = new ActiveRaceContestantState(activeRaceContestant, raceState.logger);
            raceState._activeRaceContestantsState.push(activeRaceContestantState);
        }

        return raceState;
    }

    public static createNew(activeRace: ActiveRace, baseLogger: Logger, database: DatabaseSync) {
        const raceState = new ActiveRaceState(baseLogger, database);

        raceState._activeRaceContestantsState = Object.entries(activeRace.contestants).map(([contestantId, contestant]) => {
            return new ActiveRaceContestantState(contestant, raceState.logger);
        });
    }

    private constructor(baseLogger : Logger, database: DatabaseSync) {
        this.logger = baseLogger.child({handlerName : this.constructor.name})
        this._activeRaceContestantsState = [];
        this._database = database;
    }

    public get events() {
        return this._eventEmitter;
    }

    public get raceId() {
        return this._activeRace.raceId;
    }

    public get raceDateTime() {
        return this._activeRace.raceStartDateTime;
    }

    public get contestants() {
        return this._activeRaceContestantsState;
    }

    public get raceState() {
        return this._activeRace.raceState;
    }

    public get isHazard() {
        return this._activeRace.isHazard;
    }

    public get isFinishing() {
        return this._activeRace.isFinishing;
    }

    public get timeLeft() {
        return this._activeRace.timeLeft;
    }

    public get activeRace() {
        return this._activeRace;
    }

    public setRaceState(raceState: ActiveRace['raceState']) {

        this._activeRace.raceState = raceState;
        this.logger.info(`Race state set to: ${raceState}.`)
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceStateChanged, raceState);
    }

    public setIsHazard(isHazard: ActiveRace['isHazard']) {

        this._activeRace.isHazard = isHazard;
        this.logger.info(`Hazard flag set to : ${isHazard}.`)
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceHazardChanged, isHazard);

        // Make sure that the isFinishing flag is not set when the hazard flag is set.
        if (this.isHazard && this.isFinishing) {
            this.setIsFinishing(false);
        }
    }

    public setIsFinishing(isFinishing: ActiveRace['isFinishing']) {

        this._activeRace.isFinishing = isFinishing;
        this.logger.info(`Is finishing flag set to : ${isFinishing}.`)
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceIsFinishingChanged, isFinishing);

        // Make sure that the isHazard flag is not set when the finishing flag is set.
        if (this.isFinishing && this.isHazard) {
            this.setIsHazard(false);
        }
    }

    public setTimeLeft(timeLeft: ActiveRace['timeLeft']) {
        this._activeRace.timeLeft = timeLeft;
        this._eventEmitter.emit(ActiveRaceStateEvents.TimeLeftChanged, timeLeft);
    }
}