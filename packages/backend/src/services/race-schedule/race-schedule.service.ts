import type { Server as SocketIOServer } from "socket.io";
import { Logger } from "pino";
import { DeleteRace, ModifyRace, RaceScheduleCommands, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackCommand, RacetrackEvent, ScheduleNewRace } from "racetrack-shared/types";
import { RaceScheduleEntryState, RaceScheduleState } from "./race-schedule.state";
import { deleteFromScheduledRace, insertRaceContestant, insertScheduledRace, loadFromDatabase, modifyScheduledRace } from "./race-schedule.persistence";

//Handlers
export class RaceScheduleService {
    private readonly socketIO: SocketIOServer;
    private readonly schedule: RaceScheduleState;
    private readonly logger: Logger;

    public get raceSchedule() {
        //TODO: Sorteeri
        Object.values(this.schedule.raceScheduleEntries);
    }

    constructor(socketIO: SocketIOServer, parentLogger: Logger) {

        this.socketIO = socketIO;
        this.schedule = new RaceScheduleState();
        const logger = parentLogger.child({ serviceName: this.constructor.name })
        this.logger = logger;

        const socketNamespace = this.socketIO.of("/race-schedule");

        // Middleware to check if the user is authenticated.
        socketNamespace.use((socket, next) => {
            next();
        })

        try {
            const dbSchedule = loadFromDatabase();

            for (const race of Object.values(dbSchedule)) {
                const entry = new RaceScheduleEntryState(race);
                this.schedule.addRace(entry);
            }

            this.logger.info("[RaceScheduleService]: Loaded data from database.");
        } catch (err: any) {
            this.logger.error("[RaceScheduleService]: Failed to load races from database.", err.message);
        }

        // Siia jäävad kõik commandid ja kasutavad sealt ülevalt evente
        socketNamespace.on("connection", (client) => {

            this.logger.info(`New client connected!, ID`, client.id);

            const stateMessage: RacetrackEvent<RaceScheduleInitialState> = {
                message: {
                    type: RaceScheduleEvents.RaceScheduleInitialState,
                    schedule: this.raceSchedule
                }
            }

            client.emit(RaceScheduleEvents.RaceScheduleInitialState, stateMessage)

            // New Race 
            client.on(RaceScheduleCommands.ScheduleNewRace, (command: RacetrackCommand<ScheduleNewRace>) => {

                // logging 
                this.logger.info("📨 Received ScheduleNewRace command", command);
                console.log("📦 Race data received from client:", command.message?.data?.race);

                try {

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const newData = command.message.data;
                    const newRace = newData.race;
                    const { contestants, raceScheduledStartTimeSlot: raceDateTime } = newRace

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

                    // Check that there are no races with the same timeSlot
                    const existingRaces = this.schedule.raceScheduleEntries;

                    let timeslotTaken = false;

                    for (const value of Object.values(existingRaces)) {

                        if (value.raceScheduledStartTimeSlot === newData.race.raceScheduledStartTimeSlot) {
                            timeslotTaken = true;
                        }
                    }

                    if (timeslotTaken) {
                        throw new Error(`❌ A race already exists at this time: ${raceDateTime}`);
                    }

                    // When checks are performed and there were no conflicts, add the new race to the schedule
                    // ingredients (newRace) + recipe (RaceScheduleEntry) = cake (newRaceState)
                    const newRaceState = new RaceScheduleEntryState(newRace);

                    // Call addRace method from .state to add cake to schedule
                    this.schedule.addRace(newRaceState);

                    // TODO: I' think we'll need to sort the races according to Timeslots in the schedule before i emit the updated schedule

                    //emit updated schedule
                    const updateMessage: RacetrackEvent<RaceScheduleUpdated> = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleUpdated,
                            schedule: this.raceSchedule
                        }
                    };

                    socketNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);

                    // ✅ Add to database AFTER emitting
                    const insertedRace = newRaceState.scheduledRace;

                    insertScheduledRace({
                        raceId: insertedRace.raceId,
                        raceScheduledStartTimeSlot: insertedRace.raceScheduledStartTimeSlot,
                        raceState: insertedRace.raceState,
                        isHazard: false,
                        isFinishing: false,
                        timeLeft: 0
                    });

                    // ✅ Insert contestants into database
                    for (const contestant of contestants) {
                        insertRaceContestant({
                            raceId: insertedRace.raceId,
                            contestantId: contestant.contestantId,
                            name: contestant.name,
                            racecarNumber: contestant.racecarNumber
                        });
                    }

                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.ScheduleNewRace} command:`, error);
                }
            })

            // Delete Race
            client.on(RaceScheduleCommands.DeleteRace, (command: RacetrackCommand<DeleteRace>) => {

                try {

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    // Determine the race ID to remove
                    const idToRemove = command.message.data.raceId;

                    // Delete the race
                    this.schedule.deleteRace(idToRemove);
                    console.log("🗑️ Race deleted:", idToRemove);

                    //emit updated schedule
                    const updateMessage: RacetrackEvent<RaceScheduleUpdated> = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleUpdated,
                            schedule: this.raceSchedule
                        }
                    };

                    socketNamespace.
                    emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);

                    // Remove from database
                    deleteFromScheduledRace({
                        raceId: idToRemove,
                    });

                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.DeleteRace} command:`, error);
                }
            })

            // Modify Race
            client.on(RaceScheduleCommands.ModifyRace, (command: RacetrackCommand<ModifyRace>) => {

                try {

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const raceModificationData = command.message.data;
                    const updatedRace = raceModificationData.updates;
                    const { contestants, raceScheduledStartTimeSlot: raceDateTime, raceId: raceId, raceState } = updatedRace;

                    if (!raceId) {
                        throw new Error("No raceID");
                    }

                    // Check that the race exists in the schedule
                    let existingSchedule = this.schedule.raceScheduleEntries;

                    if (!(raceId in existingSchedule)) {
                        throw new Error(`A race with id: ${raceId} does not exist in the schedule and therefore cannot be modified.`);
                    }

                    //Check that the race's current state is pending - actually ui button for modfying shouldn't exist for a race in any other state
                    if (raceState !== "pending") {
                        throw new Error("Only races in 'pending' state can be modified.");
                    }

                    // check for timeslot conflict
                    let timeslotTaken = false;

                    for (const [id, value] of Object.entries(existingSchedule)) {

                        if (id === raceId) continue; // ⛔ Skip checking against itself

                        console.log(value.raceScheduledStartTimeSlot);

                        if (value.raceScheduledStartTimeSlot === raceDateTime) {
                            timeslotTaken = true;
                        }
                    }

                    if (timeslotTaken) {
                        throw new Error(`❌ A race already exists at this time: ${raceDateTime}`);
                    }

                    //overwrite the race in schedule
                    // Create a new RaceScheduleEntry with the updated race data
                    const updatedRaceEntry = new RaceScheduleEntryState(updatedRace);

                    // Overwrite the existing race entry in the schedule
                    this.schedule.addRace(updatedRaceEntry);

                    console.log(`✅ Race with ID ${raceId} modified successfully.`);

                    //emit updated schedule
                    const updateMessage: RacetrackEvent<RaceScheduleUpdated> = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleUpdated,
                            schedule: this.raceSchedule
                        }
                    };

                    socketNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);

                    modifyScheduledRace({
                        raceId,
                        raceScheduledStartTimeSlot: updatedRace.raceScheduledStartTimeSlot,
                        raceState,
                    });

                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.ModifyRace} command:`, error);
                }
            })
        })
    }
}



//NAMESPACE : /race-schedule

// Now race is a full copy of data

//EVENTS (server --> frontend)
//raceScheduleUpdated (Frontendis Listen To Yourself põhimõttega (frontend client#1 muudatus --> muudatus backendis --> muudatus client#1...kõik teised kuulajad.))
//raceScheduleState (same as above, but only for new clients)

//COMMANDS (frontend --> server)
//getRaceSchedule -> raceScheduleState 
//scheduleRace

//deleteRace
//updateRace

//Reminders
// 1. Check timeslot overlaps.
// 2. Avoid duplicate drivers.
// 3. Make types for events!!!
// 4. wrap in message types
// 5. sort by timeslot

