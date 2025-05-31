import { RaceState, RaceSchedule, ScheduledRace } from "./stateTypes";

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
    StartRace = 'startRace',
}


// Commands
export type ChangeActiveRaceState = {
    type : RaceControlCommands.ChangeRaceState,
    raceId : string,
    newState : RaceState,
};


export type StartRace = {
    type : RaceControlCommands.StartRace,
    scheduledRace : ScheduledRace
}

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