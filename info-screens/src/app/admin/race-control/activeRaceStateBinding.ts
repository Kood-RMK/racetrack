import { useSocket } from "@/components/socket/SocketProvider";
import { ChangeRaceDanger, ChangeRaceFinishing, ChangeRaceHazard, ChangeRaceState, RaceControlCommands, RaceStateChanged } from "@/racetrack/services/race-control/race-control.service";
import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { useState } from "react";


export type ActiveRaceStateBinding = {
  activeRace: ActiveRace;
  trySetHazard: (isHazard: boolean) => void;
  trySetDanger: (isDanger: boolean) => void;
  trySetFinishing: (isFinishing: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}


export const useActiveRaceBinding = () : ActiveRaceStateBinding | null => {
  const [activeRace, setActiveRace] = useState<ActiveRace>({
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00',
  });

  const socket = useSocket();

  if (!socket) {
    // If the socket is not yet available, return null.
    return null;
  }


  // Listens for race state updates. When "raceStateChanged" is received, the callback function is executed
  socket.on("raceStateChanged", (data: RacetrackEvent<RaceStateChanged>) => {
    const raceState = data.message.newState;

    console.log("NewState: ", raceState);

    setActiveRace({
      ...activeRace,
      raceState: raceState,
      isHazard: raceState.isHazard ?? false,
      isDanger: raceState.isDanger ?? false,
      isFinishing: raceState.isFinishing ?? false,
      timeLeft: "00:00",
    });
  });

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

  const trySetDanger = (isDanger: boolean) => {
    const command : RacetrackCommand<ChangeRaceDanger> = {
      senderId: socket.id,
      message: {
        type: RaceControlCommands.ChangeRaceDanger,
        isDanger: isDanger,
      }
    }

    if (command.message?.type) { 
      socket.emit(command.message.type, command);
    }
  }

  const trySetFinishing = (isFinishing: boolean) => {
    const command : RacetrackCommand<ChangeRaceFinishing> = {
      senderId: socket.id,
      message : {
        type: RaceControlCommands.ChangeRaceFinishing,
        isFinishing: isFinishing,
      }
    }

    if (command.message?.type) { 
      socket.emit(command.message.type, command);
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

  return { activeRace, trySetHazard, trySetDanger, trySetFinishing, tryChangeRaceState };
};