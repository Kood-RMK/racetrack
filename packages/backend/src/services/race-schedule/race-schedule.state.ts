
import EventEmitter from "events";
import { RaceState, ScheduledRace } from "racetrack-shared/types";

export enum RaceScheduleStateEvents {
    RaceScheduleChanged = 'onRaceScheduleChanged',
    RaceAdded = 'onRaceAdded',
    RaceDeleted = 'onRaceDeleted',
    RaceModified = 'onRaceModified',
}

export interface RaceScheduleStateCallbacks {
    [RaceScheduleStateEvents.RaceScheduleChanged]: (raceSchedule : RaceScheduleState) => void;
    [RaceScheduleStateEvents.RaceAdded]: (entry: RaceScheduleEntryState) => void;
    [RaceScheduleStateEvents.RaceDeleted]: (id: ScheduledRace['raceId']) => void;
    [RaceScheduleStateEvents.RaceModified]: (id: ScheduledRace['raceId'], entry: RaceScheduleEntryState) => void;
}

export class RaceScheduleEventEmitter extends EventEmitter {
    off<K extends keyof RaceScheduleStateCallbacks>(event: K, listener: RaceScheduleStateCallbacks[K]): this {
        return super.off(event, listener);
    }

    on<K extends keyof RaceScheduleStateCallbacks>(event: K, listener: RaceScheduleStateCallbacks[K]): this {
        return super.on(event, listener);
    }

    emit<K extends keyof RaceScheduleStateCallbacks>(event: K, ...args: Parameters<RaceScheduleStateCallbacks[K]>): boolean {
        return super.emit(event, ...args);
    }
}

export type RaceScheduleStateEntries = Record<ScheduledRace['raceId'], RaceScheduleEntryState>

// Get for all races in race schedule
export class RaceScheduleState {
    private _raceScheduleStateEntries: RaceScheduleStateEntries = {};
    private _eventEmitter = new RaceScheduleEventEmitter();

    public get raceScheduleEntries(): RaceScheduleStateEntries {
        return this._raceScheduleStateEntries;
    }

    public get events() {
        return this._eventEmitter;
    }

    public getRaceById(id: ScheduledRace['raceId']) {
        return this._raceScheduleStateEntries[id];
    }

    public addRace(entry: RaceScheduleEntryState) {

        const { contestants } = entry;

        // Check to ensure there are no duplicate names in the new race
        const duplicates = contestants
            .map(contestant => contestant.name.trim().toLowerCase()) // Create a new array 'duplicates' 
            .reduce((accumulatorArray, name, _, arr) => {
                if (arr.indexOf(name) !== arr.lastIndexOf(name) && !accumulatorArray.includes(name)) {
                    accumulatorArray.push(name);
                }
                return accumulatorArray;
            }, [] as string[]);

        if (duplicates.length > 0) {
            throw new Error(`❌ Duplicate contestant names found: ${duplicates.join(', ')}`);
        }

        for (const value of Object.values(this._raceScheduleStateEntries)) {

            if (value.raceScheduledStartTimeSlot === entry.raceScheduledStartTimeSlot) {
                throw new Error(`❌ A race already exists at this time: ${entry.raceScheduledStartTimeSlot}`);
            }
        }

        this._raceScheduleStateEntries[entry.raceId] = entry;
        this.events.emit(RaceScheduleStateEvents.RaceScheduleChanged, this);
        this.events.emit(RaceScheduleStateEvents.RaceAdded, entry);
        return entry;
    }

    public deleteRace(id: ScheduledRace['raceId']) {
        delete this._raceScheduleStateEntries[id];
        this.events.emit(RaceScheduleStateEvents.RaceScheduleChanged, this);
        this.events.emit(RaceScheduleStateEvents.RaceDeleted, id);
        return id;
    }

    public modifyRace(raceId: ScheduledRace['raceId'], entry: RaceScheduleEntryState) {


        if (!(raceId in this._raceScheduleStateEntries)) {
            throw new Error(`A race with id: ${raceId} does not exist in the schedule and therefore cannot be modified.`);
        }

        if (entry.raceState !== RaceState.Pending) {
            throw new Error("Only races in 'pending' state can be modified.");
        }


        for (const value of Object.values(this._raceScheduleStateEntries)) {

            if (value.raceScheduledStartTimeSlot === entry.raceScheduledStartTimeSlot && value.raceId !== raceId) {
                throw new Error(`❌ A race already exists at this time: ${entry.raceScheduledStartTimeSlot}`);
            }
        }


        this._raceScheduleStateEntries[raceId] = entry;
        this.events.emit(RaceScheduleStateEvents.RaceScheduleChanged, this);
        this.events.emit(RaceScheduleStateEvents.RaceModified, raceId, entry);
        return entry;
    }

