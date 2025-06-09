import jwt from 'jsonwebtoken';
import { Logger } from 'pino';
import { RacetrackAuthenticatedClient, RacetrackClientRole } from 'racetrack-shared/types';
import { Socket } from 'socket.io';

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

export async function useRacetrackAuth(socket: Socket, logger : Logger, permittedRoles : RacetrackClientRole[]) : Promise<boolean> {
    const token = socket.handshake.auth.token;

    console.log(socket.handshake.auth);

    if (permittedRoles.includes(RacetrackClientRole.GUEST)) {
        return true;   
    }

    if (!token) {
        logger.error('Authentication error: No token provided');
        return false;
    }

    return await verifyRacetrackClientToken(token)
        .then((client) => {

            // Return the role for further processing if needed
            if (client.role && permittedRoles.includes(client.role)) {
                return true;
            }

            return false;
        })
        .catch((err) => {
            logger.error('Authentication error:', err);
            return false;
        });
}