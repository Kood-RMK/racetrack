import { useSocket } from "@/components/socket/SocketProvider";
import { ChangeRaceHazard, ChangeRaceIsFinishing, ChangeRaceState, RaceControlCommands, RaceControlEvents, RaceStateChanged } from "@/racetrack/services/race-control/race-control.service";
import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { useState } from "react";


export type ActiveRaceStateBinding = {
  activeRace: ActiveRace;
  trySetHazard: (isHazard: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}


export const useActiveRaceBinding = () : ActiveRaceStateBinding | null => {
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

  // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
  socket.on(RaceControlEvents.RaceStateChanged, (data: RacetrackEvent<RaceStateChanged>) => {
    setActiveRace({
      ...activeRace,
      raceState : data.message.newState,
    });
  });


  socket.on(RaceControlEvents.RaceHazardChanged, (data: RacetrackEvent<ChangeRaceHazard>) => {
    setActiveRace({
      ...activeRace,
      isHazard: data.message.isHazard,
    })
  })

  const trySetHazard = (isHazard: boolean) => {
    const command: RacetrackCommand<ChangeRaceHazard> = {
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
    const command: RacetrackCommand<ChangeRaceIsFinishing> = { 
      senderId: socket.id,
      message : {
        type: RaceControlCommands.ChangeRaceIsFinishing,
        isFinishing: isFinishing,
      }
    }
  }

  const tryChangeRaceState = (newState : RaceState) => {
    const command : RacetrackCommand<ChangeRaceState> = {
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

  return { activeRace, trySetHazard, tryChangeRaceState };
};