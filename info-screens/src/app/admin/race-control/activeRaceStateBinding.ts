import { useSocket } from "@/components/socket/ClientProvider";
import { RaceStateChanged } from "@/racetrack/services/racecontrol.service";
import { ActiveRace, RaceState } from "@/racetrack/state";
import { RacetrackCommand, RacetrackEvent } from "@/racetrack/types/messageTypes";
import { useEffect, useState } from "react";


export type ActiveRaceBinding = {
  activeRace: ActiveRace;
  setHazard: (isHazard: boolean) => void;
}


export const useActiveRaceBinding = () : ActiveRaceBinding | undefined => {
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

  const setHazard = (isHazard: boolean) => {
    setActiveRace((prevState) => ({
      ...prevState,
      isHazard,
    }));

    const command: RacetrackCommand<ActiveRace> = {
      senderId: socket.id ?? "unknown", // or however you're managing sender identity
      message: activeRace,
    };

    socket.emit("changeRaceState", command);
  }

  return { activeRace, setHazard };
};