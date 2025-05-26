import { ActiveRaceContestantState, ActiveRaceContestantStateCallbacks, ActiveRaceContestantStateEvents } from "./active-race-contestant.state";
import { Namespace } from "socket.io";
import { ActiveRaceState, ActiveRaceStateEvents } from "../active-race.state";
import { Stopwatch, StopwatchEvents } from "../../../utils/stopwatch";
import { ActiveContestantFastestLapChanged, ActiveContestantLapCountChanged, ActiveContestantLapStopwatchTick, ActiveContestantPlaceChanged, ActiveRaceContestant, ActiveRaceContestantEvents, RacetrackEvent } from "racetrack-shared/types";
import { Logger } from "pino";

export class ActiveRaceContestantHandler {

    private readonly _contestantState: ActiveRaceContestantState;
    private readonly _socketNamespace: Namespace;
    private readonly _activeRaceState: ActiveRaceState;
    private readonly _stopwatch : Stopwatch;
    private readonly logger : Logger;

    private onContestantPlaceChanged : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantPlaceChanged];
    private onContestantLapCountChanged : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantLapCountChanged];
    private onContestantFastestLapChanged : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantFastestLapChanged];
    private onContestantLapStopwatchTick : ActiveRaceContestantStateCallbacks[ActiveRaceContestantStateEvents.ContestantLapStopwatchTime];


    public get contestantState() {
        return this._contestantState;
    }

    public onLineCrossed() {

        try {

            if (this._activeRaceState.raceState !== 'active') {
                this.logger.error(`Race is not active. Cannot handle line crossed event.`);
                return;
            }

            this._contestantState.setLapCount(this._contestantState.lapCount + 1);
            const lapTime = this._contestantState.lapStopwatchTime;

            if (!this._contestantState.fastestLap || lapTime < this._contestantState.fastestLap) {
                this._contestantState.setFastestLap(lapTime);
            }

            const stopwatchTime = this._stopwatch.reset();
            this._contestantState.setLapStopwatchTime(stopwatchTime);
        } catch (error) {
            this.logger.error(`Error processing line crossed event.`, error);
        }

    }

    constructor(contestantState: ActiveRaceContestantState, activeRaceState : ActiveRaceState, socketNamespace : Namespace, parentLogger : Logger) {
        this._contestantState = contestantState;
        this._socketNamespace = socketNamespace;
        this._activeRaceState = activeRaceState;
        this.logger = parentLogger.child({ handlerName : this.constructor.name });


        activeRaceState.events.on(ActiveRaceStateEvents.RaceStateChanged, (newState) => {

            if (newState === 'active') {
                this._stopwatch.start();
            } else {
                this._stopwatch.stop();
            }

        });

        this._stopwatch = new Stopwatch(Number(process.env.STOPWATCH_TICK));
        this._stopwatch.events.on(StopwatchEvents.onStopwatchTick, (elapsed) => {
            this._contestantState.setLapStopwatchTime(elapsed);
        });

        this.onContestantPlaceChanged = (contestant, prevValue) => {

            const activeContestantPlaceChangedMessage : RacetrackEvent<ActiveContestantPlaceChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantPlaceChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    place: contestant.place,
                }
            }

            this._socketNamespace
            .emit(ActiveRaceContestantEvents.ContestantPlaceChanged, activeContestantPlaceChangedMessage);

            this.logger.info(`Broadcasted contestant ${contestant.contestant.contestantId} place change .`)
        }

        this.onContestantLapCountChanged = (contestant, prevValue) => {

            const activeContestantLapCountChangedMessage : RacetrackEvent<ActiveContestantLapCountChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantLapCountChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    lapCount: contestant.lapCount,
                }
            }

            this._socketNamespace
            .emit(ActiveRaceContestantEvents.ContestantLapCountChanged, activeContestantLapCountChangedMessage);


            this.logger.info(`Broadcasted contestant ${contestant.contestant.contestantId} lap count change.`)            
        }

        this.onContestantFastestLapChanged = (contestant, prevValue) => {

            const activeContestantFastestLapChangedMessage : RacetrackEvent<ActiveContestantFastestLapChanged> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantFastestLapChanged,
                    contestantId: this._contestantState.contestant.contestantId,
                    fastestLap: contestant.fastestLap,
                }
            }

            this._socketNamespace
            .emit(ActiveRaceContestantEvents.ContestantFastestLapChanged, activeContestantFastestLapChangedMessage);

            this.logger.info(`Broadcasted contestant ${contestant.contestant.contestantId} fastest lap change.`)            
        }

        this.onContestantLapStopwatchTick = (contestant, prevValue) => {

            const activeContestantLapStopwatchTickMessage : RacetrackEvent<ActiveContestantLapStopwatchTick> = {
                message : {
                    type: ActiveRaceContestantEvents.ContestantLapStopwatchTick,
                    contestantId: this._contestantState.contestant.contestantId,
                    stopwatchTime: contestant.lapStopwatchTime,
                }
            }

            this._socketNamespace
            .emit(ActiveRaceContestantEvents.ContestantLapStopwatchTick, activeContestantLapStopwatchTickMessage);
        }
    }

    public initialize() {
        const activeRaceContestantStateEvents = this._contestantState.events;

        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this.onContestantPlaceChanged);
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this.onContestantLapCountChanged);
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this.onContestantFastestLapChanged);
        activeRaceContestantStateEvents.on(ActiveRaceContestantStateEvents.ContestantLapStopwatchTime, this.onContestantLapStopwatchTick);

        if (this._activeRaceState.raceState === 'active') {
            this._stopwatch.start();
        }

        console.log(`[Active Race Handler (${this._contestantState.contestant.contestantId})]: Initialized!`);
    }

    public destroy() {
        const activeRaceContestantStateEvents = this._contestantState.events;

        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantPlaceChanged, this.onContestantPlaceChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantLapCountChanged, this.onContestantLapCountChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, this.onContestantFastestLapChanged);
        activeRaceContestantStateEvents.off(ActiveRaceContestantStateEvents.ContestantLapStopwatchTime, this.onContestantLapStopwatchTick);
        

        console.log(`[Active Race Handler (${this._contestantState.contestant.contestantId}]: Destroyed!`);
    }
}