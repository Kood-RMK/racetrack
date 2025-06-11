import { DatabaseSync } from 'node:sqlite';
import { RaceContestant, RaceContestantId, RaceSchedule, RaceState, ScheduledRaceId } from 'racetrack-shared/types';

let db: DatabaseSync;

export function initPersistence(databaseInstance: DatabaseSync) {
    db = databaseInstance;
}

export function insertScheduledRace(race: {
    raceId: string;
    raceScheduledStartTimeSlot: string;
}) {
    // stmt = statement
    const stmt = db.prepare(` 
        INSERT INTO scheduled_races (
        raceId,
        raceScheduledStartTimeSlot
        ) VALUES (?, ?)
  `);
    
    try {
        stmt.run(
            race.raceId,
            race.raceScheduledStartTimeSlot,
        );
    } catch (err) {
        console.error("Failed to insert scheduled race:", err);
    }
}


// Delete race info from all relevant tables
export function deleteFromScheduledRace(race: { raceId: string }) {

    const deleteScheduledRace = db.prepare(`
        DELETE FROM scheduled_races WHERE raceId = @raceId;
    `);

    try {
        const result = deleteScheduledRace.run({
            raceId : race.raceId
        });
    } catch (err) {
        console.error(err);
    }

}

export function modifyScheduledRace(race: {
    raceId: string;
    raceScheduledStartTimeSlot?: string;
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

export function upsertRaceContestant(raceId : ScheduledRaceId, contestant: RaceContestant) {

    const sql = `
        INSERT INTO race_contestants(raceId, contestantId, name, racecarNumber)
        VALUES(@raceId, @contestantId, @name, @racecarNumber)
        ON CONFLICT(contestantId)
        DO
        UPDATE SET name = @name, racecarNumber = @racecarNumber
        WHERE contestantId = @contestantId
    `;
    const stmt = db.prepare(sql);

    stmt.run({
        name: contestant.name,
        racecarNumber : contestant.racecarNumber,
        raceId : raceId,
        contestantId : contestant.contestantId
    });
}

export function clearRemovedRaceContestants(raceId : ScheduledRaceId, existingContestantIds : RaceContestantId[])  {

    const placeholders = existingContestantIds.map(() => '?').join(',');
    const sql = `
        DELETE FROM race_contestants
        WHERE raceId = ? AND contestantId NOT IN (${placeholders})
    `
    const stmt = db.prepare(sql);
    stmt.run(raceId, ...existingContestantIds);
}


export function loadFromDatabase(): RaceSchedule {
    const scheduledRacesStmt = db.prepare(`SELECT * FROM scheduled_races`);
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
            raceState: RaceState.Pending,
            contestants,
        };
    }

    console.log(raceSchedule);
    return raceSchedule;
}