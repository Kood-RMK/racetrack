
// Message Types

import { ActiveRaceId, RaceContestantId } from "./stateTypes"

export enum RaceObserverEvents {
    LineCrossingHandled = "LineCrossingHandled",
}

export enum RaceObserverCommands {
    HandleLineCrossed = "HandleLineCrossed",
}

// Commands
export type HandleLineCrossed = {
    type : RaceObserverCommands.HandleLineCrossed,
    raceId : ActiveRaceId,
    contestantId : RaceContestantId,
}

// Events
export type LineCrossingHandeledEvent = {
    type : RaceObserverEvents.LineCrossingHandled,
    raceId : ActiveRaceId,
    contestantId : RaceContestantId,
}