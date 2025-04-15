import type { Server as SocketIOServer } from "socket.io";
import { ActiveRace, RaceState } from "state";
import { RacetrackEvent, RacetrackCommand } from "types/messageTypes"

let activeRace: ActiveRace = {
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00'
}

// Events to communicate Race State changes
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


export function raceControlService(io : SocketIOServer) {

    io.on("connection", (socket) => {

        // Send the current race state only to the newly connected client
        const eventMessage: RacetrackEvent<RaceStateChanged> = {
            message: {
                type: "raceStateChanged",
                newState: activeRace.raceState,
                isHazard: activeRace.isHazard,
                isDanger: activeRace.isDanger,
                isFinishing: activeRace.isFinishing,
            }
        };
        socket.emit("raceStateChanged", eventMessage);

        
        // Recieve race state from RaceControlCard Buttons
        socket.on("changeRaceState", (command: RacetrackCommand<ChangeRaceState>) => {
            const { senderId, message } = command;
            console.log(message.newState);

            activeRace = {
                ...activeRace, // Spread the existing properties to keep contestants, timeLeft, etc.
                raceState: message.newState,
                isHazard: message.isHazard ?? false,
                isDanger: message.isDanger ?? false,
                isFinishing: message.isFinishing ?? false
            };

            console.log('Emitting new state:');
            console.log('isHazard:', activeRace.isHazard);
            console.log('isDanger:', activeRace.isDanger);
            console.log('isFinishing:', activeRace.isFinishing);

            // Send the changed race state to all connected clients
            const responseEvent: RacetrackEvent<RaceStateChanged> = {
                message: {
                    type: "raceStateChanged",
                    newState: activeRace.raceState,
                    isHazard: activeRace.isHazard,
                    isDanger: activeRace.isDanger,
                    isFinishing: activeRace.isFinishing,
                }
            }

            io.emit("raceStateChanged", responseEvent);
        })
    })
}
    

