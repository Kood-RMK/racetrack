import { ActiveRace } from "types/stateTypes";


export class RaceControlState {
    private activeRaceState: ActiveRaceState;

    constructor() {
        this.activeRaceState = new ActiveRaceState();
    }

    getActiveRaceState() {
        return this.activeRaceState;
    }
}

export class ActiveRaceState {
    private activeRace: ActiveRace;

    constructor() {
        this.activeRace = {
            contestants: [],
            raceState: 'pending',
            isHazard: false,
            isFinishing: false,
            timeLeft: '00:00'
        };
    }

    getContestants() {
        return this.activeRace.contestants;
    }

    getRaceState() {
        return this.activeRace.raceState;
    }

    getIsHazard() {
        return this.activeRace.isHazard;
    }

    getIsFinishing() {
        return this.activeRace.isFinishing;
    }

    getTimeLeft() {
        return this.activeRace.timeLeft;
    }

    getActiveRace() {
        return this.activeRace;
    }

    setContestants(contestants: ActiveRace['contestants']) {
        this.activeRace.contestants = contestants;
    }

    setRaceState(raceState: ActiveRace['raceState']) {
        this.activeRace.raceState = raceState;
    }

    setIsHazard(isHazard: ActiveRace['isHazard']) {
        this.activeRace.isHazard = isHazard;
    }

    setIsFinishing(isFinishing: ActiveRace['isFinishing']) {
        this.activeRace.isFinishing = isFinishing;
    }

    setTimeLeft(timeLeft: ActiveRace['timeLeft']) {
        this.activeRace.timeLeft = timeLeft;
    }
}