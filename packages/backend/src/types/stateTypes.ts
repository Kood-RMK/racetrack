import { RaceScheduleEntries } from "@racetrack/services/race-schedule/race-schedule.state";

export type RaceContestantId = string;
export type RaceContestant = {
    contestantId : RaceContestantId,
    name : string,
    racecarNumber : number
}

export type RaceState = 'completed' | 'active' | 'canceled' | 'pending' | 'paused' ;

export type ScheduledRaceId = string;

export type ScheduledRace = {
    raceId : ScheduledRaceId,
    contestants : RaceContestant[],
    raceStartDateTime : string // Unix timestamp.
    raceState : RaceState,
}

// export type RaceSchedule = RaceScheduleEntries;

export type RaceSchedule = Record<ScheduledRaceId, ScheduledRace>;

export type ActiveRaceContestant = {
    contestant : RaceContestant,
    place : number,
    lapCount : number,
    fastestLap : number // in milliseconds.
    lapStopwatchTime : number // in milliseconds.
}

export type ActiveRaceId = string;
export type ActiveRaceContestants = Record<RaceContestantId, ActiveRaceContestant>;
export type ActiveRace = {
    raceId : ActiveRaceId,
    raceStartDateTime : string // Unix timestamp.
    contestants : ActiveRaceContestants,
    raceState : RaceState,
    isHazard: boolean,
    isFinishing: boolean,
    timeLeft : number // in milliseconds.
};