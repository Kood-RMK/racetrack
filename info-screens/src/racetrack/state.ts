export type Contestant = {
 name : String,
 racecar : Number
}

export type RaceState = 'completed' | 'active' | 'canceled' | 'finishing' | 'pending' | 'hazard' | 'danger' | 'safe';

export type Race = {
    contestants : Contestant[],
    raceTime : String,
}

export type ActiveContestant = {
    contestant : Contestant,
    place : Number
    lapCount : Number
    fastestLap : string
}

export type ActiveRace = {
    contestants : ActiveContestant[],
    raceState : RaceState,
    isHazard : Boolean,
    isDanger : Boolean,
    timeLeft : String
}