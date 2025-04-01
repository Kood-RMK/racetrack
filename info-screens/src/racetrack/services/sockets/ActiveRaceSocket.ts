import { io, Socket } from 'socket.io-client';
import { useState } from 'react';
import { ActiveRace, RaceState } from 'state';
import { RaceStateChanged } from 'services/racecontrol.service';

// This file will manage the socket connection and handle state updates
export const useRaceSocket = () => {
  const [activeRace, setActiveRace] = useState<ActiveRace>({
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00',
  });

  let socket: Socket;

  const connectSocket = () => {
    // Create a new socket connection
    socket = io("http://localhost:3001");

    // when recieving a new race state...
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