import { useSocket } from "@/components/socket/ClientProvider";
import { RaceStateChanged } from "@/racetrack/services/race-control/race-control.service";
import { ActiveRace, RaceState } from "@/racetrack/types/stateTypes";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { useEffect, useState } from "react";


export type ActiveRaceStateBinding = {
  activeRace: ActiveRace;
  trySetHazard: (isHazard: boolean) => void;
  tryChangeRaceState: (newState: RaceState) => void;
}


export const useActiveRaceBinding = () : ActiveRaceStateBinding | undefined => {
  const [activeRace, setActiveRace] = useState<ActiveRace>({
    contestants: [],
    raceState: 'pending',
    isHazard: false,
    isDanger: false,
    isFinishing: false,
    timeLeft: '00:00',
  });

  const socket = useSocket();

  if (socket == null) {
      return;
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

    const command: RacetrackCommand<ActiveRace> = {
      senderId: socket.id ?? "unknown", // or however you're managing sender identity
      message: activeRace,
    };

    socket.emit("changeRaceState", command);
  }

  const trySetDanger = (isDanger: boolean) => {
    const command: RacetrackCommand<ActiveRace> = {
      senderId: socket.id ?? "unknown",
    }
  }

  const tryChangeRaceState = (newState: RaceState) => {
    const command: RacetrackCommand<ActiveRace> = {
      senderId: socket.id ?? "unknown",
      message: activeRace,
    }
      
    socket.emit("changeRaceState", command);
  }

  return { activeRace, trySetHazard, tryChangeRaceState };
};