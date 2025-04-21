export type Contestant = {
 name : string,
 racecar : number
}

export type RaceState = 'completed' | 'active' | 'canceled' | 'pending' | 'paused' ;

export type Race = {
    raceId : string,
    contestants : Contestant[],
    raceDateTime : string, //Unix Timestamp.
    raceState : RaceState,
}

export type RaceSchedule = Race[];

export type ActiveContestant = {
    contestant : Contestant,
    place : Number
    lapCount : Number
    fastestLap : string
}

export type ActiveRace = {
    contestants : ActiveContestant[],
    raceState : RaceState,
    isHazard: boolean,
    isFinishing: boolean,
    timeLeft : string
}