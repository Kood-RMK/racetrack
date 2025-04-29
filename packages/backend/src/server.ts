import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import pino from 'pino';
import pretty from 'pino-pretty';

import { RaceScheduleService } from './services/race-schedule/race-schedule.service';
import { RaceControlService } from './services/race-control/race-control.service';
import { ActiveRaceService } from './services/active-race/active-race.service';
import { RaceObserverService } from './services/race-observer/race-observer.service';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});


const logStream = pretty({
  colorize: true,
  ignore: 'handlerName,serviceName',
  messageFormat: (log, messageKey) => {
     const prefix = `[${log.serviceName ? log.serviceName : ''}${(log.serviceName && log.handlerName) ? ':' : ''}${log.handlerName ? log.handlerName : ''}]`;
      return `${prefix}: ${log[messageKey]}`;
  },
})

const logger = pino(
  {
    base: null,
  },
  logStream,
);

// leaderboardService(io);
const activeRaceService = new ActiveRaceService(io, logger);
const raceControlService = new RaceControlService(io, activeRaceService);
const raceObserverService = new RaceObserverService(io, activeRaceService);
// new RaceScheduleService(io);

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
