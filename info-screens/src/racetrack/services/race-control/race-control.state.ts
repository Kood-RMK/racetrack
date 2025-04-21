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

export class ActiveRaceState {
    private _activeRace: ActiveRace;

    constructor() {
        this._activeRace = {
            contestants: [],
            raceState: 'pending',
            isHazard: false,
            isFinishing: false,
            timeLeft: '00:00'
        };
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
    }

    public setRaceState(raceState: ActiveRace['raceState']) {
        this._activeRace.raceState = raceState;
    }

    public setIsHazard(isHazard: ActiveRace['isHazard']) {
        this._activeRace.isHazard = isHazard;
    }

    public setIsFinishing(isFinishing: ActiveRace['isFinishing']) {
        this._activeRace.isFinishing = isFinishing;
    }

    public setTimeLeft(timeLeft: ActiveRace['timeLeft']) {
        this._activeRace.timeLeft = timeLeft;
    }
}