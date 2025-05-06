import { ActiveRaceState, ActiveRaceStateEvents } from "./active-race.state";
import { Namespace, Socket } from "socket.io";
import { ActiveRaceContestantStateEvents } from "./contestant/active-race-contestant.state";
import { Logger } from "pino";
import { ActiveRace, ActiveRaceEvents, ActiveRaceHazardChanged, ActiveRaceInitialState, ActiveRaceIsFinishingChanged, ActiveRaceStateChanged, ActiveRaceTimeLeftChanged, RaceContestantId, RaceState, RacetrackEvent } from "racetrack-shared/types";
import { ActiveRaceContestantHandler } from "./contestant/active-race-contestant.handler";
import { Stopwatch, StopwatchEvents } from "@racetrack/utils/stopwatch";


type ActiveContestantHandlers = Record<RaceContestantId, ActiveRaceContestantHandler>;

export class ActiveRaceHandler {

    private readonly _activeRaceState: ActiveRaceState;
    private readonly _activeRaceRoom : string;
    private readonly _socketNamespace : Namespace;
    private readonly logger : Logger;
    private readonly _stopwatch : Stopwatch;

    private readonly _activeRaceContestantHandlers: ActiveContestantHandlers;

    public get activeRaceState() {
        return this._activeRaceState;
    }

    public get activeRaceContestants() {
        return Object.entries (this._activeRaceContestantHandlers).map(([contestantId, contestantHandler]) => {return contestantHandler});
    }

    public getActiveRaceContestantById(contestantId: RaceContestantId) {
        return this._activeRaceContestantHandlers[contestantId];
    }

    public get activeRaceRoom() {
        return this._activeRaceRoom;
    }

    private onConnection : (client: Socket) => void;
    private onRaceStateChanged : (newState: ActiveRace['raceState']) => void;
    private onRaceHazardChanged : (isHazard: ActiveRace['isHazard']) => void;
    private onRaceIsFinishingChanged : (isFinishing: ActiveRace['isFinishing']) => void;
    private onTimeLeftChanged : (timeLeft: ActiveRace['timeLeft']) => void;

    private refreshContestantPlacement(contestantHandlers : ActiveContestantHandlers) {
        const contestants = Object.entries(contestantHandlers).map(([contestantId, contestantHandler]) => {
            return contestantHandler.contestantState;
        });

        // Sort the contestants by fastest lap time.
        contestants.sort((a, b) => {

            console.log(a.fastestLap, b.fastestLap);
            if (!a.fastestLap) {
                return 1;
            }
            if (!b.fastestLap) {
                return -1;
            }

            return a.fastestLap - b.fastestLap;
        });

        // Update the placement of each contestant.
        contestants.forEach((contestant, index) => {
            contestant.setPlace(index + 1);
        });
    }

    constructor(activeRaceState : ActiveRaceState, socketNamespace : Namespace, baseLogger : Logger) {
        this.logger = baseLogger.child(
            {
                handlerName: this.constructor.name
            }
        );

        // Create a stopwatch to track the time left.
        this._stopwatch = new Stopwatch(Number (process.env.STOPWATCH_TICK));
        this._stopwatch.events.on(StopwatchEvents.onStopwatchTick, (elapsed) => {
            this._activeRaceState.setTimeLeft(this._activeRaceState.timeLeft - elapsed);
            this._stopwatch.reset();
        });

        this._activeRaceState = activeRaceState;

        // Create a handler for each active contestant.
        this._activeRaceContestantHandlers = this._activeRaceState.contestants.reduce((contestantHandlers, contestantState) => {
            const contestantHandler  = new ActiveRaceContestantHandler(contestantState, this._activeRaceState, socketNamespace, baseLogger);

            // When a contestant crosses the line, we need to recalculate the placement of all contestants.
            contestantHandler.contestantState.events.on(ActiveRaceContestantStateEvents.ContestantFastestLapChanged, (contestant, preValue) => {
                this.refreshContestantPlacement(this._activeRaceContestantHandlers);
            });

            contestantHandlers[contestantState.contestant.contestantId] = contestantHandler;

            return contestantHandlers;
        }, {} as ActiveContestantHandlers);

        // Create a room for the active race.
        this._activeRaceRoom = `active-race-${this._activeRaceState.raceId}`;
        this._socketNamespace = socketNamespace;

        this.onConnection = (client : Socket) => {
            this.logger.info(`New Connection! Client: ${client.id}`);

            const initialStateMessage : RacetrackEvent<ActiveRaceInitialState> = {
                message : {
                    type: ActiveRaceEvents.RaceInitialState,
                    race : this.activeRaceState.activeRace,
                }
            }

            client.emit(ActiveRaceEvents.RaceInitialState, initialStateMessage);
        }

        this.onRaceStateChanged = (newState: ActiveRace['raceState']) => {

            if (newState === 'active') {
                this._stopwatch.start();
            } else {
                this._stopwatch.stop();
            }

            try {
                const raceStateChangedMessage : RacetrackEvent<ActiveRaceStateChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceStateChanged,
                        newState: newState,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceStateChanged, raceStateChangedMessage);

                this.logger.info(raceStateChangedMessage, `Race state change broadcasted to: ${this._activeRaceRoom}.`);

            } catch (error) {
                this.logger.error(error);
            }
        }

