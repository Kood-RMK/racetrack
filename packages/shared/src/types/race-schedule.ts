import { ScheduledRace } from "./stateTypes";


// Message Types
export enum RaceScheduleEvents {
    // NewRaceScheduled = "newRaceScheduled",
    RaceScheduleInitialState = "raceScheduleinitialState",
    RaceScheduleUpdated = "raceScheduleUpdated",
}

export enum RaceScheduleCommands {
    ScheduleNewRace = "scheduleNewRace",
    DeleteRace = "deleteRace",
    ModifyRace = "ModifyRace"
}


export type RaceScheduleEntries = ScheduledRace[];

// Events (sent from server to client)
export type RaceScheduleInitialState = {
    type: RaceScheduleEvents.RaceScheduleInitialState,
    schedule: RaceScheduleEntries,
};

export type RaceScheduleUpdated = {
    type: RaceScheduleEvents.RaceScheduleUpdated,
    schedule: RaceScheduleEntries,
};

// Commands (sent from client to server)
export type ScheduleNewRace = {
    type: RaceScheduleCommands.ScheduleNewRace,
    data: {
        race: ScheduledRace
    }
};

export type DeleteRace = {
    type: RaceScheduleCommands.DeleteRace
    data: {
        raceId: string;
    }
};

export type ModifyRace = {
    type: RaceScheduleCommands.ModifyRace
    data: {
        raceId: string;
        updates: ScheduledRace;
    }
};