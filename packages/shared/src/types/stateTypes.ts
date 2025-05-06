export type RaceContestantId = string;
export type RaceContestant = {
    contestantId : RaceContestantId,
    name : string,
    racecarNumber : number
}

export enum RaceState {
    Completed = 'completed',
    Active = 'active',
    Canceled = 'canceled',
    Pending = 'pending',
    Paused = 'paused',
};

export type ScheduledRaceId = string;

export type ScheduledRace = {
    raceId : ScheduledRaceId,
    contestants : RaceContestant[],
    raceScheduledStartUnixTime : string // Unix timestamp.
    raceState : RaceState,
}


export type RaceSchedule = Record<ScheduledRaceId, ScheduledRace>;

export type ActiveRaceContestant = {
    contestant : RaceContestant,
    place : number,
    lapCount : number,
    fastestLap : number | null // in milliseconds.
    lapStopwatchTime : number // in milliseconds.
}

export type ActiveRaceId = string;
export type ActiveRaceContestants = Record<RaceContestantId, ActiveRaceContestant>;
export type ActiveRace = {
    raceId : ActiveRaceId,
    raceScheduledStartUnixTime : number // Unix timestamp. 
    raceDurationSeconds : number, // in seconds.
    contestants : ActiveRaceContestants,
    raceState : RaceState,
    isHazard: boolean,
    isFinishing: boolean,
    timeLeft : number // in milliseconds.
};