import { RaceState } from "./stateTypes";

// Message Types
export enum RaceControlEvents {
    RaceStateChanged = 'raceStateChanged',
    RaceHazardChanged = 'raceHazardChanged',
    RaceIsFinishingChanged = 'raceIsFinishingChanged',
    RaceInitialState = 'raceInitialState',
}

export enum RaceControlCommands {
    ChangeRaceState = 'changeRaceState',
    ChangeRaceHazard = 'changeRaceHazard',
    ChangeRaceIsFinishing = 'changeRaceIsFinishing',
}


// Commands
export type ChangeActiveRaceState = {
    type : RaceControlCommands.ChangeRaceState,
    raceId : string,
    newState : RaceState,
};

export type ChangeActiveRaceHazard = {
    type : RaceControlCommands.ChangeRaceHazard,
    raceId : string,
    isHazard : boolean,
}
  
export type ChangeActiveRaceIsFinishing = {
    type : RaceControlCommands.ChangeRaceIsFinishing,
    raceId : string,
    isFinishing : boolean,
}