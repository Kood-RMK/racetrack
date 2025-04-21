import type { Server as SocketIOServer } from "socket.io";
import { Race } from "types/stateTypes";
import { RacetrackCommand, RacetrackEvent } from "types/messageTypes";


const raceSchedule : Race[] = []

// Events sent from server to client
export type NewRaceScheduled = {
    type : "newRaceScheduled"
};

export type RaceScheduleState = {
    type: "raceScheduleState";
    schedule:  Race[];
};

export type RaceScheduleUpdated = {
    type: "raceScheduleUpdated";
    schedule: Race[];
}

export type RaceScheduleEvents = NewRaceScheduled | RaceScheduleState | RaceScheduleUpdated;

// Commands sent from client to server
export type ScheduleNewRace = {
    type : "scheduleNewRace"
    data : {
        race : Race
    }
};

export type DeleteRace = {
    type : "deleteRace"
    data : {
        race : Race
    }
}

export type ModifyRace = {
    type : "modifyRace"
    data : {
        race : Race
    }
}

export type RaceScheduleCommands = ScheduleNewRace | DeleteRace | ModifyRace;


export function raceScheduleService(io : SocketIOServer) {

    // If connected...
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        
        // RaceScheldueState event to send the newest state to the newly connected client
        const initialState: RaceScheduleState = {
            type: "raceScheduleState",
            schedule: raceSchedule,
        };

        const initialStateMessage : RacetrackEvent<RaceScheduleState> = {
            message : initialState
        }

        socket.emit("raceScheduleState", initialStateMessage);
        console.log("📤 Sent initial race schedule state to client:", socket.id);

        // Recieve driver data from AdminPlacementCard
        socket.on("scheduleNewRace", (command: RacetrackCommand<ScheduleNewRace>) => {
            const data = command.message.data;
            const newRace = data.race;
            
            // Check that all the names in a race are unique
            const names = newRace.contestants.map(c => c.name.trim().toLowerCase());
            const uniqueNames = new Set(names);

            if (uniqueNames.size !== names.length) {

                console.log(`❌ Duplicate names found in Race, names need to be unique.`);
                socket.emit("errorSchedulingRace", {
                    message: "Duplicate contestant names are not allowed."
                });

                return;
            }

            // Check that there are no races with the same timeslot
            // const isTimeSlotTaken = raceSchedule.some(
            //     // Callback function, checks the new races time against every existing races time in race Schedule
            //     (scheduledRace) => scheduledRace.raceDateTime === data.raceDateTime
            // );
    
            // if (isTimeSlotTaken) {
            //     console.log("Race time slot conflict. Not adding the race.");
            //     socket.emit("errorSchedulingRace", {
            //         message: "A race is already scheduled at that time."
            //     });
            //     return;
            // }
            
            
            // If no conflicts, add the new race to the schedule
            raceSchedule.push(newRace);

            console.log("Race Schedule:", raceSchedule);

            // We just need to emit the updated schedule every time, right? And not the individula races
        
            const raceScheduleUpdatedMessage : RacetrackEvent<RaceScheduleUpdated> = {
                message : {
                    type : "raceScheduleUpdated",
                    schedule : raceSchedule
                }
            } 

            io.emit("raceScheduleUpdated", raceScheduleUpdatedMessage);
            console.log("race schedule was updated", JSON.stringify(raceSchedule, null, 2));
        });

    
        socket.on("deleteRace", (command: RacetrackCommand<DeleteRace>) => {
            const raceId = command.message.data.race.raceId;

            // Step 1: Determine the race ID to remove
            const idToRemove = raceId;

            // Step 2: Create a new array that excludes the race with the specified ID
            const filteredRaces = raceSchedule.filter((race) => race.raceId !== idToRemove);

            // Step 3: Replace the contents of raceSchedule with the filtered races
            raceSchedule.splice(0, raceSchedule.length, ...filteredRaces);


            console.log("🗑️ Race deleted:", raceId);
            console.log("📋 Updated Schedule:", raceSchedule);
          
            // Emit updated schedule
            const updated: RacetrackEvent<RaceScheduleUpdated> = {
              message: {
                type: "raceScheduleUpdated",
                schedule: raceSchedule
              }
            };
          
            io.emit("raceScheduleUpdated", updated);
          });

          

          socket.on("modifyRace", (command: RacetrackCommand<ModifyRace>) => {
            const updatedRace = command.message.data.race;
            const idToModify = updatedRace.raceId;
          
            const index = raceSchedule.findIndex(r => r.raceId === idToModify);
                if (index !== -1) {
                raceSchedule[index] = updatedRace;
                }

            // Emit updated schedule
            const updated: RacetrackEvent<RaceScheduleUpdated> = {
                message: {
                  type: "raceScheduleUpdated",
                  schedule: raceSchedule
                }
              };
            
            io.emit("raceScheduleUpdated", updated);
            console.log("✅ Race updated:", updatedRace);
          });

    })

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
}
