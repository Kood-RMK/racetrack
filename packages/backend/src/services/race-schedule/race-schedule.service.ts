import type { Server as SocketIOServer } from "socket.io";
import { Logger } from "pino";
import { ActiveRaceEvents, ActiveRaceStateChanged, DeleteRace, ModifyRace, RaceControlCommands, RaceScheduleCommands, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackClientRole, RacetrackCommand, RacetrackEvent, ScheduledRace, ScheduleNewRace, StartRace } from "racetrack-shared/types";
import { RaceScheduleEntryState, RaceScheduleState, RaceScheduleStateEvents } from "./race-schedule.state";
import { deleteFromScheduledRace, insertScheduledRace, loadFromDatabase, upsertRaceContestant, modifyScheduledRace, clearRemovedRaceContestants } from "./race-schedule.persistence";
import { useRacetrackAuth } from "../auth";

//Handlers
export class RaceScheduleService {
    private readonly socketIO: SocketIOServer;
    private schedule: RaceScheduleState;
    private readonly logger: Logger;


    constructor(socketIO: SocketIOServer, parentLogger: Logger) {

        this.socketIO = socketIO;
        this.schedule = new RaceScheduleState();
        const logger = parentLogger.child({ serviceName: this.constructor.name })
        this.logger = logger;

        const socketNamespace = this.socketIO.of("/race-schedule");

        // Middleware to check if the user is authenticated.
        this.socketIO.use((socket, next) => {
            useRacetrackAuth(
                socket,
                next,
                this.logger,
                [
                    RacetrackClientRole.OBSERVER,
                    RacetrackClientRole.RECEPTIONIST,
                    RacetrackClientRole.SAFETY
                ]);
        })

        this.socketIO.on("connection", (client) => {
        });


        if (Object.keys(this.schedule.raceScheduleEntries).length === 0) {
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
        }

        // Siia jäävad kõik commandid ja kasutavad sealt ülevalt evente
        socketNamespace.on("connection", (client) => {

            this.logger.info(`New client connected!, ID`, client.id);

            // Only display pending races
            const stateMessage: RacetrackEvent<RaceScheduleInitialState> = {
                message: {
                    type: RaceScheduleEvents.RaceScheduleInitialState,
                    // schedule: this.schedule.sortedSchedule.map(entry => entry.scheduledRace)
                    schedule: this.schedule.sortedSchedule
                        .map(entry => entry.scheduledRace)
                        .filter(race => race.raceState === 'pending')
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
                    const newRaceState = new RaceScheduleEntryState(newRace);

                    this.schedule.addRace(newRaceState);

                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.ScheduleNewRace} command:`, error);
                }
            });

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


                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.DeleteRace} command:`, error);
                }
            });

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

                    // Create a new RaceScheduleEntry with the updated race data
                    const updatedRaceEntry = new RaceScheduleEntryState(updatedRace);

                    // Overwrite the existing race entry in the schedule
                    this.schedule.modifyRace(updatedRace.raceId, updatedRaceEntry);

                    console.log(`✅ Race with ID ${raceId} modified successfully.`);
                    console.log(command.message.data.updates.contestants);


                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.ModifyRace} command:`, error);
                }
            });

            // Delete the race from this.chedule upon receiving raceState: active from the active race namespace
            client.on(RaceControlCommands.StartRace, (command: RacetrackCommand<StartRace>) => {
                try {
                    if (!command.message || !command.message.scheduledRace) {
                        throw new Error("StartRace command missing scheduledRace.");
                    }

                    const raceIdToDelete = command.message.scheduledRace.raceId;
                    this.schedule.deleteRace(raceIdToDelete);
                    console.log("🗑️ Race deleted on StartRace:", raceIdToDelete);

                } catch (error) {
                    console.error(`Error processing ${RaceControlCommands.StartRace} command:`, error);
                }
            });
        })
        // Update the race state
        //     client.on(ActiveRaceEvents.RaceStateChanged, (data: RacetrackEvent<ActiveRaceStateChanged>) => {

        //         const { raceId, newState } = data.message;

        //         console.log("Race SChedule Service inRaceStateChanged", data.message)

        //         // Find and update the race in memory
        //         const existingEntry = this.schedule.raceScheduleEntries[raceId];
        //         if (!existingEntry) {
        //             this.logger.warn(`Race with ID ${raceId} not found in schedule.`);
        //             return;
        //         }

        //         // Clone the race and apply the new state
        //         const updatedRace = {
        //             ...existingEntry.scheduledRace, // this is a plain object
        //             raceState: newState
        //         };

        //         // Create a new RaceScheduleEntryState
        //         const updatedRaceEntry = new RaceScheduleEntryState(updatedRace);

        //         // Update the in-memory schedule (and trigger DB + broadcast)
        //         this.schedule.modifyRace(raceId, updatedRaceEntry);

        //         this.logger.info(`[✅ Race State Changed in this.schedule] Race ID: ${raceId}, New State: ${newState}`);
        //     });



        this.schedule.events.on(RaceScheduleStateEvents.RaceScheduleChanged, (entries => {
            const updateMessage: RacetrackEvent<RaceScheduleUpdated> = {
                message: {
                    type: RaceScheduleEvents.RaceScheduleUpdated,
                    schedule: entries.sortedSchedule.map(entry => entry.scheduledRace)
                }
            };

            socketNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);
        }));

        this.schedule.events.on(RaceScheduleStateEvents.RaceAdded, (entry: RaceScheduleEntryState) => {

            const { contestants, raceId, raceScheduledStartTimeSlot } = entry

            insertScheduledRace({
                raceId: raceId,
                raceScheduledStartTimeSlot: raceScheduledStartTimeSlot,
            });

            // Insert contestants into database
            for (const contestant of contestants) {
                upsertRaceContestant(
                    raceId,
                    contestant
                );
            }
        });

        this.schedule.events.on(RaceScheduleStateEvents.RaceDeleted, (raceId: ScheduledRace['raceId']) => {
            //Remove from database.
            deleteFromScheduledRace({
                raceId: raceId,
            });
        });

        this.schedule.events.on(RaceScheduleStateEvents.RaceModified, (raceId: ScheduledRace['raceId'], entry: RaceScheduleEntryState) => {
            modifyScheduledRace({
                raceId,
                raceScheduledStartTimeSlot: entry.raceScheduledStartTimeSlot,
            });

            clearRemovedRaceContestants(raceId, entry.contestants.map(contestant => contestant.contestantId));

            if (entry.contestants && Array.isArray(entry.contestants)) {
                for (const contestant of entry.contestants) {
                    upsertRaceContestant(
                        raceId,
                        contestant
                    );
                }
            }
        });
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


//Reminders
// 1. Check timeslot overlaps.
// 2. Avoid duplicate drivers.
// 3. Make types for events!!!
// 4. wrap in message types
// 5. sort by timeslot

