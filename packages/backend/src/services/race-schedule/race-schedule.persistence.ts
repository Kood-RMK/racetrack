/* The purpose of this file is to ccreate functions for:

    1) Inserting data into db
    2) Updating data in db Overwrite
    3) Deleting data from db

    Pay attention to:
        1) Are the tables properly joined where they have to be?
*/
import { DatabaseSync } from 'node:sqlite';
import { RaceContestant, RaceSchedule, RaceState } from 'racetrack-shared/types';

let db: DatabaseSync;

export function initPersistence(databaseInstance: DatabaseSync) {
    db = databaseInstance;
}

export function insertScheduledRace(race: {
    raceId: string;
    raceScheduledStartTimeSlot: string;
    raceState: string;
    isHazard: boolean;
    isFinishing: boolean;
    timeLeft: number;
}) {
    // stmt = statement
    const stmt = db.prepare(` 
        INSERT INTO races (
        raceId,
        raceScheduledStartTimeSlot,
        raceState,
        isHazard,
        isFinishing,
        timeLeft
        ) VALUES (?, ?, ?, ?, ?, ?)
  `);

    stmt.run(
        race.raceId,
        race.raceScheduledStartTimeSlot,
        race.raceState,
        race.isHazard ? 1 : 0,
        race.isFinishing ? 1 : 0,
        race.timeLeft
    );
}


export function insertRaceContestant(contestant: {
    raceId: string;
    contestantId: string;
    name: string;
    racecarNumber: number;
}) {
    const stmt = db.prepare(`
        INSERT INTO race_contestants (
            raceId,
            contestantId,
            name,
            racecarNumber
        ) VALUES (?, ?, ?, ?)
    `);

    stmt.run(
        contestant.raceId,
        contestant.contestantId,
        contestant.name,
        contestant.racecarNumber
    );
}


// Delete race info from all relevant tables
export function deleteFromScheduledRace(race: { raceId: string }) {
    const deleteScheduledRaceContestants = db.prepare(`
        DELETE FROM race_contestants WHERE raceId = ?
    `);

    const deleteScheduledRace = db.prepare(`
        DELETE FROM races WHERE raceId = ?
    `);
    
    deleteScheduledRaceContestants.run(race.raceId);
    deleteScheduledRace.run(race.raceId);
}

export function modifyScheduledRace(race: {
    raceId: string;
    raceScheduledStartTimeSlot?: string;
    raceState?: string;
    isHazard?: boolean;
    isFinishing?: boolean;
    timeLeft?: number;
}) {
    // Build dynamic SQL update parts depending on which fields are passed in
    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    if (race.raceScheduledStartTimeSlot !== undefined) {
        fieldsToUpdate.push("raceScheduledStartTimeSlot = ?");
        values.push(race.raceScheduledStartTimeSlot);
    }

    if (fieldsToUpdate.length === 0) {
        throw new Error("No fields provided to update");
    }

    values.push(race.raceId);

    const sql = `
        UPDATE races
        SET ${fieldsToUpdate.join(", ")}
        WHERE raceId = ?
    `;

    const stmt = db.prepare(sql);
    stmt.run(...values);
}


export function loadFromDatabase(): RaceSchedule {
    const scheduledRacesStmt = db.prepare(`SELECT * FROM races`);
    const raceContestantsStmt = db.prepare(`SELECT * FROM race_contestants`);

    const rawScheduledRaces = scheduledRacesStmt.all();
    const rawRaceContestants = raceContestantsStmt.all();

    const raceSchedule: RaceSchedule = {};

    for (const race of rawScheduledRaces) {
        const contestants: RaceContestant[] = rawRaceContestants
            .filter(c => c.raceId === race.raceId)
            .map(c => ({
                raceId: c.raceId as string,
                contestantId: c.contestantId as string,
                name: c.name as string,
                racecarNumber: c.racecarNumber as number,
            }));

         raceSchedule[race.raceId as string] = {
            raceId: race.raceId as string,
            raceScheduledStartTimeSlot: race.raceScheduledStartTimeSlot as string,
            raceState: race.raceState as RaceState,
            contestants,
        };
    }

    console.log(raceSchedule);
    return raceSchedule;
}

// export type ScheduledRaceId = string;

// export type ScheduledRace = {
//     raceId : ScheduledRaceId,
//     contestants : RaceContestant[],
//     raceScheduledStartTimeSlot : string 
//     raceState : RaceState,
// }


// export type RaceSchedule = Record<ScheduledRaceId, ScheduledRace>;

