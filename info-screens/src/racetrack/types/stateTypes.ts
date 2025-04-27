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

export type RaceSchedule = Record<string, Race>;

export type ActiveContestant = {
    contestant : Contestant,
    place : number
    lapCount : number
    fastestLap : string
}

export type ActiveRace = {
    contestants : ActiveContestant[],
    raceState : RaceState,
    isHazard: boolean,
    isFinishing: boolean,
    timeLeft : string
} & Pick<Race, 'raceId' | 'raceDateTime'>;