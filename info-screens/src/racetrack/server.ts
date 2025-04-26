import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { RaceScheduleService } from './services/race-schedule/race-schedule.service';
import { RaceControlService } from './services/race-control/race-control.service';
import { ActiveRaceService } from './services/active-race/active-race.service';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});


// leaderboardService(io);
const activeRaceService = new ActiveRaceService(io);
const raceControlService = new RaceControlService(io, activeRaceService);
// new RaceScheduleService(io);

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
