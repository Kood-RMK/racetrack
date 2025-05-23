/* The purpose of this file is to ccreate functions for:

    1) Inserting data into db
    2) Updating data in db Overwrite
    3) Deleting data from db

    Pay attention to:
        1) Are the tables properly joined where they have to be?
*/
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('racetrack.db');

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
        INSERT INTO scheduled_races (
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
    const stmt = db.prepare(`
        DELETE FROM scheduled_races WHERE raceId = ?
    `);

    stmt.run(race.raceId);
}
// so now we should export the function into the .srevice file and see if we get a db entry.


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
        UPDATE scheduled_races
        SET ${fieldsToUpdate.join(", ")}
        WHERE raceId = ?
    `;

    const stmt = db.prepare(sql);
    stmt.run(...values);
}


export function loadFromDatabase() {
    const tables = ['scheduled_races', 'race_contestants'];
    const results: Record<string, any[]> = {};

    for (const table of tables) {
        const stmt = db.prepare(`SELECT * FROM ${table}`);
        console.log(stmt);
        results[table] = stmt.all();
    }

    console.log("STMT: ",results);
    return results;
}

