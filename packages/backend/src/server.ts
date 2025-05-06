import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import pino from 'pino';
import pretty from 'pino-pretty';
import cors from 'cors';
import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';


import { RaceScheduleService } from './services/race-schedule/race-schedule.service';
import { RaceControlService } from './services/race-control/race-control.service';
import { ActiveRaceService } from './services/active-race/active-race.service';
import { RaceObserverService } from './services/race-observer/race-observer.service';
import { RaceScheduleState } from './services/race-schedule/race-schedule.state';
import { AuthService } from './services/auth';

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
}))


const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"], 
  }
});

io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);
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

const database = new DatabaseSync('racetrack.db')

function initializeDatabase() {
  database.exec(`
      CREATE TABLE IF NOT EXISTS active_races (
        raceId TEXT PRIMARY KEY,
        raceScheduledStartUnixTime INT NOT NULL,
        raceState TEXT NOT NULL,
        isHazard BOOLEAN NOT NULL,
        isFinishing BOOLEAN NOT NULL,
        timeLeft INT NOT NULL
    );`);

    database.exec(`CREATE TABLE IF NOT EXISTS race_contestants (
      contestantId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      racecarNumber INT NOT NULL
    );`)

    database.exec(`CREATE TABLE IF NOT EXISTS active_race_contestants (
      contestantId TEXT PRIMARY KEY,
      activeRaceId TEXT NOT NULL,
      place INT NOT NULL,
      lapCount INT NOT NULL,
      fastestLap INT NOT NULL,
      lapStopwatchTime INT NOT NULL,
      FOREIGN KEY (contestantId) REFERENCES race_contestants(contestantId),
      FOREIGN KEY (activeRaceId) REFERENCES active_races(raceId)
    );`)
}

initializeDatabase();


const authService = new AuthService(app, logger);

// leaderboardService(io);
const activeRaceService = new ActiveRaceService(io, logger, database);
const raceControlService = new RaceControlService(io, activeRaceService, logger);
const raceObserverService = new RaceObserverService(io, activeRaceService, logger);

// new RaceScheduleService(io);
const raceScheduleService = new RaceScheduleService(io, logger);

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