        this.onRaceHazardChanged = (isHazard: ActiveRace['isHazard']) => {
            try {
                const raceHazardChangedMessage : RacetrackEvent<ActiveRaceHazardChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceHazardChanged,
                        isHazard: isHazard,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceHazardChanged, raceHazardChangedMessage);


                this.logger.info(raceHazardChangedMessage, `Race flag change broadcasted to: ${this._activeRaceRoom}.`);
            } catch (error) {
                this.logger.error(error);
            }
        }

        this.onRaceIsFinishingChanged = (isFinishing: ActiveRace['isFinishing']) => {
            try {
                const raceIsFinishingChangedMessage : RacetrackEvent<ActiveRaceIsFinishingChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceIsFinishingChanged,
                        isFinishing: isFinishing,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceIsFinishingChanged, raceIsFinishingChangedMessage);


                this.logger.info(raceIsFinishingChangedMessage, `Race flag change broadcasted to: ${this._activeRaceRoom}.`);
            } catch (error) {
                this.logger.error(error);
            }
        }

        this.onTimeLeftChanged = (timeLeft: ActiveRace['timeLeft']) => {
            try {
                const timeLeftChangedMessage : RacetrackEvent<ActiveRaceTimeLeftChanged> = {
                    message : {
                        type: ActiveRaceEvents.RaceTimeLeftChanged,
                        timeLeft: timeLeft,
                    }
                }

                this._socketNamespace
                    .to(this._activeRaceRoom)
                    .emit(ActiveRaceEvents.RaceTimeLeftChanged, timeLeftChangedMessage);

            } catch (error) {
                this.logger.error(error);
            }
        }
    }

    public initialize() {
        const activeRaceStateEvents = this._activeRaceState.events;

        Object.entries(this._activeRaceContestantHandlers).forEach(([contestantId, contestantHandler]) => {
            contestantHandler.initialize();
        });

        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceStateChanged, this.onRaceStateChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceHazardChanged, this.onRaceHazardChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.RaceIsFinishingChanged, this.onRaceIsFinishingChanged);
        activeRaceStateEvents.on(ActiveRaceStateEvents.TimeLeftChanged, this.onTimeLeftChanged);


        this._socketNamespace.on("connection", this.onConnection);

    
        if (this._activeRaceState.raceState === 'active') {
            this._stopwatch.start();
        }

        this.logger.info(`Initialized!`)
    }

    public destroy() {
        const activeRaceStateEvents = this._activeRaceState.events;

        activeRaceStateEvents.off(ActiveRaceStateEvents.RaceStateChanged, this.onRaceStateChanged);
        activeRaceStateEvents.off(ActiveRaceStateEvents.RaceHazardChanged, this.onRaceHazardChanged);
        activeRaceStateEvents.off(ActiveRaceStateEvents.RaceIsFinishingChanged, this.onRaceIsFinishingChanged);
        activeRaceStateEvents.off(ActiveRaceStateEvents.TimeLeftChanged, this.onTimeLeftChanged);

        Object.entries(this._activeRaceContestantHandlers).forEach(([contestantId, contestantHandler]) => {
            contestantHandler.destroy();
        });

        this._socketNamespace.off("connection", this.onConnection);
        this.logger.info(`Destroyed!`);
    }
}