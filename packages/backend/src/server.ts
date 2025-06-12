import { createServer } from 'node:http';
import { Server } from 'socket.io';
import pino from 'pino';
import pretty from 'pino-pretty';
import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';


import { RaceScheduleService } from './services/race-schedule/race-schedule.service';
import { RaceControlService } from './services/race-control/race-control.service';
import { ActiveRaceService } from './services/active-race/active-race.service';
import { RaceObserverService } from './services/race-observer/race-observer.service';
import { AuthService } from './services/auth';
import { initPersistence } from './services/race-schedule/race-schedule.persistence';

import { parse } from 'url'
import next from 'next'

function validateEnvironmentVariables() {
  const requiredVars = [
    'RECEPTIONIST_KEY',
    'OBSERVER_KEY',
    'SAFETY_KEY',
    'JWT_SECRET',
    'RACE_DURATION_SECONDS',
    'STOPWATCH_TICK',
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnvironmentVariables();


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
database.exec('PRAGMA foreign_keys = ON;');

function initializeDatabase() {

  database.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_races (
        raceId TEXT PRIMARY KEY,
        raceScheduledStartTimeSlot TEXT NOT NULL
    );`);

  database.exec(`
      CREATE TABLE IF NOT EXISTS active_race (
        raceId TEXT PRIMARY KEY,
        raceScheduledStartTimeSlot TEXT NOT NULL,
        raceState TEXT NOT NULL,
        isHazard BOOLEAN NOT NULL,
        isFinishing BOOLEAN NOT NULL,
        timeLeft INT NOT NULL
    );`);

  database.exec(`
    CREATE TABLE IF NOT EXISTS race_contestants (
        contestantId TEXT PRIMARY KEY,
        raceId TEXT NOT NULL,
        name TEXT NOT NULL,
        racecarNumber INT NOT NULL,
        FOREIGN KEY (raceId) REFERENCES scheduled_races(raceId) ON DELETE CASCADE
      );`)

  database.exec(`CREATE TABLE IF NOT EXISTS active_race_contestants (
      contestantId TEXT PRIMARY KEY,
      activeRaceId TEXT NOT NULL,
      name TEXT NOT NULL,
      racecarNumber INT NOT NULL,
      place INT NOT NULL,
      lapCount INT NOT NULL,
      fastestLap INT,
      lapStopwatchTime INT NOT NULL,
      FOREIGN KEY (activeRaceId) REFERENCES active_race(raceId) ON DELETE CASCADE
    );`)
}

initializeDatabase();
initPersistence(database);


const authService = new AuthService(logger);

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, turbo: true, turbopack : true, dir : '../frontend' })
const handle = nextApp.getRequestHandler()
 

nextApp.prepare().then(() => {

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
    authService.handle(req, res, parsedUrl);
  }).listen(port)

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    }
  });

  const activeRaceService = new ActiveRaceService(io, logger, database);
  const raceControlService = new RaceControlService(io, activeRaceService, logger);
  const raceObserverService = new RaceObserverService(io, activeRaceService, logger);
  const raceScheduleService = new RaceScheduleService(io, logger, activeRaceService);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})

// server.listen(3001, () => {
//   console.log('server running at http://localhost:3001');
// });
