import type { Server as SocketIOServer } from "socket.io";
import { Contestant, Race } from "types/stateTypes";
import { RacetrackCommand, RacetrackEvent } from "types/messageTypes";
import { RaceScheduleState, RaceState } from "./race-schedule.state";

// Message Types
export enum RaceScheduleEvents {
    NewRaceScheduled = "newRaceScheduled",
    RaceScheduleInitialState = "raceScheduleinitialState",
    RaceScheduleUpdated = "raceScheduleUpdated",
}

export enum RaceScheduleCommands {
    ScheduleNewRace = "scheduleNewRace",
    DeleteRace = "deleteRace",
    ModifyRace = "ModifyRace"
}


// Events (sent from server to client)
export type RaceScheduleInitialState = {
    type: RaceScheduleEvents.RaceScheduleInitialState,
    schedule: Race[],
};

export type RaceScheduleUpdated = {
    type: RaceScheduleEvents.RaceScheduleUpdated,
    schedule: Race[],
}



// Commands (sent from client to server)
export type ScheduleNewRace = {
    type: RaceScheduleCommands.ScheduleNewRace,
    data: {
        race: Race
    }
};

export type DeleteRace = {
    type: RaceScheduleCommands.DeleteRace
    data: {
        race: Race
    }
}

export type ModifyRace = {
    type: RaceScheduleCommands.ModifyRace
    data: {
        race: Race
    }
}

//Handlers
export class RaceScheduleService {
    private schedule: RaceScheduleState;
    private io: SocketIOServer;

    private readonly raceServiceRoom = "raceServiceRoom";

    constructor(io: SocketIOServer) {
        this.schedule = new RaceScheduleState();
        this.io = io;

        const raceServiceNamespace = this.io.of("/race-service");

        // Middleware to check if the user is authenticated.
        raceServiceNamespace.use((socket, next) => {
            next();
        })

        // Siia kolime siis InitialState eventid ja raceScheduleUpdated eventi
        const onRaceScheduleUpdated = (schedule: Race[]) => {

            try {
                const scheduleStateMessage: RacetrackEvent<RaceScheduleInitialState> = {
                    message: {
                        type: RaceScheduleEvents.RaceScheduleInitialState,
                        schedule: this.schedule.getRaceScheduleState.map((value) => value.getRace)
                    }
                }

                raceServiceNamespace
                    .to(this.raceServiceRoom)
                    .emit(RaceScheduleEvents.RaceScheduleInitialState, scheduleStateMessage);
            } catch (error) {
                console.error(`Error processing ${RaceScheduleEvents.RaceScheduleInitialState} event:`, error);
            }
        }
            


        // Siia jäävad kõik commandid ja kasutavad sealt ülevalt evente
        raceServiceNamespace.on("connection", (client) => {

            console.log(`👩‍💻 Race Schedule Service: New Client Connected! ID:`, client.id)

            function initializeClientRooms() {
                client.join("raceServiceRoom");
            }

            // Add new client to the raceControlRoom. 
            // TODO: select room based on assigned role.
            initializeClientRooms();


            // Build and send the initial state message to this specific client
            const onInitialRaceState = () => {
                try {
                    const scheduleStateMessage: RacetrackEvent<RaceScheduleInitialState> = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleInitialState,
                            schedule: this.schedule.getRaceScheduleState.map((value) => value.getRace)
                        }
                    };
        
                    client.emit(RaceScheduleEvents.RaceScheduleInitialState, scheduleStateMessage);
                } catch (error) {
                    console.error(`Error processing ${RaceScheduleEvents.RaceScheduleInitialState} event:`, error);
                }
            };
        
            onInitialRaceState();
            

            // Receive new race event
            client.on(RaceScheduleCommands.ScheduleNewRace, (command: RacetrackCommand<ScheduleNewRace>) => {

                try {

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }

                    const newData = command.message.data;

                    const newRace = newData.race;
                    const { contestants, raceDateTime, raceId, raceState } = newRace

                    // Check to ensure there are no duplicate names in the new race
                    const duplicates = contestants
                        .map(contestant => contestant.name.trim().toLowerCase()) // Create a new array 'duplicates' 
                        .reduce((accumulatorArray, name, _, arr) => {
                            if (arr.indexOf(name) !== arr.lastIndexOf(name) && !accumulatorArray.includes(name)) {
                                accumulatorArray.push(name);
                            }
                            return accumulatorArray;
                        }, [] as string[]);

                    if (duplicates.length) {
                        throw new Error(`❌ Duplicate contestant names found: ${duplicates.join(', ')}`);
                    }

                    // Check that there are no races with the same timeslot
                    const existingRaces = this.schedule.getRaceScheduleState;

                    const hasClashingRace = existingRaces.some(
                        raceState => raceState.getRaceDateTime === raceDateTime
                    );

                    if (hasClashingRace) {
                        throw new Error(`❌ A race already exists at this time: ${raceDateTime}`);
                    }

                    // Add new race to the schedule
                    const newRaceState = new RaceState();
                    newRaceState.setRaceId(raceId);
                    newRaceState.setContestants(contestants);
                    newRaceState.setRaceDateTime(raceDateTime);
                    newRaceState.setRaceState(raceState);

                    // Update the internal race schedule
                    const updatedSchedule = [...existingRaces, newRaceState];
                    this.schedule.setRaceScheduleState(updatedSchedule);

                    // Emit updated schedule to all clients
                    const updateMessage = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleUpdated,
                            schedule: updatedSchedule.map(raceState => raceState.getRace)
                        }
                    };

                    raceServiceNamespace.emit(RaceScheduleEvents.RaceScheduleUpdated, updateMessage);

                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.ScheduleNewRace} command:`, error);
                }
            })

            client.on(RaceScheduleCommands.DeleteRace, (command: RacetrackCommand<DeleteRace>) => {

                try {

                    if (!command.message) {
                        throw new Error("message is undefined.");
                    }
                    
                    // Step 1: Determine the race ID to remove
                    const idToRemove = command.message.data.race.raceId;
                    const existingRaces = this.schedule.getRaceScheduleState;
                    
                    // Step 2: Create a new array that excludes the race with the specified ID
                    const filteredRaces = existingRaces.filter((race) => race.getRaceId !== idToRemove);

                    // Step 3: Replace the contents of raceSchedule with the filtered races
                    const updatedSchedule = existingRaces.splice(0, existingRaces.length, ...filteredRaces);
                    this.schedule.setRaceScheduleState(updatedSchedule);


                    console.log("🗑️ Race deleted:", idToRemove);
                    console.log("📋 Updated Schedule:", existingRaces);

                    this.schedule.setRaceScheduleState(updatedSchedule);

                    // Emit updated schedule
                    const updated: RacetrackEvent<RaceScheduleUpdated> = {
                        message: {
                            type: RaceScheduleEvents.RaceScheduleUpdated,
                            schedule: updatedSchedule.map(raceState => raceState.getRace)
                        }
                    };

                    io.emit("raceScheduleUpdated", updated);

                } catch (error) {
                    console.error(`Error processing ${RaceScheduleCommands.DeleteRace} command:`, error);
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

