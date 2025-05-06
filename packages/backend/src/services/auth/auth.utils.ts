import jwt from 'jsonwebtoken';
import { RacetrackAuthenticatedClient } from 'racetrack-shared/types';


export function verifyRacetrackClientToken(token: string): Promise<RacetrackAuthenticatedClient> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as RacetrackAuthenticatedClient);
            }
        });
    });
}