import type { Server as IOServer } from "socket.io";
import { ActiveRace, RaceState } from "state";

let activeRace: ActiveRace = {
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00'
}

export type RaceControlEvents = RaceStateChanged;
export type RaceControlCommands = ChangeRaceState;

// Events to communicate Race State changes
export type ChangeRaceState = {
    type : 'changeRaceState',
    newState : RaceState,
} & Partial<Pick<ActiveRace, 'isHazard' | 'isDanger' | 'isFinishing'>>;

export type RaceStateChanged = {
    type : 'raceStateChanged',
    newState : RaceState,
}  & Partial<Pick<ActiveRace, 'isHazard' | 'isDanger' | 'isFinishing'>>;


export function raceControlService(io : IOServer) {

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Send the current race state only to the newly connected client
        socket.emit("raceStateChanged", {
            type: "raceStateChanged",
            newState: activeRace.raceState,
            isHazard: activeRace.isHazard,
            isDanger: activeRace.isDanger,
            isFinishing: activeRace.isFinishing,
        });

        // Recieve driver data from AdminPlacementCard
        socket.on("updateDrivers", (data) => {console.log(data)});

        // Recieve race state from RaceControlCard Buttons
        socket.on("changeRaceState", (raceState: ChangeRaceState) => {
            console.log(raceState.newState);

            activeRace = {
                ...activeRace, // Spread the existing properties to keep contestants, timeLeft, etc.
                raceState: raceState.newState,
                isHazard: raceState.isHazard ?? false,
                isDanger: raceState.isDanger ?? false,
                isFinishing: raceState.isFinishing ?? false
            };

            console.log('Emitting new state:');
            console.log('isHazard:', activeRace.isHazard);
            console.log('isDanger:', activeRace.isDanger);
            console.log('isFinishing:', activeRace.isFinishing);

            // Send the changed race state to all connected clients
            io.emit("raceStateChanged", {
                type: "raceStateChanged",
                newState: activeRace.raceState,
                isHazard: activeRace.isHazard,
                isDanger: activeRace.isDanger,
                isFinishing: activeRace.isFinishing,
            } as RaceStateChanged);
        });
    });
}
