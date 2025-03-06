import { useEffect, useState } from "react";

const useSceduleSocket = () => {
  const [leaderboard, setScedule] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/race-scedule");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setScedule(data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return leaderboard;
};

export default useSceduleSocket;
