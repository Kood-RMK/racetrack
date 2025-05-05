import { Logger } from "pino";
import { RacetrackClientRole } from "./auth.service";
import { verifyRacetrackClientToken } from "./auth.utils";

import type { Socket} from "socket.io";


export function useRacetrackAuth(socket: Socket, next: (err?: Error) => void, logger : Logger, permittedRoles : RacetrackClientRole[] = []) {
    const token = socket.handshake.auth.token;

    if (!token) {
        logger.error('Authentication error: No token provided');
        return next(new Error('Authentication error: No token provided'));
    }

    verifyRacetrackClientToken(token)
        .then((client) => {

            if (client.role && !permittedRoles.includes(client.role)) {
                logger.error(`Authentication error: Client with role ${client.role} is not allowed to connect. Allowed roles: ${permittedRoles}`);
                return next(new Error('Authentication error: Invalid role'));
            }

            next();
        })
        .catch((err) => {
            logger.error('Authentication error:', err);
            next(new Error('Authentication error: Invalid token'));
        });
}