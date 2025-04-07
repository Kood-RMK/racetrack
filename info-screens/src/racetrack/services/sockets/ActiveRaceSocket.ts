import { io, Socket } from 'socket.io-client';
import { useState } from 'react';
import { ActiveRace, RaceState } from 'state';
import { RaceStateChanged } from 'services/racecontrol.service';

// Custom react hook to manage the socket connection and race state change
export const useRaceSocket = () => {
  const [activeRace, setActiveRace] = useState<ActiveRace>({
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00',
  });

  // Declare a socket variable, but does not initialize it yet
  let socket: Socket;

  // Creates a WebSocket connection to the backend server running on port 3001
  const connectSocket = () => {
    socket = io("http://localhost:3001");

    // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
    socket.on("raceStateChanged", (raceState: RaceStateChanged) => {
      console.log("Race state changed:", raceState.newState);

      const fixedRaceState = Array.isArray(raceState.newState) 
        ? raceState.newState[0] 
        : raceState.newState;

      setActiveRace({
        ...activeRace,
        raceState: fixedRaceState as RaceState,
        isHazard: raceState.isHazard ?? false,
        isDanger: raceState.isDanger ?? false,
        isFinishing: raceState.isFinishing ?? false,
        timeLeft: "00:00",
      });
    });
  };

  const disconnectSocket = () => {
    // Logic to disconnect socket when component unmounts or no longer needed
    if (socket) {
        socket.disconnect();
    }
  };

  return { activeRace, connectSocket, disconnectSocket };
};