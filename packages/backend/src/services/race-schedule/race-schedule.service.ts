import type { Server as SocketIOServer } from "socket.io";
import { Logger } from "pino";
import { DeleteRace, ModifyRace, RaceScheduleCommands, RaceScheduleEntries, RaceScheduleEvents, RaceScheduleInitialState, RaceScheduleUpdated, RacetrackClientRole, RacetrackCommand, RacetrackEvent, ScheduledRace, ScheduleNewRace } from "racetrack-shared/types";
import { RaceScheduleEntryState, RaceScheduleState, RaceScheduleStateEvents } from "./race-schedule.state";
import { deleteFromScheduledRace, insertRaceContestant, insertScheduledRace, loadFromDatabase, modifyScheduledRace } from "./race-schedule.persistence";
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


        console.log("Neccessary schedule:", this.schedule.raceScheduleEntries);
        

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

            const stateMessage: RacetrackEvent<RaceScheduleInitialState> = {
                message: {
                    type: RaceScheduleEvents.RaceScheduleInitialState,
                    schedule: this.schedule.sortedSchedule.map(entry => entry.scheduledRace)
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

                    // Create a new RaceScheduleEntry with the updated race data
                    const updatedRaceEntry = new RaceScheduleEntryState(updatedRace);

                    // Overwrite the existing race entry in the schedule
                    this.schedule.modifyRace(updatedRace.raceId, updatedRaceEntry);

                    console.log(`✅ Race with ID ${raceId} modified successfully.`);


                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.ModifyRace} command:`, error);
                }
            })
        })

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

                const {contestants, raceId, raceScheduledStartTimeSlot, raceState } = entry

                insertScheduledRace({
                    raceId: raceId,
                    raceScheduledStartTimeSlot: raceScheduledStartTimeSlot,
                    raceState: raceState,
                    isHazard: false,
                    isFinishing: false,
                    timeLeft: 0
                });

                // ✅ Insert contestants into database
                for (const contestant of contestants) {
                    insertRaceContestant({
                        raceId: raceId,
                        contestantId: contestant.contestantId,
                        name: contestant.name,
                        racecarNumber: contestant.racecarNumber
                    });
                }
        })

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
                    raceState : entry.raceState,
                });
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

