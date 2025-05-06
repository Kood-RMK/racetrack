
import EventEmitter from "events";
import { ScheduledRace } from "racetrack-shared/types";

export enum RaceScheduleEvents {
    RaceScheduleChanged = 'onRaceScheduleChanged',
    RaceScheduleDeleted = 'onRaceScheduleDeleted',
    RaceScheduleAdded = 'onRaceScheduleAdded',
}

export interface RaceScheduleCallbacks {
    [RaceScheduleEvents.RaceScheduleChanged] : (entries : RaceScheduleEntryState[]) => void;
}

export class RaceScheduleEventEmitter extends EventEmitter {
    off<K extends keyof RaceScheduleCallbacks>(event: K, listener: RaceScheduleCallbacks[K]): this {
        return super.off(event, listener);
    }

    on<K extends keyof RaceScheduleCallbacks>(event: K, listener: RaceScheduleCallbacks[K]): this {
        return super.on(event, listener);
    }

    emit<K extends keyof RaceScheduleCallbacks>(event: K, ...args: Parameters<RaceScheduleCallbacks[K]>): boolean {
        return super.emit(event, ...args);
    }
}

export type RaceScheduleStateEntries = Record<ScheduledRace['raceId'], RaceScheduleEntryState>

// Get for all races in race schedule
export class RaceScheduleState {
    private _raceScheduleStateEntries: RaceScheduleStateEntries = {};
    private _eventEmitter = new RaceScheduleEventEmitter();

    public get raceScheduleEntries(): RaceScheduleStateEntries {
        return this._raceScheduleStateEntries;
    }

    public get events() {
        return this._eventEmitter;
    }

    public getRaceById(id : ScheduledRace['raceId']) {
        return this._raceScheduleStateEntries[id];
    }

    public addRace(entry : RaceScheduleEntryState) {
        this._raceScheduleStateEntries[entry.raceId] = entry;
        return entry;
    }

    public deleteRace(id : ScheduledRace['raceId']) {
        delete this._raceScheduleStateEntries[id];
    }

    public modifyRace(id : ScheduledRace['raceId']) {
        
    }
}

export enum RaceScheduleEntryEvents {
    RaceIdChanged = 'onRaceIdChanged',
    ContestantsChanged = 'onContestantsChanged',
    RaceDateTimeChanged = 'onRaceDateTimeChanged',
    RaceStateChanged = 'onRaceStateChanged',
}

export interface RaceScheduleEntryCallbacks {
    [RaceScheduleEntryEvents.RaceIdChanged] : (raceId: ScheduledRace['raceId']) => void;
    [RaceScheduleEntryEvents.ContestantsChanged] : (contestants: ScheduledRace['contestants']) => void;
    [RaceScheduleEntryEvents.RaceDateTimeChanged] : (raceDateTime: ScheduledRace['raceScheduledStartUnixTime']) => void;
    [RaceScheduleEntryEvents.RaceStateChanged] : (newState: ScheduledRace['raceState']) => void;
}

export class RaceScheduleEntryEventEmitter extends EventEmitter {
    off<KM extends keyof RaceScheduleEntryCallbacks>(event: KM, listener: RaceScheduleEntryCallbacks[KM]): this {
        return super.off(event, listener);
    }

    on<KM extends keyof RaceScheduleEntryCallbacks>(event: KM, listener: RaceScheduleEntryCallbacks[KM]): this {
        return super.on(event, listener);
    }

    emit<KM extends keyof RaceScheduleEntryCallbacks>(event: KM, ...args: Parameters<RaceScheduleEntryCallbacks[KM]>): boolean {
        return super.emit(event, ...args);
    }
}

// One race cake recipe
export class RaceScheduleEntryState {
    private _race: ScheduledRace;
    private _eventEmitter = new RaceScheduleEntryEventEmitter();

    constructor(race : ScheduledRace) {
        this._race = race;
        console.log(`☀️ Race State: Initial state set: `, race);
    }
    
    // Getters
    public get events() {
        return this._eventEmitter;
    }

    public get raceId() {
        return this._race.raceId;
    }

    public get contestants() {
        return this._race.contestants;
    }

    public get raceScheduledStartUnixTime() {
        return this._race.raceScheduledStartUnixTime;
    }

    public get raceState() {
        return this._race.raceState;
    }

    public get scheduledRace() {
        return this._race;
    }

    // Setters
    public setRaceId(raceId: ScheduledRace['raceId']) {
        this._race.raceId = raceId;
        console.log(`☀️ Race State: Race Id set to: ${raceId}.`);
        this._eventEmitter.emit(RaceScheduleEntryEvents.RaceIdChanged, raceId);
    }

    public setContestants(contestants: ScheduledRace['contestants']) {
        this._race.contestants = contestants;
        console.log(`☀️ Race State: Race Contetants set to: ${contestants}.`);
        this._eventEmitter.emit(RaceScheduleEntryEvents.ContestantsChanged, contestants);
    }

    public setRaceDateTime(raceDateTime: ScheduledRace['raceScheduledStartUnixTime']) {
        this._race.raceScheduledStartUnixTime = raceDateTime;
        console.log(`☀️ Race State: Race Date Time set to: ${raceDateTime}.`);
        this._eventEmitter.emit(RaceScheduleEntryEvents.RaceDateTimeChanged, raceDateTime);
    }

    public setRaceState(raceState: ScheduledRace['raceState']) {
        this._race.raceState = raceState;
        console.log(`☀️ Race State: Race State set to: ${raceState}.`);
        this._eventEmitter.emit(RaceScheduleEntryEvents.RaceStateChanged, raceState);
    }
}