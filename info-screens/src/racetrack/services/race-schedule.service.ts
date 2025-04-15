import type { Server as SocketIOServer } from "socket.io";
import { Race } from "state";


const raceSchedule : Race[] = []

export type RaceScheduleEvents = "raceScheduleUpdated' | 'raceScheduleState";
// export type RaceScheduleCommands = ''


// Events 
// export type ReceScheduleEvents = NewRaceScheduled;
export type RaceScheduleCommands = ScheduleNewRace;

// export type NewRaceScheduled = {
//     type : "newRaceScheduled",
// }

export type ScheduleNewRace = {
    type : "scheduleNewRace"
}


export function raceScheduleService(io : SocketIOServer) {


    // kontrollib ühendust
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Recieve driver data from AdminPlacementCard
        socket.on("scheduleNewRace", (data : Race) => {
            
            const names = data.contestants.map(c => c.name.trim().toLowerCase());
            const uniqueNames = new Set(names);

            if (uniqueNames.size !== names.length) {
                console.log(`❌ Duplicate names found in Race, names need to be unique.`);
                socket.emit("errorSchedulingRace", {
                    message: "Duplicate contestant names are not allowed."
            });
            return;
            }

            // Check that there are no races with the same timeslot
            const isTimeSlotTaken = raceSchedule.some(
                // Callback function, checks the new races time against every existing races time in race Schedule
                (scheduledRace) => scheduledRace.raceDateTime === data.raceDateTime
            );
    
            if (isTimeSlotTaken) {
                console.log("Race time slot conflict. Not adding the race.");
                socket.emit("errorSchedulingRace", {
                    message: "A race is already scheduled at that time."
                });
                return;
            }

            let race: Race = { ...data };
            console.log("Race data:", race);

            
            
            raceSchedule.push(race);
            console.log("Race Schedule:", raceSchedule);
            
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
}