    public get sortedSchedule() {
        function parseTimeslot(timeslot: string): number {
            const [start] = timeslot.split(' - ');
            const [hours, minutes] = start.split(':').map(Number);
            return hours * 60 + minutes;
        }

        return Object.values(this._raceScheduleStateEntries)
        .filter(race => race.raceState === 'pending')
        .sort((a, b) =>
            parseTimeslot(a.raceScheduledStartTimeSlot) - parseTimeslot(b.raceScheduledStartTimeSlot)
        );
    }
}

// export enum RaceScheduleEntryEvents {
//     RaceIdChanged = 'onRaceIdChanged',
//     ContestantsChanged = 'onContestantsChanged',
//     RaceDateTimeChanged = 'onRaceDateTimeChanged',
//     RaceStateChanged = 'onRaceStateChanged',
// }

// export interface RaceScheduleEntryCallbacks {
//     [RaceScheduleEntryEvents.RaceIdChanged]: (raceId: ScheduledRace['raceId']) => void;
//     [RaceScheduleEntryEvents.ContestantsChanged]: (contestants: ScheduledRace['contestants']) => void;
//     [RaceScheduleEntryEvents.RaceDateTimeChanged]: (raceDateTime: ScheduledRace['raceScheduledStartTimeSlot']) => void;
//     [RaceScheduleEntryEvents.RaceStateChanged]: (newState: ScheduledRace['raceState']) => void;
// }

// export class RaceScheduleEntryEventEmitter extends EventEmitter {
//     off<KM extends keyof RaceScheduleEntryCallbacks>(event: KM, listener: RaceScheduleEntryCallbacks[KM]): this {
//         return super.off(event, listener);
//     }

//     on<KM extends keyof RaceScheduleEntryCallbacks>(event: KM, listener: RaceScheduleEntryCallbacks[KM]): this {
//         return super.on(event, listener);
//     }

//     emit<KM extends keyof RaceScheduleEntryCallbacks>(event: KM, ...args: Parameters<RaceScheduleEntryCallbacks[KM]>): boolean {
//         return super.emit(event, ...args);
//     }
// }


export class RaceScheduleEntryState {
    private _race: ScheduledRace;
    // private _eventEmitter = new RaceScheduleEntryEventEmitter();

    constructor(race: ScheduledRace) {
        this._race = race;
        console.log(`☀️ Race State: Initial state set: `, race);
    }

    // Getters
    // public get events() {
    //     return this._eventEmitter;
    // }

    public get raceId() {
        return this._race.raceId;
    }

    public get contestants() {
        return this._race.contestants;
    }

    public get raceScheduledStartTimeSlot() {
        return this._race.raceScheduledStartTimeSlot;
    }

    public get raceState() {
        return this._race.raceState;
    }

    public get scheduledRace() {
        return this._race;
    }

    // Setters
    // public setRaceId(raceId: ScheduledRace['raceId']) {
    //     this._race.raceId = raceId;
    //     console.log(`☀️ Race State: Race Id set to: ${raceId}.`);
    //     this._eventEmitter.emit(RaceScheduleEntryEvents.RaceIdChanged, raceId);
    // }

    // public setContestants(contestants: ScheduledRace['contestants']) {
    //     this._race.contestants = contestants;
    //     console.log(`☀️ Race State: Race Contetants set to: ${contestants}.`);
    //     this._eventEmitter.emit(RaceScheduleEntryEvents.ContestantsChanged, contestants);
    // }

    // public setRaceDateTime(raceDateTime: ScheduledRace['raceScheduledStartTimeSlot']) {
    //     this._race.raceScheduledStartTimeSlot = raceDateTime;
    //     console.log(`☀️ Race State: Race Date Time set to: ${raceDateTime}.`);
    //     this._eventEmitter.emit(RaceScheduleEntryEvents.RaceDateTimeChanged, raceDateTime);
    // }

    // public setRaceState(raceState: ScheduledRace['raceState']) {
    //     this._race.raceState = raceState;
    //     console.log(`☀️ Race State: Race State set to: ${raceState}.`);
    //     this._eventEmitter.emit(RaceScheduleEntryEvents.RaceStateChanged, raceState);
    // }
}