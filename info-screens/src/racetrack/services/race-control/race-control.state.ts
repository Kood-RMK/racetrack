import EventEmitter from "events";
import { ActiveRace } from "types/stateTypes";


export class RaceControlState {
    private activeRaceState: ActiveRaceState;

    constructor() {
        this.activeRaceState = new ActiveRaceState();
    }

    public get getActiveRaceState() {
        return this.activeRaceState;
    }
}



export enum ActiveRaceStateEvents {
    RaceStateChanged = 'onRaceStateChanged',
    RaceHazardChanged = 'onRaceHazardChanged',
    RaceIsFinishingChanged = 'onRaceIsFinishingChanged',
    TimeLeftChanged = 'onTimeLeftChanged',
    ContestantsChanged = 'onContestantsChanged',
}


export interface ActiveRaceStateCallbacks {
    [ActiveRaceStateEvents.RaceStateChanged] : (newState: ActiveRace['raceState']) => void;
    [ActiveRaceStateEvents.RaceHazardChanged] : (isHazard: ActiveRace['isHazard']) => void;
    [ActiveRaceStateEvents.RaceIsFinishingChanged] : (isFinishing: ActiveRace['isFinishing']) => void;
    [ActiveRaceStateEvents.TimeLeftChanged] : (timeLeft: ActiveRace['timeLeft']) => void;
    [ActiveRaceStateEvents.ContestantsChanged] : (contestants: ActiveRace['contestants']) => void;
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
    private _eventEmitter = new ActiveRaceStateEventEmitter();


    constructor() {
        this._activeRace = {
            contestants: [],
            raceState: 'pending',
            isHazard: false,
            isFinishing: false,
            timeLeft: '00:00'
        };
    }

    public get events() {
        return this._eventEmitter;
    }

    public get contestants() {
        return this._activeRace.contestants;
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

    public setContestants(contestants: ActiveRace['contestants']) {
        this._activeRace.contestants = contestants;
        this._eventEmitter.emit(ActiveRaceStateEvents.ContestantsChanged, contestants);
    }

    public setRaceState(raceState: ActiveRace['raceState']) {
        this._activeRace.raceState = raceState;
        console.log(`🔥 Race Control State: Race State set to: ${raceState}.`);
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceStateChanged, raceState);
    }

    public setIsHazard(isHazard: ActiveRace['isHazard']) {
        this._activeRace.isHazard = isHazard;
        console.log(`🔥 Race Control State: Hazard Flag set to: ${isHazard}.`);
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceHazardChanged, isHazard);
    }

    public setIsFinishing(isFinishing: ActiveRace['isFinishing']) {
        this._activeRace.isFinishing = isFinishing;

        console.log(`🔥 Race Control State: Finishing Flag set to: ${isFinishing}.`);
        this._eventEmitter.emit(ActiveRaceStateEvents.RaceIsFinishingChanged, isFinishing);
    }

    public setTimeLeft(timeLeft: ActiveRace['timeLeft']) {
        this._activeRace.timeLeft = timeLeft;
        this._eventEmitter.emit(ActiveRaceStateEvents.TimeLeftChanged, timeLeft);
    }
}