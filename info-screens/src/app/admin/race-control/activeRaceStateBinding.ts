import { useSocket } from "@/components/socket/ClientProvider";
import { RaceStateChanged } from "@/racetrack/services/racecontrol.service";
import { ActiveRace, RaceState } from "@/racetrack/state";
import { useState } from "react";

export const useActiveRaceBinding = () => {
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
      console.error("Socket connection failed");
      return;
  }

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

  const setHazard = (isHazard: boolean) => {
    setActiveRace((prevState) => ({
      ...prevState,
      isHazard,
    }));

    socket.emit("changeRaceState", activeRace);
  }

  return { activeRace, setHazard };
};