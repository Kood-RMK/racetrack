export type Contestant = {
 name : string,
 racecar : number
}

export type RaceState = 'completed' | 'active' | 'canceled' | 'pending' ; // If state is 'active' we can also have a flag change triggered by ActiveRace 

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
    isDanger: boolean,
    isFinishing: boolean,
    timeLeft : string
}