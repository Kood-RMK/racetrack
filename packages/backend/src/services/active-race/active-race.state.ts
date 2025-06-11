import EventEmitter from "events";
import { ActiveRaceContestantState } from "./contestant/active-race-contestant.state";
import { Logger } from "pino";
import { DatabaseSync } from "node:sqlite";
import { ActiveRace, ActiveRaceContestant, RaceState } from "racetrack-shared/types";

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

        const logger = baseLogger.child({handlerName : this.constructor.name})            

        const activeRaceQuery = database.prepare("SELECT * FROM active_race LIMIT 1;");
        const activeRaceRow = activeRaceQuery.get();

        if (!activeRaceRow) {
            logger.info("No persisted active races.")
            return null;
        }

        if (!(typeof activeRaceRow.raceId === 'string' 
            && typeof activeRaceRow.raceScheduledStartTimeSlot === 'string' 
            && typeof activeRaceRow.raceState === 'string'
            && Object.values(RaceState).includes(activeRaceRow.raceState as RaceState)
            && typeof activeRaceRow.isHazard === 'number'
            && typeof activeRaceRow.isFinishing === 'number'
            && typeof activeRaceRow.timeLeft === 'number'
        )) {
            logger.error("Malformed active race row in database.");
            return null;
        }

        const activeRace : ActiveRace = {
            raceId: activeRaceRow.raceId,
            raceScheduledStartTimeSlot: activeRaceRow.raceScheduledStartTimeSlot,
            raceState: activeRaceRow.raceState as RaceState, 
            isHazard: !!activeRaceRow.isHazard,
            isFinishing: !!activeRaceRow.isFinishing,
            timeLeft: activeRaceRow.timeLeft,
            raceDurationSeconds : Number(process.env.RACE_DURATION_SECONDS),
            contestants : {}
        }

        const activeRaceContestantsQuery = database.prepare(`
            SELECT * FROM active_race_contestants WHERE activeRaceId = @activeRaceId`
        );
        const activeRaceContestantsRows = activeRaceContestantsQuery.all({activeRaceId: activeRaceRow.raceId});

        // Get active race contestants from the database.
        activeRace.contestants = {};
        for (const contestantRow of activeRaceContestantsRows) {
            if (!(
                typeof contestantRow.contestantId === 'string' 
                && typeof contestantRow.racecarNumber === 'number'
                && typeof contestantRow.name === 'string'
                && typeof contestantRow.place === 'number'
                && typeof contestantRow.lapCount === 'number'
                && (typeof contestantRow.fastestLap === 'number' || contestantRow.fastestLap === null)
                && typeof contestantRow.lapStopwatchTime === 'number'
            )) {
                logger.error("Malformed active race contestant row in database.");
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

            activeRace.contestants[contestantRow.contestantId] = activeRaceContestant;
        }

        console.log(`Active Race loaded from database: ${activeRace.raceId} with ${Object.keys(activeRace.contestants).length} contestants.`);
        return new ActiveRaceState(activeRace, logger, database);
    }

    public static createNew(activeRace: ActiveRace, baseLogger: Logger, database: DatabaseSync) {

        const updateRaceStateStatement = database.prepare(`
            INSERT INTO active_race (raceId, raceScheduledStartTimeSlot, raceState, isHazard, isFinishing, timeLeft) 
            VALUES (@raceId, @raceScheduledStartTimeSlot, @raceState, @isHazard, @isFinishing, @timeLeft)
            `);
        updateRaceStateStatement.run({
            raceId : activeRace.raceId,
            raceScheduledStartTimeSlot: activeRace.raceScheduledStartTimeSlot,
            raceState: activeRace.raceState,
            isHazard: activeRace.isHazard ? 1 : 0,
            isFinishing: activeRace.isFinishing ? 1 : 0,
            timeLeft: activeRace.timeLeft
        });

        // Insert contestants into the database.
        const insertContestantStatement = database.prepare(`
                INSERT INTO active_race_contestants (activeRaceId, contestantId, place, lapCount, fastestLap, lapStopwatchTime, name, racecarNumber)
                VALUES (@activeRaceId, @contestantId, @place, @lapCount, @fastestLap, @lapStopwatchTime, @name, @racecarNumber)
            `)


        for (const contestantId in activeRace.contestants) {
            const contestant = activeRace.contestants[contestantId] as ActiveRaceContestant;

            insertContestantStatement.run({
                activeRaceId: activeRace.raceId,
                contestantId: contestant.contestant.contestantId,
                place: contestant.place,
                lapCount: contestant.lapCount,
                fastestLap: contestant.fastestLap,
                lapStopwatchTime: contestant.lapStopwatchTime,
                name: contestant.contestant.name,
                racecarNumber: contestant.contestant.racecarNumber
            })
        }

        return new ActiveRaceState(activeRace, baseLogger, database);
    }

    private constructor(activeRace : ActiveRace, baseLogger : Logger, database: DatabaseSync) {
        this.logger = baseLogger.child({handlerName : this.constructor.name})
        this._activeRace = activeRace;

        // Initialize contestants state.
        this._activeRaceContestantsState = Object.entries(activeRace.contestants).map(([contestantId, contestant]) => {
            return new ActiveRaceContestantState(contestant, baseLogger, database);
        });

        this._database = database;
    }

    public destroy() {
        this.logger.info(`Destroying ActiveRace`);
        this.events.removeAllListeners();
        const deleteActiveRaceStatement = this._database.prepare(`DELETE FROM active_race WHERE raceId = @raceId`)
        deleteActiveRaceStatement.run({
            raceId : this._activeRace.raceId
        })
    }

    public get events() {
        return this._eventEmitter;
    }

    public get raceId() {
        return this._activeRace.raceId;
    }

    public get raceDateTime() {
        return this._activeRace.raceScheduledStartTimeSlot;
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

        const updateRaceStateStatement = this._database.prepare(`UPDATE active_race SET raceState = @raceState WHERE raceId = @raceId`);
        updateRaceStateStatement.run({
            raceState: raceState,
            raceId: this._activeRace.raceId
        });

        this.logger.info(`Race state set to: ${raceState}.`)
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceStateChanged, raceState);
    }

    public setIsHazard(isHazard: ActiveRace['isHazard']) {
        this._activeRace.isHazard = isHazard;

        const updateIsHazardStatement = this._database.prepare(`UPDATE active_race SET isHazard = @isHazard WHERE raceId = @raceId`);
        updateIsHazardStatement.run({
            isHazard: isHazard ? 1 : 0,
            raceId: this._activeRace.raceId
        });

        this.logger.info(`Hazard flag set to : ${isHazard}.`)
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceHazardChanged, isHazard);

        // Make sure that the isFinishing flag is not set when the hazard flag is set.
        if (this.isHazard && this.isFinishing) {
            this.setIsFinishing(false);
        }
    }

    public setIsFinishing(isFinishing: ActiveRace['isFinishing']) {

        if (this.timeLeft <= 0 && !isFinishing) {
            this.logger.warn(`Attempted to set isFinishing to false while timeLeft is 0. This is not allowed.`);
            return;
        }

        if (this._activeRace.isFinishing == true) {
            this.logger.warn(`Finishing flag set to true. This can't be undone.`)
            return;
        }

        this._activeRace.isFinishing = isFinishing;

        const updateIsFinishingStatement = this._database.prepare(`UPDATE active_race SET isFinishing = @isFinishing WHERE raceId = @raceId`);
        updateIsFinishingStatement.run({
            isFinishing: isFinishing ? 1 : 0,
            raceId: this._activeRace.raceId
        });

        this.logger.info(`Is finishing flag set to : ${isFinishing}.`)
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceIsFinishingChanged, isFinishing);

        // Make sure that the isHazard flag is not set when the finishing flag is set.
        if (this.isFinishing && this.isHazard) {
            this.setIsHazard(false);
        }
    }

    public setTimeLeft(timeLeft: ActiveRace['timeLeft']) {
        this._activeRace.timeLeft = timeLeft;

        if (timeLeft < 0) {
            this.logger.warn(`Attempted to set timeLeft to a negative value: ${timeLeft}. This is not allowed.`);
            return;
        }

        const updateTimeLeftStatement = this._database.prepare(`UPDATE active_race SET timeLeft = @timeLeft WHERE raceId = @raceId`);
        updateTimeLeftStatement.run({
            timeLeft: timeLeft,
            raceId: this._activeRace.raceId
        });

        this._eventEmitter.emit(ActiveRaceStateEvents.TimeLeftChanged, timeLeft);
    }
}