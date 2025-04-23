import EventEmitter from "events";
import { Race } from "types/stateTypes";

// Get for all races in race schedule
export class RaceScheduleState {
    private raceScheduleState: RaceState[] = [];


    public get getRaceScheduleState(): RaceState[] {
        return this.raceScheduleState;
    }

    public setRaceScheduleState(races: RaceState[]): void {
        this.raceScheduleState = races.map(race => {
            const raceState = new RaceState();
            raceState.setRaceId(race.getRaceId);
            raceState.setContestants(race.getContestants);
            raceState.setRaceDateTime(race.getRaceDateTime);
            raceState.setRaceState(race.getRaceState);
            return raceState;
        });
        console.log(`☀️ Race Schedule updated with ${races.length} races.`);
    }
}


export enum RaceScheduleEvents {
    RaceIdChanged = 'onRaceIdChanged',
    ContestantsChanged = 'onContestantsChanged',
    raceDateTimeChanged = 'onRaceDateTimeChanged',
    RaceStateChanged = 'onRaceStateChanged',
}

export interface RaceScheduleCallbacks {
    [RaceScheduleEvents.RaceIdChanged] : (raceId: Race['raceId']) => void;
    [RaceScheduleEvents.ContestantsChanged] : (contestants: Race['contestants']) => void;
    [RaceScheduleEvents.raceDateTimeChanged] : (raceDateTime: Race['raceDateTime']) => void;
    [RaceScheduleEvents.RaceStateChanged] : (newState: Race['raceState']) => void;
}

export class RaceScheduleEventEmitter extends EventEmitter {
    off<KM extends keyof RaceScheduleCallbacks>(event: KM, listener: RaceScheduleCallbacks[KM]): this {
        return super.off(event, listener);
    }

    on<KM extends keyof RaceScheduleCallbacks>(event: KM, listener: RaceScheduleCallbacks[KM]): this {
        return super.on(event, listener);
    }

    emit<KM extends keyof RaceScheduleCallbacks>(event: KM, ...args: Parameters<RaceScheduleCallbacks[KM]>): boolean {
        return super.emit(event, ...args);
    }
}

// One race
export class RaceState {
    private _race: Race;
    private _eventEmitter = new RaceScheduleEventEmitter();

    constructor() {
        this._race = {
            raceId: '',
            contestants: [],
            raceDateTime: '',
            raceState: 'pending'
        };
    }

    
    // Getters
    public get events() {
        return this._eventEmitter;
    }

    public get getRaceId() {
        return this._race.raceId;
    }

    public get getContestants() {
        return this._race.contestants;
    }

    public get getRaceDateTime() {
        return this._race.raceDateTime;
    }

    public get getRaceState() {
        return this._race.raceState;
    }

    public get getRace() {
        return this._race;
    }

    // Setters
    public setRaceId(raceId: Race['raceId']) {
        this._race.raceId = raceId;
        console.log(`☀️ Race Service: Race Id set to: ${raceId}.`);
        this._eventEmitter.emit(RaceScheduleEvents.RaceIdChanged, raceId);
    }

    public setContestants(contestants: Race['contestants']) {
        this._race.contestants = contestants;
        console.log(`☀️ Race Service: Race Contetants set to: ${contestants}.`);
        this._eventEmitter.emit(RaceScheduleEvents.ContestantsChanged, contestants);
    }

    public setRaceDateTime(raceDateTime: Race['raceDateTime']) {
        this._race.raceDateTime = raceDateTime;
        console.log(`☀️ Race Service: Race Date Time set to: ${raceDateTime}.`);
        this._eventEmitter.emit(RaceScheduleEvents.raceDateTimeChanged, raceDateTime);
    }

    public setRaceState(raceState: Race['raceState']) {
        this._race.raceState = raceState;
        console.log(`☀️ Race Service: Race State set to: ${raceState}.`);
        this._eventEmitter.emit(RaceScheduleEvents.RaceStateChanged, raceState);
    }
}



