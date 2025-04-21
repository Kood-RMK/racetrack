import { Race } from "types/stateTypes";

// Get for all races in race schedule
export class RaceScheduleState {
    private raceScheduleState: RaceState[];

    constructor() {
        this.raceScheduleState = []; 
    }

    getRaceScheduleState() {
        return this.raceScheduleState;
    }

    setRaceScheduleState(races: RaceState[]){
        this.raceScheduleState = races;
    }
}

// One race
export class RaceState {
    private race: Race;

    constructor() {
        this.race = {
            raceId: '',
            contestants: [],
            raceDateTime: '',
            raceState: 'pending'
        };
    }

    getRaceId() {
        return this.race.raceId;
    }

    getContestants() {
        return this.race.contestants;
    }

    getRaceDateTime() {
        return this.race.raceDateTime;
    }

    getRaceState() {
        return this.race.raceState;
    }

    getRace() {
        return this.race;
    }


    setRaceId(raceId: Race['raceId']) {
        this.race.raceId = raceId;
    }

    setContestants(contestants: Race['contestants']) {
        this.race.contestants = contestants;
    }

    setRaceDateTime(raceDateTime: Race['raceDateTime']) {
        this.race.raceDateTime = raceDateTime;
    }

    setRaceState(raceState: Race['raceState']) {
        this.race.raceState = raceState;
    }
}



