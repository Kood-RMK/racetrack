import type { Server as SocketIOServer } from "socket.io";
import { Logger } from "pino";
import { DeleteRace, ModifyRace, RaceScheduleCommands, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackCommand, RacetrackEvent, ScheduleNewRace } from "racetrack-shared/types";
import { RaceScheduleEntryState, RaceScheduleState } from "./race-schedule.state";

//Handlers
export class RaceScheduleService {
    private readonly socketIO: SocketIOServer;
    private readonly schedule: RaceScheduleState;
    private readonly logger: Logger;

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

        // Siia jäävad kõik commandid ja kasutavad sealt ülevalt evente
        socketNamespace.on("connection", (client) => {

            this.logger.info(`New client connected!, ID`, client.id);

            function initializeClientRooms() {
                client.join("raceServiceRoom");
            }

            // Add new client to the raceControlRoom. 
            // TODO: select room based on assigned role.
            initializeClientRooms();

            const stateMessage: RacetrackEvent<RaceScheduleInitialState> = {
                message: {
                    type: RaceScheduleEvents.RaceScheduleInitialState,
                    schedule: Object.entries(this.schedule.raceScheduleEntries).reduce((acc, [key, value]) => {
                        acc[key] = value.scheduledRace
                        return acc;
                    }, {} as RaceScheduleEntries)
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
                        //TODO: Validation Error Event.
                        throw new Error(`❌ Duplicate contestant names found: ${duplicates.join(', ')}`);
                    }

                    // Check that there are no races with the same timeslot
                    // const existingRaces = this.schedule.raceScheduleEntries;

                    // let timeslotTaken = false;

                    // for (const value of Object.values(existingRaces)) {
                    //    
                    //     if (value.raceScheduledStartUnixTime === newData.race.raceScheduledStartUnixTime) {
                    //         timeslotTaken = true;
                    //     }
                    // }

                    // if (timeslotTaken) {
                    //     throw new Error(`❌ A race already exists at this time: ${raceDateTime}`);
                    // }

                    // When checks are performed and there were no conflicts, add the new race to the schedule
                    // ingredients (newRace) + recipe (RaceScheduleEntry) = cake (newRaceState)
                    const newRaceState = new RaceScheduleEntryState(newRace);

                    // Call addRace method from .state to add cake to schedule
                    this.schedule.addRace(newRaceState);

                    // TODO: I' think we'll need to sort the races according to DateTimes in the schedule before i emit the updated schedule

                    //emit updated schedule
                    const updateMessage: RacetrackEvent<RaceScheduleUpdated> = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleUpdated,
                            schedule: Object.entries(this.schedule.raceScheduleEntries).reduce((acc, [key, value]) => {
                                acc[key] = value.scheduledRace;
                                return acc;
                            }, {} as RaceScheduleEntries)
                        }
                    };


                    socketNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage); // Emit the message, so everyone who needs can listen

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
                            schedule: Object.entries(this.schedule.raceScheduleEntries).reduce((acc, [key, value]) => {
                                acc[key] = value.scheduledRace;
                                return acc;
                            }, {} as RaceScheduleEntries)
                        }
                    };

                    socketNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);

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

                    for (const value of Object.values(existingSchedule)) {
                        console.log(value.raceScheduledStartUnixTime);
                        if (value.raceScheduledStartUnixTime === raceDateTime) {
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
                            schedule: Object.entries(this.schedule.raceScheduleEntries).reduce((acc, [key, value]) => {
                                acc[key] = value.scheduledRace;
                                return acc;
                            }, {} as RaceScheduleEntries)
                        }
                    };

                    socketNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);

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

