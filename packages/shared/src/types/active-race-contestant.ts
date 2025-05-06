import { ActiveRaceContestant } from "./stateTypes";

export enum ActiveRaceContestantEvents {
    ContestantPlaceChanged = 'ContestantPlaceChanged',
    ContestantLapCountChanged = 'ContestantLapCountChanged',
    ContestantFastestLapChanged = 'ContestantFastestLapChanged',
    ContestantLapStopwatchTick = 'ContestantLapStopwatchTick',
}

//External Events
export type ActiveContestantPlaceChanged = {
    type : ActiveRaceContestantEvents.ContestantPlaceChanged,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],   
    place : ActiveRaceContestant['place'],
};

export type ActiveContestantLapCountChanged = {
    type : ActiveRaceContestantEvents.ContestantLapCountChanged,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],
    lapCount : ActiveRaceContestant['lapCount'],
}

export type ActiveContestantFastestLapChanged = {
    type : ActiveRaceContestantEvents.ContestantFastestLapChanged,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],
    fastestLap : ActiveRaceContestant['fastestLap'],
}

export type ActiveContestantLapStopwatchTick = {
    type : ActiveRaceContestantEvents.ContestantLapStopwatchTick,
    contestantId : ActiveRaceContestant['contestant']['contestantId'],
    stopwatchTime : ActiveRaceContestant['lapStopwatchTime'],
}