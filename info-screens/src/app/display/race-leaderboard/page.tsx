import { FC } from "react";
import useSceduleSocket from "../../../../client/raceSceduleSocket";

const LeaderboardPage: FC = () => {
  const leaderboard = useSceduleSocket();
  
  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardPage;
