import { ActiveRace, ActiveRaceId, RaceState } from "./stateTypes";

export enum ActiveRaceEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceIsFinishingChanged = 'raceIsFinishingChanged',
    RaceTimeLeftChanged = 'raceTimeLeftChanged',
    RaceInitialState = 'raceInitialState',
}

export enum ActiveRaceCommands {
    RequestActiveRaceState = 'requestActiveRaceState',
}

//External Events
export type ActiveRaceStateChanged = {
    type : ActiveRaceEvents.RaceStateChanged,
    newState : RaceState,
    raceId : ActiveRaceId,  // Saadame Id ka välja
};

export type ActiveRaceHazardChanged = {
    type : ActiveRaceEvents.RaceHazardChanged,
    isHazard : boolean,
}

export type ActiveRaceIsFinishingChanged = {
    type : ActiveRaceEvents.RaceIsFinishingChanged,
    isFinishing : boolean,
}

export type ActiveRaceTimeLeftChanged = {
    type : ActiveRaceEvents.RaceTimeLeftChanged,
    timeLeft : number,
}

export type ActiveRaceInitialState = {
    type : ActiveRaceEvents.RaceInitialState,
    race : ActiveRace,
}