import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import {leaderboardService} from './services/leaderboard.service';
import { raceControlService } from './services/racecontrol.service';

const app = express();
const server = createServer(app);
const io = new Server(server);




leaderboardService(io);
raceControlService(io);

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
