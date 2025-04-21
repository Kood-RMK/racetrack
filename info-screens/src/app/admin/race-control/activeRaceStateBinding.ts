import { useSocket } from "@/components/socket/SocketProvider";
import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { useState } from "react";
import { ActiveRaceInitialState, ActiveRaceStateChanged, ChangeActiveRaceHazard, ChangeActiveRaceIsFinishing, ChangeActiveRaceState, RaceControlCommands, RaceControlEvents } from "@/racetrack/services/race-control/race-control.service";


export type ActiveRaceStateBinding = {
  activeRace: ActiveRace;
  trySetHazard: (isHazard: boolean) => void;
  trySetFinishing: (isFinishing: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}


export const useActiveRaceStateBinding = () : ActiveRaceStateBinding | null => {
  const [activeRace, setActiveRace] = useState<ActiveRace>({
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isFinishing: false,
    timeLeft: '00:00',
  });

  const socket = useSocket();

  if (!socket) {
    // If the socket is not yet available, return null.
    return null;
  }

  socket.on(RaceControlEvents.RaceInitialState, (data: RacetrackEvent<ActiveRaceInitialState>) => {
    const initalState = data.message.raceInitialState;
    setActiveRace(initalState);

    console.log(`📩 Race Control: Initial Race State Received:`, initalState);
  })

  // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
  socket.on(RaceControlEvents.RaceStateChanged, (data: RacetrackEvent<ActiveRaceStateChanged>) => {
    setActiveRace({
      ...activeRace,
      raceState : data.message.newState,
    });

    console.log(`📩 Race Control: Race State Changed to ${data.message.newState}`);
  });


  socket.on(RaceControlEvents.RaceHazardChanged, (data: RacetrackEvent<ChangeActiveRaceHazard>) => {
    setActiveRace({
      ...activeRace,
      isHazard: data.message.isHazard,
    })
  })

  socket.on(RaceControlEvents.RaceIsFinishingChanged, (data: RacetrackEvent<ChangeActiveRaceIsFinishing>) => {
    setActiveRace({
      ...activeRace,
      isFinishing: data.message.isFinishing,
    })
  })

  const trySetHazard = (isHazard: boolean) => {
    const command: RacetrackCommand<ChangeActiveRaceHazard> = {
      senderId: socket.id,
      message: {
        type: RaceControlCommands.ChangeRaceHazard,
        isHazard: isHazard,
      }
    };

    if (command.message?.type) { 
      socket.emit(command.message.type, command);
    }
  }


  const trySetFinishing = (isFinishing: boolean) => {
    const command: RacetrackCommand<ChangeActiveRaceIsFinishing> = { 
      senderId: socket.id,
      message : {
        type: RaceControlCommands.ChangeRaceIsFinishing,
        isFinishing: isFinishing,
      }
    }
  }

  const tryChangeRaceState = (newState : RaceState) => {
    const command : RacetrackCommand<ChangeActiveRaceState> = {
      senderId: socket.id,
      message : {
        type: RaceControlCommands.ChangeRaceState,
        newState: newState,
      }
    }

    if (command.message?.type) { 
      socket.emit(command.message.type, command);
    }
  }

  return { activeRace, trySetHazard, trySetFinishing, tryChangeRaceState };
};